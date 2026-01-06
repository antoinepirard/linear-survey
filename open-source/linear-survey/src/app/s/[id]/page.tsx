"use client";

import { useState, useEffect, FormEvent, useMemo } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import {
  ShortTextRenderer,
  LongTextRenderer,
  SingleChoiceRenderer,
  MultipleChoiceRenderer,
  RatingRenderer,
  EmailRenderer,
} from "@/components/survey/QuestionRenderers";
import { Check, FileText, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Survey, Question, Answer, QuestionGroup } from "@/lib/types";
import { getSurvey, submitResponse } from "@/lib/supabase";

type SurveyState = "loading" | "active" | "submitted" | "error";

interface Step {
  group: QuestionGroup | null; // null = ungrouped questions
  questions: Question[];
}

export default function SurveyPage() {
  const params = useParams();
  const surveyId = params.id as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [state, setState] = useState<SurveyState>("loading");
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Organize questions into steps
  const steps = useMemo<Step[]>(() => {
    if (!survey) return [];

    const hasGroups = survey.groups.length > 0;
    
    if (!hasGroups) {
      // Single step with all questions
      return [{ group: null, questions: survey.questions }];
    }

    // Group questions by their groupId
    const groupedQuestions = new Map<string, Question[]>();
    const ungroupedQuestions: Question[] = [];

    for (const question of survey.questions) {
      if (question.groupId) {
        const existing = groupedQuestions.get(question.groupId) || [];
        existing.push(question);
        groupedQuestions.set(question.groupId, existing);
      } else {
        ungroupedQuestions.push(question);
      }
    }

    // Build steps in group order
    const result: Step[] = [];
    
    for (const group of survey.groups) {
      const questions = groupedQuestions.get(group.id) || [];
      if (questions.length > 0) {
        result.push({ group, questions });
      }
    }

    // Add ungrouped questions at the end
    if (ungroupedQuestions.length > 0) {
      result.push({ group: null, questions: ungroupedQuestions });
    }

    return result;
  }, [survey]);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const isMultiStep = steps.length > 1;

  useEffect(() => {
    loadSurvey();
  }, [surveyId]);

  async function loadSurvey() {
    try {
      const data = await getSurvey(surveyId);
      if (!data) {
        setState("error");
        return;
      }
      setSurvey(data);
      setState("active");
    } catch (error) {
      console.error("Failed to load survey:", error);
      setState("error");
    }
  }

  function updateAnswer(questionId: string, value: Answer) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  }

  function validateStep(stepQuestions: Question[]): boolean {
    const newErrors: Record<string, string> = {};

    for (const question of stepQuestions) {
      if (question.required) {
        const answer = answers[question.id];

        if (answer === undefined || answer === null || answer === "") {
          newErrors[question.id] = "This field is required";
          continue;
        }

        if (Array.isArray(answer) && answer.length === 0) {
          newErrors[question.id] = "Please select at least one option";
          continue;
        }

        if (question.type === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(String(answer))) {
            newErrors[question.id] = "Please enter a valid email address";
          }
        }
      }
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }

  function handleNext(e: React.MouseEvent) {
    e.preventDefault();
    if (!currentStep) return;
    
    if (validateStep(currentStep.questions)) {
      setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }
  }

  function handleBack(e: React.MouseEvent) {
    e.preventDefault();
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!survey || !currentStep) return;
    
    // Validate current step
    if (!validateStep(currentStep.questions)) return;

    setSubmitting(true);
    try {
      await submitResponse({
        survey_id: survey.id,
        answers,
      });
      setState("submitted");
    } catch (error) {
      console.error("Failed to submit response:", error);
    } finally {
      setSubmitting(false);
    }
  }

  function renderQuestion(question: Question) {
    const value = answers[question.id];
    const error = errors[question.id];
    const commonProps = {
      question,
      value,
      error,
      onChange: (v: Answer) => updateAnswer(question.id, v),
    };

    switch (question.type) {
      case "short_text":
        return <ShortTextRenderer key={question.id} {...commonProps} />;
      case "long_text":
        return <LongTextRenderer key={question.id} {...commonProps} />;
      case "single_choice":
        return <SingleChoiceRenderer key={question.id} {...commonProps} />;
      case "multiple_choice":
        return <MultipleChoiceRenderer key={question.id} {...commonProps} />;
      case "rating":
        return <RatingRenderer key={question.id} {...commonProps} />;
      case "email":
        return <EmailRenderer key={question.id} {...commonProps} />;
      default:
        return null;
    }
  }

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-secondary">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-secondary">
        <Card className="max-w-md p-8 text-center">
          <div className="mb-4 flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-red-100">
            <FileText className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-lg font-semibold text-text-primary">
            Survey Not Found
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            This survey doesn&apos;t exist or has been removed.
          </p>
        </Card>
      </div>
    );
  }

  if (state === "submitted") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-secondary">
        <Card className="max-w-md p-8 text-center animate-fade-in">
          <div className="mb-4 flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-lg font-semibold text-text-primary">
            Thank You!
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Your response has been submitted successfully.
          </p>
        </Card>
      </div>
    );
  }

  if (!survey || !currentStep) return null;

  return (
    <div className="min-h-screen bg-surface-secondary py-12 px-4">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-text-primary">
            {survey.title || "Untitled Survey"}
          </h1>
          {survey.description && (
            <p className="mt-2 text-text-secondary">{survey.description}</p>
          )}
        </div>

        {/* Progress Dots (for multi-step) */}
        {isMultiStep && (
          <div className="mb-8 flex items-center justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 w-2 rounded-full transition-all duration-300",
                  index === currentStepIndex
                    ? "bg-accent scale-125"
                    : index < currentStepIndex
                    ? "bg-accent/50"
                    : "bg-border"
                )}
              />
            ))}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="divide-y divide-border">
            {currentStep.group?.description && (
              <div className="p-6 bg-surface-secondary">
                <p className="text-sm text-text-secondary">
                  {currentStep.group.description}
                </p>
              </div>
            )}
            
            {currentStep.questions.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-text-secondary">
                  No questions in this step.
                </p>
              </div>
            ) : (
              currentStep.questions.map((question) => (
                <div key={question.id} className="p-6">
                  {renderQuestion(question)}
                </div>
              ))
            )}
          </Card>

          {/* Navigation */}
          {(survey.questions.length > 0 || isMultiStep) && (
            <div className="mt-6 flex justify-between">
              {/* Back Button */}
              <div>
                {isMultiStep && !isFirstStep && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={(e) => handleBack(e)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
              </div>

              {/* Next/Submit Button */}
              <div>
                {isLastStep ? (
                  <Button type="submit" disabled={submitting} size="lg">
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                ) : (
                  <Button type="button" size="lg" onClick={(e) => handleNext(e)}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-text-tertiary">
          Powered by{" "}
          <a
            href="https://github.com/antoinepirard/linear-survey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Linear Survey
          </a>
        </p>
      </div>
    </div>
  );
}
