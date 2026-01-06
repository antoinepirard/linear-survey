import {
  LinearTeam,
  LinearProject,
  LinearLabel,
  LinearIssue,
  Question,
  Answer,
} from "./types";

const LINEAR_API_URL = "https://api.linear.app/graphql";

// Generic GraphQL request helper
async function linearQuery<T>(
  apiKey: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(LINEAR_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Linear API error: ${response.status}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0]?.message || "Linear API error");
  }

  return result.data;
}

// ============================================
// Team Operations
// ============================================

export async function getLinearTeams(apiKey: string): Promise<LinearTeam[]> {
  const query = `
    query {
      teams {
        nodes {
          id
          name
          key
        }
      }
    }
  `;

  const data = await linearQuery<{ teams: { nodes: LinearTeam[] } }>(
    apiKey,
    query
  );
  return data.teams.nodes;
}

// ============================================
// Project Operations
// ============================================

export async function getLinearProjects(
  apiKey: string,
  teamId: string
): Promise<LinearProject[]> {
  const query = `
    query($teamId: String!) {
      team(id: $teamId) {
        projects {
          nodes {
            id
            name
          }
        }
      }
    }
  `;

  const data = await linearQuery<{
    team: { projects: { nodes: LinearProject[] } };
  }>(apiKey, query, { teamId });
  return data.team.projects.nodes;
}

// ============================================
// Label Operations
// ============================================

export async function getLinearLabels(
  apiKey: string,
  teamId: string
): Promise<LinearLabel[]> {
  const query = `
    query($teamId: String!) {
      team(id: $teamId) {
        labels {
          nodes {
            id
            name
            color
          }
        }
      }
    }
  `;

  const data = await linearQuery<{
    team: { labels: { nodes: LinearLabel[] } };
  }>(apiKey, query, { teamId });
  return data.team.labels.nodes;
}

// ============================================
// Issue Operations
// ============================================

export async function createLinearIssue(
  apiKey: string,
  teamId: string,
  title: string,
  description: string,
  projectId?: string,
  labelIds?: string[]
): Promise<LinearIssue> {
  const query = `
    mutation CreateIssue($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue {
          id
          identifier
          title
          url
        }
      }
    }
  `;

  const input: Record<string, unknown> = {
    teamId,
    title,
    description,
  };

  if (projectId) {
    input.projectId = projectId;
  }

  if (labelIds && labelIds.length > 0) {
    input.labelIds = labelIds;
  }

  const data = await linearQuery<{
    issueCreate: { success: boolean; issue: LinearIssue };
  }>(apiKey, query, { input });

  if (!data.issueCreate.success) {
    throw new Error("Failed to create issue");
  }

  return data.issueCreate.issue;
}

// ============================================
// Response Formatting
// ============================================

export function formatResponseAsMarkdown(
  questions: Question[],
  answers: Record<string, Answer>
): string {
  const lines: string[] = ["## Survey Response", ""];

  for (const question of questions) {
    const answer = answers[question.id];
    if (answer === undefined || answer === null || answer === "") continue;

    lines.push(`### ${question.title}`);

    if (Array.isArray(answer)) {
      lines.push(answer.map((a) => `- ${a}`).join("\n"));
    } else if (question.type === "rating") {
      const rating = question as { min: number; max: number };
      lines.push(`${answer} / ${rating.max}`);
    } else {
      lines.push(String(answer));
    }

    lines.push("");
  }

  lines.push("---");
  lines.push(`*Submitted on ${new Date().toLocaleString()}*`);

  return lines.join("\n");
}

// ============================================
// Push Response to Linear
// ============================================

export async function pushResponseToLinear(
  apiKey: string,
  teamId: string,
  title: string,
  questions: Question[],
  answers: Record<string, Answer>,
  projectId?: string,
  labelIds?: string[]
): Promise<LinearIssue> {
  const description = formatResponseAsMarkdown(questions, answers);

  return createLinearIssue(
    apiKey,
    teamId,
    title,
    description,
    projectId,
    labelIds
  );
}

