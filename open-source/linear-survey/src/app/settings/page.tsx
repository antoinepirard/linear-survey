"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  Check,
  Loader2,
  AlertCircle,
  Database,
  Key,
  ExternalLink,
} from "lucide-react";
import { getSetting, setSetting, testConnection } from "@/lib/supabase";
import { getAdapterType, getAvailableAdapters } from "@/lib/supabase";
import { getLinearTeams } from "@/lib/linear";

interface LinearSettings {
  api_key: string;
  verified: boolean;
}

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [originalApiKey, setOriginalApiKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);

  const adapterType = getAdapterType();
  const adapters = getAvailableAdapters();

  useEffect(() => {
    loadSettings();
    checkDbConnection();
  }, []);

  async function loadSettings() {
    try {
      const settings = await getSetting<LinearSettings>("linear");
      if (settings) {
        setApiKey(settings.api_key || "");
        setOriginalApiKey(settings.api_key || "");
        setVerified(settings.verified || false);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function checkDbConnection() {
    const connected = await testConnection();
    setDbConnected(connected);
  }

  async function handleTestAndSave() {
    if (!apiKey.trim()) {
      setError("Please enter an API key");
      return;
    }

    setTesting(true);
    setError(null);

    try {
      // Test the API key by fetching teams
      await getLinearTeams(apiKey);
      
      setSaving(true);
      await setSetting<LinearSettings>("linear", {
        api_key: apiKey,
        verified: true,
      });
      
      setOriginalApiKey(apiKey);
      setVerified(true);
    } catch (err) {
      setError("Invalid API key. Please check and try again.");
      setVerified(false);
    } finally {
      setTesting(false);
      setSaving(false);
    }
  }

  async function handleClear() {
    setSaving(true);
    try {
      await setSetting<LinearSettings>("linear", {
        api_key: "",
        verified: false,
      });
      setApiKey("");
      setOriginalApiKey("");
      setVerified(false);
    } catch (error) {
      console.error("Failed to clear settings:", error);
    } finally {
      setSaving(false);
    }
  }

  const hasChanges = apiKey !== originalApiKey;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-secondary">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-sm font-semibold text-text-primary">Settings</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        {/* Database Status */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-5 w-5 text-text-secondary" />
            <h2 className="text-sm font-semibold text-text-primary">Database</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-primary">Active Adapter</p>
                <p className="text-xs text-text-tertiary mt-0.5">
                  {adapters.find((a) => a.type === adapterType)?.name || adapterType}
                </p>
              </div>
              <Badge variant={dbConnected ? "success" : "default"}>
                {dbConnected ? (
                  <>
                    <Check className="mr-1 h-3 w-3" />
                    Connected
                  </>
                ) : (
                  "Not connected"
                )}
              </Badge>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-text-secondary mb-3">Available adapters:</p>
              <div className="grid gap-2">
                {adapters.map((adapter) => (
                  <div
                    key={adapter.type}
                    className={`flex items-center justify-between p-2 rounded text-sm ${
                      adapter.isActive
                        ? "bg-accent/10 border border-accent/20"
                        : "bg-surface-secondary"
                    }`}
                  >
                    <span className="text-text-primary">{adapter.name}</span>
                    <span className="text-xs text-text-tertiary">
                      {adapter.isActive
                        ? "Active"
                        : adapter.isConfigured
                        ? "Configured"
                        : "Not configured"}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-tertiary mt-3">
                Configure adapters via environment variables. See the README for details.
              </p>
            </div>
          </div>
        </Card>

        {/* Linear API Key */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-text-secondary" />
              <h2 className="text-sm font-semibold text-text-primary">Linear API Key</h2>
            </div>
            {verified && (
              <Badge variant="success">
                <Check className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block text-xs text-text-secondary">
                API Key
              </Label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setError(null);
                  if (e.target.value !== originalApiKey) {
                    setVerified(false);
                  }
                }}
                placeholder="lin_api_..."
              />
              <p className="mt-1.5 text-xs text-text-tertiary">
                Get your API key from{" "}
                <a
                  href="https://linear.app/settings/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline inline-flex items-center gap-1"
                >
                  Linear Settings
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleTestAndSave}
                disabled={!apiKey.trim() || testing || saving || (!hasChanges && verified)}
                size="sm"
              >
                {testing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : verified && !hasChanges ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Saved
                  </>
                ) : (
                  "Test & Save"
                )}
              </Button>
              {originalApiKey && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  disabled={saving}
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Info */}
        <p className="text-xs text-text-tertiary text-center">
          The Linear API key is used across all surveys to push responses as issues.
          <br />
          Individual surveys can still configure their team and project preferences.
        </p>
      </main>
    </div>
  );
}

