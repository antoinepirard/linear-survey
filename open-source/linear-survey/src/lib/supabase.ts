import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  Survey,
  SurveyResponse,
  CreateSurveyInput,
  UpdateSurveyInput,
  SubmitResponseInput,
} from "./types";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// ============================================
// Local Storage Fallback (for demo mode)
// ============================================

const STORAGE_KEY_SURVEYS = "linear-survey-surveys";
const STORAGE_KEY_RESPONSES = "linear-survey-responses";

function getLocalSurveys(): Survey[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY_SURVEYS);
  return data ? JSON.parse(data) : [];
}

function setLocalSurveys(surveys: Survey[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_SURVEYS, JSON.stringify(surveys));
}

function getLocalResponses(): SurveyResponse[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY_RESPONSES);
  return data ? JSON.parse(data) : [];
}

function setLocalResponses(responses: SurveyResponse[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(responses));
}

// ============================================
// Survey Operations
// ============================================

export async function getSurveys(): Promise<Survey[]> {
  if (!supabase) {
    return getLocalSurveys().sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getSurvey(id: string): Promise<Survey | null> {
  if (!supabase) {
    const surveys = getLocalSurveys();
    return surveys.find((s) => s.id === id) || null;
  }

  const { data, error } = await supabase
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

export async function createSurvey(input: CreateSurveyInput): Promise<Survey> {
  if (!supabase) {
    const surveys = getLocalSurveys();
    const newSurvey: Survey = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      questions: input.questions,
      linear_config: input.linear_config,
      created_at: new Date().toISOString(),
    };
    setLocalSurveys([...surveys, newSurvey]);
    return newSurvey;
  }

  const { data, error } = await supabase
    .from("surveys")
    .insert({
      title: input.title,
      description: input.description,
      questions: input.questions,
      linear_config: input.linear_config,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSurvey(
  id: string,
  input: UpdateSurveyInput
): Promise<Survey> {
  if (!supabase) {
    const surveys = getLocalSurveys();
    const index = surveys.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Survey not found");
    
    const updated = {
      ...surveys[index],
      ...input,
      updated_at: new Date().toISOString(),
    };
    surveys[index] = updated;
    setLocalSurveys(surveys);
    return updated;
  }

  const { data, error } = await supabase
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

export async function deleteSurvey(id: string): Promise<void> {
  if (!supabase) {
    const surveys = getLocalSurveys();
    setLocalSurveys(surveys.filter((s) => s.id !== id));
    return;
  }

  const { error } = await supabase.from("surveys").delete().eq("id", id);
  if (error) throw error;
}

// ============================================
// Response Operations
// ============================================

export async function getResponses(surveyId: string): Promise<SurveyResponse[]> {
  if (!supabase) {
    return getLocalResponses()
      .filter((r) => r.survey_id === surveyId)
      .sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

  const { data, error } = await supabase
    .from("responses")
    .select("*")
    .eq("survey_id", surveyId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getResponse(id: string): Promise<SurveyResponse | null> {
  if (!supabase) {
    const responses = getLocalResponses();
    return responses.find((r) => r.id === id) || null;
  }

  const { data, error } = await supabase
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

export async function submitResponse(
  input: SubmitResponseInput
): Promise<SurveyResponse> {
  if (!supabase) {
    const responses = getLocalResponses();
    const newResponse: SurveyResponse = {
      id: crypto.randomUUID(),
      survey_id: input.survey_id,
      answers: input.answers,
      linear_issue_id: null,
      created_at: new Date().toISOString(),
    };
    setLocalResponses([...responses, newResponse]);
    return newResponse;
  }

  const { data, error } = await supabase
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

export async function updateResponseLinearIssue(
  responseId: string,
  linearIssueId: string
): Promise<void> {
  if (!supabase) {
    const responses = getLocalResponses();
    const index = responses.findIndex((r) => r.id === responseId);
    if (index !== -1) {
      responses[index].linear_issue_id = linearIssueId;
      setLocalResponses(responses);
    }
    return;
  }

  const { error } = await supabase
    .from("responses")
    .update({ linear_issue_id: linearIssueId })
    .eq("id", responseId);

  if (error) throw error;
}

export async function deleteResponse(id: string): Promise<void> {
  if (!supabase) {
    const responses = getLocalResponses();
    setLocalResponses(responses.filter((r) => r.id !== id));
    return;
  }

  const { error } = await supabase.from("responses").delete().eq("id", id);
  if (error) throw error;
}
