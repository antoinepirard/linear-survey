// Question types supported by the survey builder
export type QuestionType =
  | "short_text"
  | "long_text"
  | "single_choice"
  | "multiple_choice"
  | "rating"
  | "email";

// Base question interface
export interface BaseQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
}

// Text questions (short and long)
export interface TextQuestion extends BaseQuestion {
  type: "short_text" | "long_text";
  placeholder?: string;
}

// Choice questions (single and multiple)
export interface ChoiceQuestion extends BaseQuestion {
  type: "single_choice" | "multiple_choice";
  options: string[];
}

// Rating question (1-5 scale)
export interface RatingQuestion extends BaseQuestion {
  type: "rating";
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
}

// Email question
export interface EmailQuestion extends BaseQuestion {
  type: "email";
  placeholder?: string;
}

// Union type for all question types
export type Question =
  | TextQuestion
  | ChoiceQuestion
  | RatingQuestion
  | EmailQuestion;

// Linear configuration for a survey
export interface LinearConfig {
  api_key: string;
  team_id: string;
  project_id?: string;
  labels?: string[];
  title_template?: string; // e.g., "Survey Response: {{short_text_1}}"
}

// Survey definition
export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  linear_config: LinearConfig | null;
  created_at: string;
  updated_at?: string;
}

// Survey response (answers from a user)
export interface SurveyResponse {
  id: string;
  survey_id: string;
  answers: Record<string, Answer>;
  linear_issue_id: string | null;
  created_at: string;
}

// Individual answer value
export type Answer = string | string[] | number;

// For creating new surveys (without id and timestamps)
export type CreateSurveyInput = Omit<Survey, "id" | "created_at" | "updated_at">;

// For updating surveys
export type UpdateSurveyInput = Partial<Omit<Survey, "id" | "created_at">>;

// For submitting responses
export interface SubmitResponseInput {
  survey_id: string;
  answers: Record<string, Answer>;
}

// Linear API types
export interface LinearTeam {
  id: string;
  name: string;
  key: string;
}

export interface LinearProject {
  id: string;
  name: string;
}

export interface LinearLabel {
  id: string;
  name: string;
  color: string;
}

export interface LinearIssue {
  id: string;
  identifier: string;
  title: string;
  url: string;
}

// Question type labels for the UI
export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  short_text: "Short Text",
  long_text: "Long Text",
  single_choice: "Single Choice",
  multiple_choice: "Multiple Choice",
  rating: "Rating",
  email: "Email",
};

// Default question factory
export function createDefaultQuestion(type: QuestionType): Question {
  const base = {
    id: crypto.randomUUID(),
    title: "",
    required: false,
  };

  switch (type) {
    case "short_text":
    case "long_text":
      return { ...base, type, placeholder: "" };
    case "single_choice":
    case "multiple_choice":
      return { ...base, type, options: ["Option 1", "Option 2"] };
    case "rating":
      return { ...base, type, min: 1, max: 5 };
    case "email":
      return { ...base, type, placeholder: "you@example.com" };
  }
}

