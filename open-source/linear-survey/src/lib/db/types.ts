import {
  Survey,
  SurveyResponse,
  CreateSurveyInput,
  UpdateSurveyInput,
  SubmitResponseInput,
} from "../types";

/**
 * Database adapter interface
 * All database implementations must conform to this interface
 */
export interface DatabaseAdapter {
  // Adapter info
  readonly name: string;
  readonly isConfigured: boolean;

  // Survey operations
  getSurveys(status?: SurveyStatus): Promise<Survey[]>;
  getSurvey(id: string): Promise<Survey | null>;
  createSurvey(input: CreateSurveyInput): Promise<Survey>;
  updateSurvey(id: string, input: UpdateSurveyInput): Promise<Survey>;
  deleteSurvey(id: string): Promise<void>;
  archiveSurvey(id: string): Promise<Survey>;
  restoreSurvey(id: string): Promise<Survey>;

  // Response operations
  getResponses(surveyId: string): Promise<SurveyResponse[]>;
  getResponse(id: string): Promise<SurveyResponse | null>;
  submitResponse(input: SubmitResponseInput): Promise<SurveyResponse>;
  updateResponseLinearIssue(responseId: string, linearIssueId: string): Promise<void>;
  deleteResponse(id: string): Promise<void>;

  // Settings operations
  getSetting<T = unknown>(key: string): Promise<T | null>;
  setSetting<T = unknown>(key: string, value: T): Promise<void>;
  deleteSetting(key: string): Promise<void>;

  // Connection/setup
  testConnection(): Promise<boolean>;
  runMigrations?(): Promise<void>;
}

/**
 * Survey status for filtering
 */
export type SurveyStatus = "active" | "archived";

/**
 * Adapter configuration options
 */
export interface AdapterConfig {
  type: "supabase" | "postgres" | "sqlite" | "local";
  url?: string;
  key?: string;
  filePath?: string; // For SQLite
}

/**
 * Settings stored in the database
 */
export interface AppSettings {
  linear_api_key?: string;
  setup_completed?: boolean;
  [key: string]: unknown;
}

