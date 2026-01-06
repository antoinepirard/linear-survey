"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { ResponseRow } from "@/components/responses/ResponseRow";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
  RefreshCw,
  Send,
} from "lucide-react";
import { Survey, SurveyResponse, Question, Answer } from "@/lib/types";
import { getSurvey, getResponses } from "@/lib/supabase";
import { pushResponseToLinear, formatResponseAsMarkdown } from "@/lib/linear";

export default function ResponsesPage() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.id as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pushing, setPushing] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, [surveyId]);

  async function loadData() {
    try {
      const [surveyData, responsesData] = await Promise.all([
        getSurvey(surveyId),
        getResponses(surveyId),
      ]);

      if (!surveyData) {
        router.push("/");
        return;
      }

      setSurvey(surveyData);
      setResponses(responsesData);
    } catch (error) {
      console.error("Failed to load data:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === responses.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(responses.map((r) => r.id)));
    }
  }

  async function handlePushToLinear(responseId: string) {
    if (!survey?.linear_config) return;

    setPushing((prev) => new Set(prev).add(responseId));

    try {
      const response = responses.find((r) => r.id === responseId);
      if (!response) return;

      const issue = await pushResponseToLinear(
        survey.linear_config.api_key,
        survey.linear_config.team_id,
        survey.linear_config.title_template || "Survey Response",
        survey.questions,
        response.answers,
        survey.linear_config.project_id,
        survey.linear_config.labels
      );

      // Update local state
      setResponses((prev) =>
        prev.map((r) =>
          r.id === responseId ? { ...r, linear_issue_id: issue.id } : r
        )
      );
    } catch (error) {
      console.error("Failed to push to Linear:", error);
    } finally {
      setPushing((prev) => {
        const next = new Set(prev);
        next.delete(responseId);
        return next;
      });
    }
  }

  async function handleBulkPush() {
    if (!survey?.linear_config) return;

    const unpushedSelected = responses.filter(
      (r) => selectedIds.has(r.id) && !r.linear_issue_id
    );

    for (const response of unpushedSelected) {
      await handlePushToLinear(response.id);
    }
  }

  function exportToCSV() {
    if (!survey || responses.length === 0) return;

    const headers = ["ID", "Submitted At", "Linear Issue", ...survey.questions.map((q) => q.title)];

    const rows = responses.map((response) => {
      const row = [
        response.id,
        new Date(response.created_at).toLocaleString(),
        response.linear_issue_id || "",
      ];

      for (const question of survey.questions) {
        const answer = response.answers[question.id];
        if (Array.isArray(answer)) {
          row.push(answer.join(", "));
        } else if (answer !== undefined && answer !== null) {
          row.push(String(answer));
        } else {
          row.push("");
        }
      }

      return row;
    });

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${survey.title || "survey"}-responses.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function escapeCSV(value: string): string {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  function getAnswerDisplay(question: Question, answer: Answer | undefined): string {
    if (answer === undefined || answer === null || answer === "") return "—";
    if (Array.isArray(answer)) return answer.join(", ");
    if (question.type === "rating") return `${answer}/5`;
    return String(answer);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-secondary">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!survey) return null;

  const unpushedCount = responses.filter((r) => !r.linear_issue_id).length;
  const selectedUnpushed = responses.filter(
    (r) => selectedIds.has(r.id) && !r.linear_issue_id
  ).length;

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-sm font-semibold text-text-primary">
                {survey.title || "Untitled Survey"}
              </h1>
              <p className="text-xs text-text-secondary">
                {responses.length} response{responses.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => loadData()}>
              <RefreshCw className="mr-1.5 h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={exportToCSV}
              disabled={responses.length === 0}
            >
              <Download className="mr-1.5 h-4 w-4" />
              Export CSV
            </Button>
            {survey.linear_config && selectedUnpushed > 0 && (
              <Button size="sm" onClick={handleBulkPush}>
                <Send className="mr-1.5 h-4 w-4" />
                Push {selectedUnpushed} to Linear
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {responses.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-secondary">
              <FileText className="h-6 w-6 text-text-tertiary" />
            </div>
            <h3 className="text-sm font-medium text-text-primary">
              No responses yet
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              Share your survey to start collecting responses.
            </p>
            <Link href={`/s/${survey.id}`} target="_blank">
              <Button variant="secondary" size="sm" className="mt-4">
                <ExternalLink className="mr-1.5 h-4 w-4" />
                Open Survey
              </Button>
            </Link>
          </Card>
        ) : (
          <Card>
            {/* Stats Bar */}
            {survey.linear_config && (
              <div className="flex items-center gap-4 border-b border-border px-4 py-3">
                <Badge variant="secondary">
                  {responses.length - unpushedCount} pushed to Linear
                </Badge>
                {unpushedCount > 0 && (
                  <Badge variant="warning">{unpushedCount} pending</Badge>
                )}
              </div>
            )}

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.size === responses.length &&
                        responses.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-border"
                    />
                  </TableHead>
                  <TableHead className="w-40">Submitted</TableHead>
                  {survey.questions.slice(0, 4).map((q) => (
                    <TableHead key={q.id} className="max-w-[200px]">
                      <span className="truncate">{q.title || "Untitled"}</span>
                    </TableHead>
                  ))}
                  {survey.questions.length > 4 && (
                    <TableHead>+{survey.questions.length - 4} more</TableHead>
                  )}
                  <TableHead className="w-32">Status</TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responses.map((response) => (
                  <ResponseRow
                    key={response.id}
                    response={response}
                    survey={survey}
                    selected={selectedIds.has(response.id)}
                    pushing={pushing.has(response.id)}
                    onToggleSelect={() => toggleSelect(response.id)}
                    onPushToLinear={() => handlePushToLinear(response.id)}
                    getAnswerDisplay={getAnswerDisplay}
                  />
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </main>
    </div>
  );
}

