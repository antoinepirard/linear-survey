import {
  Survey,
  SurveyResponse,
  CreateSurveyInput,
  UpdateSurveyInput,
  SubmitResponseInput,
} from "../types";
import { DatabaseAdapter, SurveyStatus } from "./types";

/**
 * PostgreSQL adapter using native pg client
 * For generic PostgreSQL databases (not Supabase)
 */
export class PostgresAdapter implements DatabaseAdapter {
  readonly name = "postgres";
  private pool: import("pg").Pool | null = null;
  private initialized = false;

  get isConfigured(): boolean {
    return !!process.env.DATABASE_URL;
  }

  private async getPool(): Promise<import("pg").Pool> {
    if (!this.initialized) {
      const url = process.env.DATABASE_URL;
      if (!url) {
        throw new Error("DATABASE_URL is not configured");
      }
      // Dynamic import to avoid issues in browser
      const { Pool } = await import("pg");
      this.pool = new Pool({ connectionString: url });
      this.initialized = true;
    }
    return this.pool!;
  }

  // ============================================
  // Survey operations
  // ============================================

  async getSurveys(status: SurveyStatus = "active"): Promise<Survey[]> {
    const pool = await this.getPool();
    const result = await pool.query(
      `SELECT * FROM surveys WHERE status = $1 ORDER BY created_at DESC`,
      [status]
    );
    return result.rows;
  }

  async getSurvey(id: string): Promise<Survey | null> {
    const pool = await this.getPool();
    const result = await pool.query(`SELECT * FROM surveys WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  async createSurvey(input: CreateSurveyInput): Promise<Survey> {
    const pool = await this.getPool();
    const result = await pool.query(
      `INSERT INTO surveys (title, description, questions, groups, linear_config, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'active', NOW())
       RETURNING *`,
      [
        input.title,
        input.description,
        JSON.stringify(input.questions),
        JSON.stringify(input.groups || []),
        input.linear_config ? JSON.stringify(input.linear_config) : null,
      ]
    );
    return result.rows[0];
  }

  async updateSurvey(id: string, input: UpdateSurveyInput): Promise<Survey> {
    const pool = await this.getPool();
    
    // Build dynamic update query
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (input.title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      values.push(input.title);
    }
    if (input.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(input.description);
    }
    if (input.questions !== undefined) {
      updates.push(`questions = $${paramIndex++}`);
      values.push(JSON.stringify(input.questions));
    }
    if (input.groups !== undefined) {
      updates.push(`groups = $${paramIndex++}`);
      values.push(JSON.stringify(input.groups));
    }
    if (input.linear_config !== undefined) {
      updates.push(`linear_config = $${paramIndex++}`);
      values.push(input.linear_config ? JSON.stringify(input.linear_config) : null);
    }
    if (input.status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(input.status);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE surveys SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      throw new Error("Survey not found");
    }
    return result.rows[0];
  }

  async deleteSurvey(id: string): Promise<void> {
    const pool = await this.getPool();
    await pool.query(`DELETE FROM surveys WHERE id = $1`, [id]);
  }

  async archiveSurvey(id: string): Promise<Survey> {
    return this.updateSurvey(id, { status: "archived" });
  }

  async restoreSurvey(id: string): Promise<Survey> {
    return this.updateSurvey(id, { status: "active" });
  }

  // ============================================
  // Response operations
  // ============================================

  async getResponses(surveyId: string): Promise<SurveyResponse[]> {
    const pool = await this.getPool();
    const result = await pool.query(
      `SELECT * FROM responses WHERE survey_id = $1 ORDER BY created_at DESC`,
      [surveyId]
    );
    return result.rows;
  }

  async getResponse(id: string): Promise<SurveyResponse | null> {
    const pool = await this.getPool();
    const result = await pool.query(`SELECT * FROM responses WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  async submitResponse(input: SubmitResponseInput): Promise<SurveyResponse> {
    const pool = await this.getPool();
    const result = await pool.query(
      `INSERT INTO responses (survey_id, answers, created_at)
       VALUES ($1, $2, NOW())
       RETURNING *`,
      [input.survey_id, JSON.stringify(input.answers)]
    );
    return result.rows[0];
  }

  async updateResponseLinearIssue(
    responseId: string,
    linearIssueId: string
  ): Promise<void> {
    const pool = await this.getPool();
    await pool.query(
      `UPDATE responses SET linear_issue_id = $1 WHERE id = $2`,
      [linearIssueId, responseId]
    );
  }

  async deleteResponse(id: string): Promise<void> {
    const pool = await this.getPool();
    await pool.query(`DELETE FROM responses WHERE id = $1`, [id]);
  }

  // ============================================
  // Settings operations
  // ============================================

  async getSetting<T = unknown>(key: string): Promise<T | null> {
    const pool = await this.getPool();
    const result = await pool.query(
      `SELECT value FROM settings WHERE key = $1`,
      [key]
    );
    return result.rows[0]?.value || null;
  }

  async setSetting<T = unknown>(key: string, value: T): Promise<void> {
    const pool = await this.getPool();
    await pool.query(
      `INSERT INTO settings (key, value, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
      [key, JSON.stringify(value)]
    );
  }

  async deleteSetting(key: string): Promise<void> {
    const pool = await this.getPool();
    await pool.query(`DELETE FROM settings WHERE key = $1`, [key]);
  }

  // ============================================
  // Connection
  // ============================================

  async testConnection(): Promise<boolean> {
    try {
      const pool = await this.getPool();
      await pool.query("SELECT 1");
      return true;
    } catch {
      return false;
    }
  }

  async runMigrations(): Promise<void> {
    const pool = await this.getPool();
    
    // Run schema migrations
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS surveys (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT NOT NULL DEFAULT '',
        description TEXT NOT NULL DEFAULT '',
        questions JSONB NOT NULL DEFAULT '[]',
        groups JSONB NOT NULL DEFAULT '[]',
        linear_config JSONB DEFAULT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ
      );

      CREATE TABLE IF NOT EXISTS responses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
        answers JSONB NOT NULL DEFAULT '{}',
        linear_issue_id TEXT DEFAULT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_responses_survey_id ON responses(survey_id);
      CREATE INDEX IF NOT EXISTS idx_responses_created_at ON responses(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON surveys(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);
    `);
  }
}

export const postgresAdapter = new PostgresAdapter();

