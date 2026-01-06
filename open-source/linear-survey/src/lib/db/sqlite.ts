import {
  Survey,
  SurveyResponse,
  CreateSurveyInput,
  UpdateSurveyInput,
  SubmitResponseInput,
} from "../types";
import { DatabaseAdapter, SurveyStatus } from "./types";

/**
 * SQLite adapter for simple self-hosting
 * 
 * NOTE: Requires 'better-sqlite3' package to be installed: pnpm add better-sqlite3
 */
export class SQLiteAdapter implements DatabaseAdapter {
  readonly name = "sqlite";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private db: any = null;
  private initialized = false;
  private initError: Error | null = null;

  get isConfigured(): boolean {
    return !!process.env.SQLITE_PATH;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getDb(): any {
    if (this.initError) {
      throw this.initError;
    }
    
    if (!this.initialized) {
      const path = process.env.SQLITE_PATH || "./data/survey.db";
      
      try {
        // Dynamic require using eval to prevent webpack from analyzing
        const Database = (0, eval)('require("better-sqlite3")');
        this.db = new Database(path);
        this.initialized = true;
      } catch {
        this.initError = new Error(
          "SQLite adapter requires 'better-sqlite3' package. Install with: pnpm add better-sqlite3"
        );
        throw this.initError;
      }
    }
    return this.db!;
  }

  async getSurveys(status: SurveyStatus = "active"): Promise<Survey[]> {
    const db = this.getDb();
    const stmt = db.prepare(
      `SELECT * FROM surveys WHERE status = ? ORDER BY created_at DESC`
    );
    const rows = stmt.all(status) as Record<string, unknown>[];
    return rows.map(this.parseSurveyRow);
  }

  async getSurvey(id: string): Promise<Survey | null> {
    const db = this.getDb();
    const stmt = db.prepare(`SELECT * FROM surveys WHERE id = ?`);
    const row = stmt.get(id) as Record<string, unknown> | undefined;
    return row ? this.parseSurveyRow(row) : null;
  }

  async createSurvey(input: CreateSurveyInput): Promise<Survey> {
    const db = this.getDb();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO surveys (id, title, description, questions, groups, linear_config, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'active', ?)
    `).run(
      id,
      input.title,
      input.description,
      JSON.stringify(input.questions),
      JSON.stringify(input.groups || []),
      input.linear_config ? JSON.stringify(input.linear_config) : null,
      now
    );

    return {
      id,
      title: input.title,
      description: input.description,
      questions: input.questions,
      groups: input.groups || [],
      linear_config: input.linear_config,
      status: "active",
      created_at: now,
    };
  }

  async updateSurvey(id: string, input: UpdateSurveyInput): Promise<Survey> {
    const db = this.getDb();
    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: unknown[] = [];

    if (input.title !== undefined) {
      updates.push("title = ?");
      values.push(input.title);
    }
    if (input.description !== undefined) {
      updates.push("description = ?");
      values.push(input.description);
    }
    if (input.questions !== undefined) {
      updates.push("questions = ?");
      values.push(JSON.stringify(input.questions));
    }
    if (input.groups !== undefined) {
      updates.push("groups = ?");
      values.push(JSON.stringify(input.groups));
    }
    if (input.linear_config !== undefined) {
      updates.push("linear_config = ?");
      values.push(input.linear_config ? JSON.stringify(input.linear_config) : null);
    }
    if (input.status !== undefined) {
      updates.push("status = ?");
      values.push(input.status);
    }

    updates.push("updated_at = ?");
    values.push(now);
    values.push(id);

    db.prepare(`UPDATE surveys SET ${updates.join(", ")} WHERE id = ?`).run(...values);

    const updated = await this.getSurvey(id);
    if (!updated) throw new Error("Survey not found");
    return updated;
  }

  async deleteSurvey(id: string): Promise<void> {
    const db = this.getDb();
    db.prepare(`DELETE FROM surveys WHERE id = ?`).run(id);
  }

  async archiveSurvey(id: string): Promise<Survey> {
    return this.updateSurvey(id, { status: "archived" });
  }

  async restoreSurvey(id: string): Promise<Survey> {
    return this.updateSurvey(id, { status: "active" });
  }

  async getResponses(surveyId: string): Promise<SurveyResponse[]> {
    const db = this.getDb();
    const stmt = db.prepare(
      `SELECT * FROM responses WHERE survey_id = ? ORDER BY created_at DESC`
    );
    const rows = stmt.all(surveyId) as Record<string, unknown>[];
    return rows.map(this.parseResponseRow);
  }

  async getResponse(id: string): Promise<SurveyResponse | null> {
    const db = this.getDb();
    const stmt = db.prepare(`SELECT * FROM responses WHERE id = ?`);
    const row = stmt.get(id) as Record<string, unknown> | undefined;
    return row ? this.parseResponseRow(row) : null;
  }

  async submitResponse(input: SubmitResponseInput): Promise<SurveyResponse> {
    const db = this.getDb();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO responses (id, survey_id, answers, created_at)
      VALUES (?, ?, ?, ?)
    `).run(id, input.survey_id, JSON.stringify(input.answers), now);

    return {
      id,
      survey_id: input.survey_id,
      answers: input.answers,
      linear_issue_id: null,
      created_at: now,
    };
  }

  async updateResponseLinearIssue(responseId: string, linearIssueId: string): Promise<void> {
    const db = this.getDb();
    db.prepare(`UPDATE responses SET linear_issue_id = ? WHERE id = ?`).run(linearIssueId, responseId);
  }

  async deleteResponse(id: string): Promise<void> {
    const db = this.getDb();
    db.prepare(`DELETE FROM responses WHERE id = ?`).run(id);
  }

  async getSetting<T = unknown>(key: string): Promise<T | null> {
    const db = this.getDb();
    const row = db.prepare(`SELECT value FROM settings WHERE key = ?`).get(key) as { value: string } | undefined;
    return row ? JSON.parse(row.value) : null;
  }

  async setSetting<T = unknown>(key: string, value: T): Promise<void> {
    const db = this.getDb();
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = ?
    `).run(key, JSON.stringify(value), now, JSON.stringify(value), now);
  }

  async deleteSetting(key: string): Promise<void> {
    const db = this.getDb();
    db.prepare(`DELETE FROM settings WHERE key = ?`).run(key);
  }

  async testConnection(): Promise<boolean> {
    try {
      const db = this.getDb();
      db.prepare("SELECT 1").get();
      return true;
    } catch {
      return false;
    }
  }

  async runMigrations(): Promise<void> {
    const db = this.getDb();
    db.exec(`
      CREATE TABLE IF NOT EXISTS surveys (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL DEFAULT '',
        description TEXT NOT NULL DEFAULT '',
        questions TEXT NOT NULL DEFAULT '[]',
        groups TEXT NOT NULL DEFAULT '[]',
        linear_config TEXT DEFAULT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        created_at TEXT NOT NULL,
        updated_at TEXT
      );
      CREATE TABLE IF NOT EXISTS responses (
        id TEXT PRIMARY KEY,
        survey_id TEXT NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
        answers TEXT NOT NULL DEFAULT '{}',
        linear_issue_id TEXT DEFAULT NULL,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_responses_survey_id ON responses(survey_id);
      CREATE INDEX IF NOT EXISTS idx_responses_created_at ON responses(created_at);
      CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON surveys(created_at);
      CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);
    `);
  }

  private parseSurveyRow(row: Record<string, unknown>): Survey {
    return {
      id: row.id as string,
      title: row.title as string,
      description: row.description as string,
      questions: JSON.parse(row.questions as string),
      groups: JSON.parse((row.groups as string) || "[]"),
      linear_config: row.linear_config ? JSON.parse(row.linear_config as string) : null,
      status: (row.status as "active" | "archived") || "active",
      created_at: row.created_at as string,
      updated_at: row.updated_at as string | undefined,
    };
  }

  private parseResponseRow(row: Record<string, unknown>): SurveyResponse {
    return {
      id: row.id as string,
      survey_id: row.survey_id as string,
      answers: JSON.parse(row.answers as string),
      linear_issue_id: row.linear_issue_id as string | null,
      created_at: row.created_at as string,
    };
  }
}

export const sqliteAdapter = new SQLiteAdapter();
