import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  Survey,
  SurveyResponse,
  CreateSurveyInput,
  UpdateSurveyInput,
  SubmitResponseInput,
} from "../types";
import { DatabaseAdapter, SurveyStatus } from "./types";

/**
 * Supabase adapter for production use
 */
export class SupabaseAdapter implements DatabaseAdapter {
  readonly name = "supabase";
  private client: SupabaseClient | null = null;

  constructor() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (url && key) {
      this.client = createClient(url, key);
    }
  }

  get isConfigured(): boolean {
    return this.client !== null;
  }

  private ensureClient(): SupabaseClient {
    if (!this.client) {
      throw new Error("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    }
    return this.client;
  }

  // ============================================
  // Survey operations
  // ============================================

  async getSurveys(status: SurveyStatus = "active"): Promise<Survey[]> {
    const client = this.ensureClient();
    const { data, error } = await client
      .from("surveys")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getSurvey(id: string): Promise<Survey | null> {
    const client = this.ensureClient();
    const { data, error } = await client
      .from("surveys")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      throw error;
    }
    return data;
  }

  async createSurvey(input: CreateSurveyInput): Promise<Survey> {
    const client = this.ensureClient();
    const { data, error } = await client
      .from("surveys")
      .insert({
        title: input.title,
        description: input.description,
        questions: input.questions,
        groups: input.groups || [],
        linear_config: input.linear_config,
        status: "active",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateSurvey(id: string, input: UpdateSurveyInput): Promise<Survey> {
    const client = this.ensureClient();
    const { data, error } = await client
      .from("surveys")
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteSurvey(id: string): Promise<void> {
    const client = this.ensureClient();
    const { error } = await client.from("surveys").delete().eq("id", id);
    if (error) throw error;
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
    const client = this.ensureClient();
    const { data, error } = await client
      .from("responses")
      .select("*")
      .eq("survey_id", surveyId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getResponse(id: string): Promise<SurveyResponse | null> {
    const client = this.ensureClient();
    const { data, error } = await client
      .from("responses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data;
  }

  async submitResponse(input: SubmitResponseInput): Promise<SurveyResponse> {
    const client = this.ensureClient();
    const { data, error } = await client
      .from("responses")
      .insert({
        survey_id: input.survey_id,
        answers: input.answers,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateResponseLinearIssue(
    responseId: string,
    linearIssueId: string
  ): Promise<void> {
    const client = this.ensureClient();
    const { error } = await client
      .from("responses")
      .update({ linear_issue_id: linearIssueId })
      .eq("id", responseId);

    if (error) throw error;
  }

  async deleteResponse(id: string): Promise<void> {
    const client = this.ensureClient();
    const { error } = await client.from("responses").delete().eq("id", id);
    if (error) throw error;
  }

  // ============================================
  // Settings operations
  // ============================================

  async getSetting<T = unknown>(key: string): Promise<T | null> {
    const client = this.ensureClient();
    const { data, error } = await client
      .from("settings")
      .select("value")
      .eq("key", key)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data?.value as T;
  }

  async setSetting<T = unknown>(key: string, value: T): Promise<void> {
    const client = this.ensureClient();
    const { error } = await client
      .from("settings")
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString(),
      })
      .eq("key", key);

    if (error) throw error;
  }

  async deleteSetting(key: string): Promise<void> {
    const client = this.ensureClient();
    const { error } = await client.from("settings").delete().eq("key", key);
    if (error) throw error;
  }

  // ============================================
  // Connection
  // ============================================

  async testConnection(): Promise<boolean> {
    if (!this.client) return false;
    try {
      const { error } = await this.client.from("surveys").select("id").limit(1);
      return !error;
    } catch {
      return false;
    }
  }
}

export const supabaseAdapter = new SupabaseAdapter();

