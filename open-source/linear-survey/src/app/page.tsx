"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, FileText, ExternalLink } from "lucide-react";
import { Survey } from "@/lib/types";
import { getSurveys, createSurvey } from "@/lib/supabase";

export default function Home() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSurveys();
  }, []);

  async function loadSurveys() {
    try {
      const data = await getSurveys();
      setSurveys(data);
    } catch (error) {
      console.error("Failed to load surveys:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateSurvey() {
    try {
      const newSurvey = await createSurvey({
        title: "Untitled Survey",
        description: "",
        questions: [],
        linear_config: null,
      });
      setSurveys((prev) => [newSurvey, ...prev]);
    } catch (error) {
      console.error("Failed to create survey:", error);
    }
  }

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-accent">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-text-primary">
              Linear Survey
            </span>
          </div>
          <Button onClick={handleCreateSurvey} size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            New Survey
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-text-primary">Surveys</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Create surveys and push responses to Linear as issues.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        ) : surveys.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-secondary">
              <FileText className="h-6 w-6 text-text-tertiary" />
            </div>
            <h3 className="text-sm font-medium text-text-primary">
              No surveys yet
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              Create your first survey to get started.
            </p>
            <Button onClick={handleCreateSurvey} className="mt-4" size="sm">
              <Plus className="mr-1.5 h-4 w-4" />
              Create Survey
            </Button>
          </Card>
        ) : (
          <div className="grid gap-3">
            {surveys.map((survey) => (
              <Card
                key={survey.id}
                className="group flex items-center justify-between p-4 transition-shadow hover:shadow-card"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium text-text-primary">
                    {survey.title || "Untitled Survey"}
                  </h3>
                  <p className="mt-0.5 text-xs text-text-tertiary">
                    {survey.questions.length} question
                    {survey.questions.length !== 1 ? "s" : ""} ·{" "}
                    {new Date(survey.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <Link href={`/s/${survey.id}`} target="_blank">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/builder/${survey.id}`}>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/responses/${survey.id}`}>
                    <Button variant="secondary" size="sm">
                      Responses
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

