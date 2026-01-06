/**
 * Database operations - backward compatibility layer
 * 
 * This file re-exports database operations from the new adapter system
 * to maintain compatibility with existing code.
 */

import db, { getAdapter, getAdapterType, getAvailableAdapters } from "./db";
import type {
  Survey,
  SurveyResponse,
  CreateSurveyInput,
  UpdateSurveyInput,
  SubmitResponseInput,
  SurveyStatus,
} from "./types";

// Re-export adapter utilities
export { getAdapter, getAdapterType, getAvailableAdapters };

// ============================================
// Survey Operations
// ============================================

export async function getSurveys(status: SurveyStatus = "active"): Promise<Survey[]> {
  return db.getSurveys(status);
}

export async function getSurvey(id: string): Promise<Survey | null> {
  return db.getSurvey(id);
}

export async function createSurvey(input: CreateSurveyInput): Promise<Survey> {
  return db.createSurvey(input);
}

export async function updateSurvey(
  id: string,
  input: UpdateSurveyInput
): Promise<Survey> {
  return db.updateSurvey(id, input);
}

export async function deleteSurvey(id: string): Promise<void> {
  return db.deleteSurvey(id);
}

export async function archiveSurvey(id: string): Promise<Survey> {
  return db.archiveSurvey(id);
}

export async function restoreSurvey(id: string): Promise<Survey> {
  return db.restoreSurvey(id);
}

// ============================================
// Response Operations
// ============================================

export async function getResponses(surveyId: string): Promise<SurveyResponse[]> {
  return db.getResponses(surveyId);
}

export async function getResponse(id: string): Promise<SurveyResponse | null> {
  return db.getResponse(id);
}

export async function submitResponse(
  input: SubmitResponseInput
): Promise<SurveyResponse> {
  return db.submitResponse(input);
}

export async function updateResponseLinearIssue(
  responseId: string,
  linearIssueId: string
): Promise<void> {
  return db.updateResponseLinearIssue(responseId, linearIssueId);
}

export async function deleteResponse(id: string): Promise<void> {
  return db.deleteResponse(id);
}

// ============================================
// Settings Operations
// ============================================

export async function getSetting<T = unknown>(key: string): Promise<T | null> {
  return db.getSetting<T>(key);
}

export async function setSetting<T = unknown>(key: string, value: T): Promise<void> {
  return db.setSetting(key, value);
}

export async function deleteSetting(key: string): Promise<void> {
  return db.deleteSetting(key);
}

// ============================================
// Connection
// ============================================

export async function testConnection(): Promise<boolean> {
  return db.testConnection();
}

// For legacy compatibility - check if any database is configured
export const supabase = null; // Deprecated, use getAdapter() instead
