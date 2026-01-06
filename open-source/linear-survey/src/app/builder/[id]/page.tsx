"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { QuestionEditor } from "@/components/builder/QuestionEditor";
import { LinearConfigPanel } from "@/components/builder/LinearConfigPanel";
import { GroupManager } from "@/components/builder/GroupManager";
import { StepSeparator } from "@/components/builder/StepSeparator";
import {
  ArrowLeft,
  Plus,
  ExternalLink,
  Save,
  Settings,
  Eye,
} from "lucide-react";
import {
  Survey,
  Question,
  QuestionType,
  QuestionGroup,
  createDefaultQuestion,
} from "@/lib/types";
import { getSurvey, updateSurvey } from "@/lib/supabase";

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.id as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSurvey();
  }, [surveyId]);

  async function loadSurvey() {
    try {
      const data = await getSurvey(surveyId);
      if (!data) {
        router.push("/");
        return;
      }
      setSurvey(data);
    } catch (error) {
      console.error("Failed to load survey:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  const handleSave = useCallback(async () => {
    if (!survey) return;
    setSaving(true);
    try {
      await updateSurvey(survey.id, {
        title: survey.title,
        description: survey.description,
        questions: survey.questions,
        groups: survey.groups,
        linear_config: survey.linear_config,
      });
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save survey:", error);
    } finally {
      setSaving(false);
    }
  }, [survey]);

  function updateField<K extends keyof Survey>(field: K, value: Survey[K]) {
    if (!survey) return;
    setSurvey({ ...survey, [field]: value });
    setHasChanges(true);
  }

  // Organize questions into sections (steps) for display
  const questionSections = useMemo(() => {
    if (!survey) return [];

    // Build ordered list of questions with their step positions
    // Questions are stored flat but we display them grouped by step
    const sections: Array<{
      group: QuestionGroup | null;
      questions: Array<{ question: Question; globalIndex: number }>;
    }> = [];

    // First, collect all questions by group
    const ungrouped: Array<{ question: Question; globalIndex: number }> = [];
    const byGroup = new Map<string, Array<{ question: Question; globalIndex: number }>>();

    survey.questions.forEach((question, globalIndex) => {
      if (question.groupId) {
        const existing = byGroup.get(question.groupId) || [];
        existing.push({ question, globalIndex });
        byGroup.set(question.groupId, existing);
      } else {
        ungrouped.push({ question, globalIndex });
      }
    });

    // Add ungrouped questions first (before any step)
    if (ungrouped.length > 0) {
      sections.push({ group: null, questions: ungrouped });
    }

    // Add questions for each group in order
    for (const group of survey.groups) {
      const questions = byGroup.get(group.id) || [];
      sections.push({ group, questions });
    }

    return sections;
  }, [survey]);

  function addQuestion(type: QuestionType, groupId?: string) {
    if (!survey) return;
    const newQuestion = createDefaultQuestion(type);

    // Assign to the specified group, or last group if no group specified
    if (groupId) {
      newQuestion.groupId = groupId;
    } else if (survey.groups.length > 0) {
      newQuestion.groupId = survey.groups[survey.groups.length - 1].id;
    }

    setSurvey({
      ...survey,
      questions: [...survey.questions, newQuestion],
    });
    setHasChanges(true);
  }

  function updateQuestion(index: number, question: Question) {
    if (!survey) return;
    const updated = [...survey.questions];
    updated[index] = question;
    setSurvey({ ...survey, questions: updated });
    setHasChanges(true);
  }

  function deleteQuestion(index: number) {
    if (!survey) return;
    const updated = survey.questions.filter((_, i) => i !== index);
    setSurvey({ ...survey, questions: updated });
    setHasChanges(true);
  }

  function moveQuestion(index: number, direction: "up" | "down") {
    if (!survey) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= survey.questions.length) return;

    const updated = [...survey.questions];
    const movingQuestion = updated[index];
    const targetQuestion = updated[newIndex];

    // When moving, inherit the groupId from the target position
    // This makes questions automatically belong to the step they're moved into
    const updatedMovingQuestion = {
      ...movingQuestion,
      groupId: targetQuestion.groupId,
    } as Question;

    updated[index] = targetQuestion;
    updated[newIndex] = updatedMovingQuestion;

    setSurvey({ ...survey, questions: updated });
    setHasChanges(true);
  }

  function addStepSeparator() {
    if (!survey) return;
    const newGroup: QuestionGroup = {
      id: crypto.randomUUID(),
      title: `Step ${survey.groups.length + 1}`,
    };
    setSurvey({
      ...survey,
      groups: [...survey.groups, newGroup],
    });
    setHasChanges(true);
  }

  function updateStepSeparator(groupId: string, updates: Partial<QuestionGroup>) {
    if (!survey) return;
    const updatedGroups = survey.groups.map((g) =>
      g.id === groupId ? { ...g, ...updates } : g
    );
    setSurvey({ ...survey, groups: updatedGroups });
    setHasChanges(true);
  }

  function deleteStepSeparator(groupId: string) {
    if (!survey) return;
    // Remove the group and unassign all questions from it
    const updatedGroups = survey.groups.filter((g) => g.id !== groupId);
    const updatedQuestions = survey.questions.map((q) => {
      if (q.groupId === groupId) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { groupId: _unused, ...rest } = q;
        return rest as Question;
      }
      return q;
    });
    setSurvey({
      ...survey,
      groups: updatedGroups,
      questions: updatedQuestions,
    });
    setHasChanges(true);
  }

  function updateGroups(groups: QuestionGroup[]) {
    if (!survey) return;

    // When groups are deleted, unassign questions from those groups
    const validGroupIds = new Set(groups.map((g) => g.id));
    const updatedQuestions = survey.questions.map((q) => {
      if (q.groupId && !validGroupIds.has(q.groupId)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { groupId: _unused, ...rest } = q;
        return rest as Question;
      }
      return q;
    });

    setSurvey({
      ...survey,
      groups,
      questions: updatedQuestions,
    });
    setHasChanges(true);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-secondary">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!survey) return null;

  // Calculate questions per group for stats
  const questionsInGroups = survey.questions.filter((q) => q.groupId).length;
  const ungroupedQuestions = survey.questions.length - questionsInGroups;

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Input
              value={survey.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Untitled Survey"
              className="h-8 w-64 border-transparent bg-transparent text-sm font-medium hover:border-border focus:border-border"
            />
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/s/${survey.id}`} target="_blank">
              <Button variant="ghost" size="sm">
                <Eye className="mr-1.5 h-4 w-4" />
                Preview
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConfig(!showConfig)}
            >
              <Settings className="mr-1.5 h-4 w-4" />
              Linear
            </Button>
            <Button
              onClick={handleSave}
              size="sm"
              disabled={!hasChanges || saving}
            >
              <Save className="mr-1.5 h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Questions Panel */}
          <div className="lg:col-span-2">
            {/* Survey Description */}
            <Card className="mb-6 p-4">
              <Label className="mb-2 block text-xs text-text-secondary">
                Description (optional)
              </Label>
              <Textarea
                value={survey.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Add a description for your survey..."
                className="min-h-[60px] resize-none border-transparent bg-transparent hover:border-border focus:border-border"
              />
            </Card>

            {/* Questions List with Step Separators */}
            <div className="space-y-4">
              {questionSections.map((section) => (
                <div key={section.group?.id || "ungrouped"}>
                  {/* Step separator (only show if there's a group) */}
                  {section.group && (
                    <StepSeparator
                      group={section.group}
                      stepNumber={survey.groups.indexOf(section.group) + 1}
                      onUpdate={(updates) =>
                        updateStepSeparator(section.group!.id, updates)
                      }
                      onDelete={() => deleteStepSeparator(section.group!.id)}
                    />
                  )}

                  {/* Questions in this section */}
                  <div className="space-y-4">
                    {section.questions.map(({ question, globalIndex }) => {
                      // Calculate if we can move up/down
                      const canMoveUp = globalIndex > 0;
                      const canMoveDown = globalIndex < survey.questions.length - 1;

                      return (
                        <QuestionEditor
                          key={question.id}
                          question={question}
                          index={globalIndex}
                          totalQuestions={survey.questions.length}
                          canMoveUp={canMoveUp}
                          canMoveDown={canMoveDown}
                          onChange={(q) => updateQuestion(globalIndex, q)}
                          onDelete={() => deleteQuestion(globalIndex)}
                          onMove={(dir) => moveQuestion(globalIndex, dir)}
                        />
                      );
                    })}
                  </div>

                  {/* Add question button for this section */}
                  {section.questions.length === 0 && section.group && (
                    <p className="text-center text-sm text-text-tertiary py-4">
                      Move questions below this line to add them to {section.group.title}
                    </p>
                  )}
                </div>
              ))}

              {/* Show message if no questions at all */}
              {survey.questions.length === 0 && (
                <div className="text-center py-8 text-text-secondary">
                  <p className="text-sm">No questions yet. Add your first question below.</p>
                </div>
              )}
            </div>

            {/* Add Step Separator */}
            {survey.groups.length > 0 && (
              <div className="flex justify-center mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addStepSeparator}
                  className="text-text-tertiary hover:text-text-secondary"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add Step
                </Button>
              </div>
            )}

            {/* Add Question */}
            <Card className="mt-4 p-4">
              <p className="mb-3 text-sm font-medium text-text-primary">
                Add Question
              </p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "short_text",
                    "long_text",
                    "single_choice",
                    "multiple_choice",
                    "rating",
                    "email",
                  ] as QuestionType[]
                ).map((type) => (
                  <Button
                    key={type}
                    variant="secondary"
                    size="sm"
                    onClick={() => addQuestion(type)}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    {type
                      .split("_")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Config Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Group Manager */}
            <GroupManager groups={survey.groups} onChange={updateGroups} />

            {showConfig && (
              <LinearConfigPanel
                config={survey.linear_config}
                onChange={(config) => updateField("linear_config", config)}
              />
            )}

            {/* Quick Stats */}
            <Card className="p-4">
              <p className="mb-3 text-sm font-medium text-text-primary">
                Survey Info
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Questions</span>
                  <span className="text-text-primary">
                    {survey.questions.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Required</span>
                  <span className="text-text-primary">
                    {survey.questions.filter((q) => q.required).length}
                  </span>
                </div>
                {survey.groups.length > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Steps</span>
                      <span className="text-text-primary">
                        {survey.groups.length}
                      </span>
                    </div>
                    {ungroupedQuestions > 0 && (
                      <div className="flex justify-between text-amber-600">
                        <span>Ungrouped</span>
                        <span>{ungroupedQuestions}</span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-text-secondary">Linear</span>
                  <span className="text-text-primary">
                    {survey.linear_config?.team_id
                      ? "Connected"
                      : "Not configured"}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Link
                  href={`/s/${survey.id}`}
                  target="_blank"
                  className="flex items-center gap-2 text-sm text-accent hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open public link
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
