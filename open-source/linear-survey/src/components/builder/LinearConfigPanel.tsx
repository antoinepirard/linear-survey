"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { LinearConfig, LinearTeam, LinearProject } from "@/lib/types";
import { getLinearTeams, getLinearProjects } from "@/lib/linear";

interface LinearConfigPanelProps {
  config: LinearConfig | null;
  onChange: (config: LinearConfig | null) => void;
}

export function LinearConfigPanel({ config, onChange }: LinearConfigPanelProps) {
  const [apiKey, setApiKey] = useState(config?.api_key || "");
  const [teams, setTeams] = useState<LinearTeam[]>([]);
  const [projects, setProjects] = useState<LinearProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(!!config?.team_id);

  async function handleConnect() {
    if (!apiKey.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedTeams = await getLinearTeams(apiKey);
      setTeams(fetchedTeams);
      setConnected(true);

      // If there's only one team, auto-select it
      if (fetchedTeams.length === 1) {
        const teamProjects = await getLinearProjects(apiKey, fetchedTeams[0].id);
        setProjects(teamProjects);
        onChange({
          api_key: apiKey,
          team_id: fetchedTeams[0].id,
          project_id: undefined,
          labels: [],
          title_template: "Survey Response",
        });
      } else {
        onChange({
          api_key: apiKey,
          team_id: "",
          project_id: undefined,
          labels: [],
          title_template: "Survey Response",
        });
      }
    } catch (err) {
      setError("Failed to connect. Please check your API key.");
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleTeamChange(teamId: string) {
    if (!config || !teamId) return;

    setLoading(true);
    try {
      const teamProjects = await getLinearProjects(config.api_key, teamId);
      setProjects(teamProjects);
      onChange({
        ...config,
        team_id: teamId,
        project_id: undefined,
      });
    } catch (err) {
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }

  function handleDisconnect() {
    setConnected(false);
    setTeams([]);
    setProjects([]);
    setApiKey("");
    onChange(null);
  }

  // Load projects when team is already selected
  useEffect(() => {
    if (config?.team_id && config?.api_key && connected) {
      getLinearTeams(config.api_key)
        .then(setTeams)
        .catch(() => {});
      getLinearProjects(config.api_key, config.team_id)
        .then(setProjects)
        .catch(() => {});
    }
  }, []);

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-text-primary">Linear Integration</p>
        {connected && (
          <Badge variant="success">
            <Check className="mr-1 h-3 w-3" />
            Connected
          </Badge>
        )}
      </div>

      {!connected ? (
        <div className="space-y-4">
          <div>
            <Label className="mb-1.5 block text-xs text-text-secondary">
              API Key
            </Label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="lin_api_..."
            />
            <p className="mt-1.5 text-xs text-text-tertiary">
              Get your API key from{" "}
              <a
                href="https://linear.app/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Linear Settings
              </a>
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <Button
            onClick={handleConnect}
            disabled={!apiKey.trim() || loading}
            className="w-full"
            size="sm"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect to Linear"
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {teams.length > 1 && (
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
          )}

          {config?.team_id && projects.length > 0 && (
            <div>
              <Label className="mb-1.5 block text-xs text-text-secondary">
                Project (optional)
              </Label>
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
            </div>
          )}

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

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDisconnect}
            className="w-full text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            Disconnect
          </Button>
        </div>
      )}
    </Card>
  );
}

