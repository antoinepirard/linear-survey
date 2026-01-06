import {
  Survey,
  SurveyResponse,
  CreateSurveyInput,
  UpdateSurveyInput,
  SubmitResponseInput,
} from "../types";
import { DatabaseAdapter, SurveyStatus } from "./types";

const STORAGE_KEY_SURVEYS = "linear-survey-surveys";
const STORAGE_KEY_RESPONSES = "linear-survey-responses";
const STORAGE_KEY_SETTINGS = "linear-survey-settings";

/**
 * LocalStorage adapter for demo/development mode
 * Works entirely in the browser with no external database
 */
export class LocalStorageAdapter implements DatabaseAdapter {
  readonly name = "localStorage";
  readonly isConfigured = true; // Always available in browser

  // ============================================
  // Private helpers
  // ============================================

  private getSurveys_(): Survey[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEY_SURVEYS);
    return data ? JSON.parse(data) : [];
  }

  private setSurveys_(surveys: Survey[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY_SURVEYS, JSON.stringify(surveys));
  }

  private getResponses_(): SurveyResponse[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEY_RESPONSES);
    return data ? JSON.parse(data) : [];
  }

  private setResponses_(responses: SurveyResponse[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(responses));
  }

  private getSettings_(): Record<string, unknown> {
    if (typeof window === "undefined") return {};
    const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
    return data ? JSON.parse(data) : {};
  }

  private setSettings_(settings: Record<string, unknown>): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }

  // ============================================
  // Survey operations
  // ============================================

  async getSurveys(status: SurveyStatus = "active"): Promise<Survey[]> {
    return this.getSurveys_()
      .filter((s) => (s.status || "active") === status)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

  async getSurvey(id: string): Promise<Survey | null> {
    const surveys = this.getSurveys_();
    return surveys.find((s) => s.id === id) || null;
  }

  async createSurvey(input: CreateSurveyInput): Promise<Survey> {
    const surveys = this.getSurveys_();
    const newSurvey: Survey = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      questions: input.questions,
      groups: input.groups || [],
      linear_config: input.linear_config,
      status: "active",
      created_at: new Date().toISOString(),
    };
    this.setSurveys_([...surveys, newSurvey]);
    return newSurvey;
  }

  async updateSurvey(id: string, input: UpdateSurveyInput): Promise<Survey> {
    const surveys = this.getSurveys_();
    const index = surveys.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Survey not found");

    const updated = {
      ...surveys[index],
      ...input,
      updated_at: new Date().toISOString(),
    };
    surveys[index] = updated;
    this.setSurveys_(surveys);
    return updated;
  }

  async deleteSurvey(id: string): Promise<void> {
    const surveys = this.getSurveys_();
    this.setSurveys_(surveys.filter((s) => s.id !== id));
    // Also delete related responses
    const responses = this.getResponses_();
    this.setResponses_(responses.filter((r) => r.survey_id !== id));
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
    return this.getResponses_()
      .filter((r) => r.survey_id === surveyId)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

  async getResponse(id: string): Promise<SurveyResponse | null> {
    const responses = this.getResponses_();
    return responses.find((r) => r.id === id) || null;
  }

  async submitResponse(input: SubmitResponseInput): Promise<SurveyResponse> {
    const responses = this.getResponses_();
    const newResponse: SurveyResponse = {
      id: crypto.randomUUID(),
      survey_id: input.survey_id,
      answers: input.answers,
      linear_issue_id: null,
      created_at: new Date().toISOString(),
    };
    this.setResponses_([...responses, newResponse]);
    return newResponse;
  }

  async updateResponseLinearIssue(
    responseId: string,
    linearIssueId: string
  ): Promise<void> {
    const responses = this.getResponses_();
    const index = responses.findIndex((r) => r.id === responseId);
    if (index !== -1) {
      responses[index].linear_issue_id = linearIssueId;
      this.setResponses_(responses);
    }
  }

  async deleteResponse(id: string): Promise<void> {
    const responses = this.getResponses_();
    this.setResponses_(responses.filter((r) => r.id !== id));
  }

  // ============================================
  // Settings operations
  // ============================================

  async getSetting<T = unknown>(key: string): Promise<T | null> {
    const settings = this.getSettings_();
    return (settings[key] as T) ?? null;
  }

  async setSetting<T = unknown>(key: string, value: T): Promise<void> {
    const settings = this.getSettings_();
    settings[key] = value;
    this.setSettings_(settings);
  }

  async deleteSetting(key: string): Promise<void> {
    const settings = this.getSettings_();
    delete settings[key];
    this.setSettings_(settings);
  }

  // ============================================
  // Connection
  // ============================================

  async testConnection(): Promise<boolean> {
    return typeof window !== "undefined" && !!window.localStorage;
  }
}

export const localStorageAdapter = new LocalStorageAdapter();

