"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/Dropdown";
import {
  Plus,
  FileText,
  ExternalLink,
  MoreHorizontal,
  Archive,
  ArchiveRestore,
  Trash2,
  Settings,
} from "lucide-react";
import { Survey, SurveyStatus } from "@/lib/types";
import { getSurveys, createSurvey, deleteSurvey, archiveSurvey, restoreSurvey } from "@/lib/supabase";

type TabValue = "active" | "archived";

export default function Home() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabValue>("active");
  const [deleteConfirm, setDeleteConfirm] = useState<Survey | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadSurveys();
  }, [activeTab]);

  async function loadSurveys() {
    setLoading(true);
    try {
      const data = await getSurveys(activeTab as SurveyStatus);
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
        groups: [],
        linear_config: null,
      });
      setSurveys((prev) => [newSurvey, ...prev]);
    } catch (error) {
      console.error("Failed to create survey:", error);
    }
  }

  async function handleArchive(survey: Survey) {
    try {
      await archiveSurvey(survey.id);
      setSurveys((prev) => prev.filter((s) => s.id !== survey.id));
    } catch (error) {
      console.error("Failed to archive survey:", error);
    }
  }

  async function handleRestore(survey: Survey) {
    try {
      await restoreSurvey(survey.id);
      setSurveys((prev) => prev.filter((s) => s.id !== survey.id));
    } catch (error) {
      console.error("Failed to restore survey:", error);
    }
  }

  async function handleDelete() {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await deleteSurvey(deleteConfirm.id);
      setSurveys((prev) => prev.filter((s) => s.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete survey:", error);
    } finally {
      setDeleting(false);
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
          <div className="flex items-center gap-2">
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="mr-1.5 h-4 w-4" />
                Settings
              </Button>
            </Link>
            <Button onClick={handleCreateSurvey} size="sm">
              <Plus className="mr-1.5 h-4 w-4" />
              New Survey
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Surveys</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Create surveys and push responses to Linear as issues.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 border-b border-border">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "active"
                ? "border-b-2 border-accent text-accent"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab("archived")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "archived"
                ? "border-b-2 border-accent text-accent"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Archived
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        ) : surveys.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-secondary">
              {activeTab === "active" ? (
                <FileText className="h-6 w-6 text-text-tertiary" />
              ) : (
                <Archive className="h-6 w-6 text-text-tertiary" />
              )}
            </div>
            <h3 className="text-sm font-medium text-text-primary">
              {activeTab === "active" ? "No surveys yet" : "No archived surveys"}
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              {activeTab === "active"
                ? "Create your first survey to get started."
                : "Archived surveys will appear here."}
            </p>
            {activeTab === "active" && (
              <Button onClick={handleCreateSurvey} className="mt-4" size="sm">
                <Plus className="mr-1.5 h-4 w-4" />
                Create Survey
              </Button>
            )}
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
                  {activeTab === "active" && (
                    <>
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
                    </>
                  )}
                  <Dropdown
                    trigger={
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    }
                  >
                    {activeTab === "active" ? (
                      <>
                        <DropdownItem onClick={() => handleArchive(survey)}>
                          <Archive className="h-4 w-4" />
                          Archive
                        </DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem
                          variant="danger"
                          onClick={() => setDeleteConfirm(survey)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownItem>
                      </>
                    ) : (
                      <>
                        <DropdownItem onClick={() => handleRestore(survey)}>
                          <ArchiveRestore className="h-4 w-4" />
                          Restore
                        </DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem
                          variant="danger"
                          onClick={() => setDeleteConfirm(survey)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete permanently
                        </DropdownItem>
                      </>
                    )}
                  </Dropdown>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Survey"
        description={`Are you sure you want to delete "${deleteConfirm?.title || "Untitled Survey"}"? This action cannot be undone and all responses will be permanently deleted.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={deleting}
      />
    </div>
  );
}
