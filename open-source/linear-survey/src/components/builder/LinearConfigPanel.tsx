"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Check, Loader2, AlertCircle, Settings } from "lucide-react";
import { LinearConfig, LinearTeam, LinearProject } from "@/lib/types";
import { getLinearTeams, getLinearProjects } from "@/lib/linear";
import { getSetting } from "@/lib/supabase";

interface LinearSettings {
  api_key: string;
  verified: boolean;
}

interface LinearConfigPanelProps {
  config: LinearConfig | null;
  onChange: (config: LinearConfig | null) => void;
}

export function LinearConfigPanel({ config, onChange }: LinearConfigPanelProps) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyVerified, setApiKeyVerified] = useState(false);
  const [teams, setTeams] = useState<LinearTeam[]>([]);
  const [projects, setProjects] = useState<LinearProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load API key from settings on mount
  useEffect(() => {
    loadApiKey();
  }, []);

  // Load teams when API key is available
  useEffect(() => {
    if (apiKey && apiKeyVerified) {
      loadTeams();
    }
  }, [apiKey, apiKeyVerified]);

  // Load projects when team changes
  useEffect(() => {
    if (apiKey && config?.team_id) {
      loadProjects(config.team_id);
    }
  }, [apiKey, config?.team_id]);

  async function loadApiKey() {
    setLoading(true);
    try {
      const settings = await getSetting<LinearSettings>("linear");
      if (settings?.api_key && settings?.verified) {
        setApiKey(settings.api_key);
        setApiKeyVerified(true);
      } else {
        setApiKey(null);
        setApiKeyVerified(false);
      }
    } catch (err) {
      console.error("Failed to load API key:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadTeams() {
    if (!apiKey) return;
    
    try {
      const fetchedTeams = await getLinearTeams(apiKey);
      setTeams(fetchedTeams);
      
      // If there's only one team and no config, auto-select it
      if (fetchedTeams.length === 1 && !config?.team_id) {
        onChange({
          team_id: fetchedTeams[0].id,
          project_id: undefined,
          labels: [],
          title_template: "Survey Response",
        });
      }
    } catch {
      setError("Failed to load teams");
    }
  }

  async function loadProjects(teamId: string) {
    if (!apiKey) return;
    
    setLoadingProjects(true);
    try {
      const teamProjects = await getLinearProjects(apiKey, teamId);
      setProjects(teamProjects);
    } catch {
      console.error("Failed to load projects");
    } finally {
      setLoadingProjects(false);
    }
  }

  function handleTeamChange(teamId: string) {
    if (!teamId) {
      onChange(null);
      return;
    }
    
    onChange({
      team_id: teamId,
      project_id: undefined,
      labels: config?.labels || [],
      title_template: config?.title_template || "Survey Response",
    });
  }

  function handleDisconnect() {
    setTeams([]);
    setProjects([]);
    onChange(null);
  }

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-text-tertiary" />
        </div>
      </Card>
    );
  }

  // No API key configured - show setup prompt
  if (!apiKey || !apiKeyVerified) {
    return (
      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-text-primary">Linear Integration</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>Linear API key not configured</span>
          </div>
          
          <p className="text-xs text-text-secondary">
            Configure your Linear API key in settings to enable pushing survey responses as issues.
          </p>
          
          <Link href="/settings">
            <Button size="sm" className="w-full">
              <Settings className="mr-2 h-4 w-4" />
              Go to Settings
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  // API key is configured - show team/project selection
  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-text-primary">Linear Integration</p>
        <Badge variant="success">
          <Check className="mr-1 h-3 w-3" />
          Connected
        </Badge>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Team Selection */}
        <div>
          <Label className="mb-1.5 block text-xs text-text-secondary">
            Team
          </Label>
          <Select
            value={config?.team_id || ""}
            onChange={(e) => handleTeamChange(e.target.value)}
          >
            <option value="">Select a team...</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Project Selection */}
        {config?.team_id && (
          <div>
            <Label className="mb-1.5 block text-xs text-text-secondary">
              Project (optional)
            </Label>
            {loadingProjects ? (
              <div className="flex items-center gap-2 py-2 text-sm text-text-tertiary">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading projects...
              </div>
            ) : (
              <Select
                value={config?.project_id || ""}
                onChange={(e) =>
                  onChange({ ...config, project_id: e.target.value || undefined })
                }
              >
                <option value="">No project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Select>
            )}
          </div>
        )}

        {/* Title Template */}
        {config?.team_id && (
          <div>
            <Label className="mb-1.5 block text-xs text-text-secondary">
              Issue Title Template
            </Label>
            <Input
              value={config?.title_template || ""}
              onChange={(e) =>
                onChange({ ...config!, title_template: e.target.value })
              }
              placeholder="Survey Response"
            />
            <p className="mt-1.5 text-xs text-text-tertiary">
              Used as the issue title when pushing responses.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link href="/settings" className="flex-1">
            <Button variant="ghost" size="sm" className="w-full">
              <Settings className="mr-1.5 h-4 w-4" />
              Settings
            </Button>
          </Link>
          {config?.team_id && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDisconnect}
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              Disconnect
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
