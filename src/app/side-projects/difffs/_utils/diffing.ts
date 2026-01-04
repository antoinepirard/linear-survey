import type { Change, ChangeType, SurfaceType } from "../_types";
import { generateId } from "./helpers";

// Diff result for a single line
interface LineDiff {
  type: "added" | "removed" | "unchanged";
  content: string;
}

// Compute line-by-line diff between two texts
export function computeLineDiff(before: string, after: string): LineDiff[] {
  const beforeLines = before.split("\n").filter((l) => l.trim());
  const afterLines = after.split("\n").filter((l) => l.trim());
  const result: LineDiff[] = [];

  const beforeSet = new Set(beforeLines);
  const afterSet = new Set(afterLines);

  // Find removed lines (in before but not in after)
  const removed = beforeLines.filter((line) => !afterSet.has(line));
  
  // Find added lines (in after but not in before)
  const added = afterLines.filter((line) => !beforeSet.has(line));

  // Build result
  removed.forEach((line) => {
    result.push({ type: "removed", content: line });
  });
  
  added.forEach((line) => {
    result.push({ type: "added", content: line });
  });

  return result;
}

// Extract significant changes (ignoring minor whitespace differences)
export function getSignificantChanges(
  before: string,
  after: string
): { added: string[]; removed: string[] } {
  const diff = computeLineDiff(before, after);
  
  return {
    added: diff.filter((d) => d.type === "added").map((d) => d.content),
    removed: diff.filter((d) => d.type === "removed").map((d) => d.content),
  };
}

// Classification patterns
const CLASSIFICATION_PATTERNS: Record<ChangeType, RegExp[]> = {
  pricing: [
    /\$\d+/i,
    /€\d+/i,
    /£\d+/i,
    /\d+\s*\/\s*(month|mo|year|yr|annual)/i,
    /per\s*(user|seat|month|year)/i,
    /\bpric(e|ing|ed)\b/i,
    /\bfree\s+tier\b/i,
    /\bfree\s+plan\b/i,
    /\bstarter\b.*\$|\$.*\bstarter\b/i,
    /\bpro\b.*\$|\$.*\bpro\b/i,
    /\benterprise\b.*\$|\$.*\benterprise\b/i,
    /\bbilling\b/i,
    /\bsubscription\b/i,
  ],
  packaging: [
    /\bplan(s)?\b/i,
    /\btier(s)?\b/i,
    /\binclude(s|d)?\b/i,
    /\bfeature(s)?\s+in\b/i,
    /\bupgrade\b/i,
    /\bdowngrade\b/i,
    /\bunlimited\b/i,
    /\blimit(s|ed)?\b/i,
    /\bsso\b/i,
    /\bapi\s+access\b/i,
    /\bsupport\b.*\b(priority|dedicated|premium)\b/i,
  ],
  positioning: [
    /\b(the|a)\s+(best|#1|leading|fastest|easiest|simplest)\b/i,
    /\bfor\s+(teams|startups|enterprise|developers|businesses)\b/i,
    /\bai[\s-]*(powered|driven|first|native)\b/i,
    /\bmodern\s+(teams?|businesses?|companies?)\b/i,
    /\ball[\s-]?in[\s-]?one\b/i,
    /\bplatform\b/i,
    /\bsolution\b/i,
    /\bhelp(s|ing)?\s+(you|teams?)\b/i,
    /\bstreamline\b/i,
    /\bautomate\b/i,
  ],
  feature: [
    /\bnew\b/i,
    /\bintroduc(e|ing|ed)\b/i,
    /\blaunch(ed|ing)?\b/i,
    /\bannounce?ing\b/i,
    /\bintegrat(e|ion|ed|ing)\b/i,
    /\bconnect(s|ed|ing)?\s+(to|with)\b/i,
    /\bslack\b/i,
    /\bzapier\b/i,
    /\bsalesforce\b/i,
    /\bhubspot\b/i,
    /\bapi\b/i,
    /\bwebhook(s)?\b/i,
    /\bautomation(s)?\b/i,
    /\bworkflow(s)?\b/i,
    /\bdashboard\b/i,
    /\breport(s|ing)?\b/i,
    /\banalytics\b/i,
  ],
  trust: [
    /\bsoc\s*2\b/i,
    /\biso\s*\d+/i,
    /\bgdpr\b/i,
    /\bhipaa\b/i,
    /\bcertif(ied|ication)\b/i,
    /\bcomplian(t|ce)\b/i,
    /\bsecur(e|ity)\b/i,
    /\bencrypt(ed|ion)\b/i,
    /\btrust(ed)?\s+(by)?\b/i,
    /\bcustomer(s)?\s+(logo|love|trust)/i,
    /\btestimonial(s)?\b/i,
    /\breview(s)?\b/i,
    /\brating(s)?\b/i,
    /\baward(s)?\b/i,
    /\b\d+\+?\s*(customers?|users?|companies?|teams?)\b/i,
  ],
  urgency: [
    /\blimited\s+(time|offer|availability)\b/i,
    /\bsale\b/i,
    /\bdiscount\b/i,
    /\b\d+%\s*off\b/i,
    /\bsave\s+\d+%/i,
    /\bpromo(tion|tional)?\b/i,
    /\bcoupon\b/i,
    /\bends?\s+(soon|today|tomorrow)\b/i,
    /\bexpire(s|d)?\b/i,
    /\bhurry\b/i,
    /\bdon't\s+miss\b/i,
    /\blast\s+chance\b/i,
    /\bact\s+now\b/i,
    /\btoday\s+only\b/i,
  ],
};

// Classify change type based on content
export function classifyChange(
  addedLines: string[],
  removedLines: string[],
  surfaceType: SurfaceType
): ChangeType {
  const allContent = [...addedLines, ...removedLines].join(" ").toLowerCase();

  // Score each change type
  const scores: Record<ChangeType, number> = {
    pricing: 0,
    packaging: 0,
    positioning: 0,
    feature: 0,
    trust: 0,
    urgency: 0,
  };

  // Check patterns
  for (const [type, patterns] of Object.entries(CLASSIFICATION_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(allContent)) {
        scores[type as ChangeType] += 1;
      }
    }
  }

  // Boost score based on surface type
  if (surfaceType === "pricing") {
    scores.pricing += 2;
    scores.packaging += 1;
  } else if (surfaceType === "homepage") {
    scores.positioning += 2;
  } else if (surfaceType === "changelog") {
    scores.feature += 2;
  }

  // Find highest scoring type
  let maxScore = 0;
  let bestType: ChangeType = "feature"; // Default

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestType = type as ChangeType;
    }
  }

  return bestType;
}

// Generate a human-readable summary of the change
export function generateSummary(
  addedLines: string[],
  removedLines: string[],
  changeType: ChangeType,
  competitorName: string
): string {
  // Try to create a meaningful summary based on the diff
  const addedText = addedLines.slice(0, 3).join(" ").substring(0, 100);
  const removedText = removedLines.slice(0, 3).join(" ").substring(0, 100);

  if (removedText && addedText) {
    return `${competitorName} changed from "${removedText}..." to "${addedText}..."`;
  } else if (addedText) {
    return `${competitorName} added: "${addedText}..."`;
  } else if (removedText) {
    return `${competitorName} removed: "${removedText}..."`;
  }

  // Fallback based on change type
  const summaryTemplates: Record<ChangeType, string> = {
    pricing: `${competitorName} updated their pricing page`,
    packaging: `${competitorName} changed their plan packaging`,
    positioning: `${competitorName} updated their messaging`,
    feature: `${competitorName} announced product changes`,
    trust: `${competitorName} updated trust signals`,
    urgency: `${competitorName} added promotional content`,
  };

  return summaryTemplates[changeType];
}

// Generate "Why it matters" insights
export function generateWhyItMatters(changeType: ChangeType): string[] {
  const templates: Record<ChangeType, string[]> = {
    pricing: [
      "Pricing changes can impact competitive positioning and sales conversations",
      "May indicate market pressure or new value proposition",
    ],
    packaging: [
      "Feature bundling changes affect how customers compare plans",
      "Could signal shift in target customer segment",
    ],
    positioning: [
      "Messaging changes reveal strategic direction and target audience shifts",
      "New positioning may require updating your competitive narrative",
    ],
    feature: [
      "New features could address gaps in their product",
      "May require updating feature comparison materials",
    ],
    trust: [
      "Trust signals affect enterprise buying decisions",
      "Certifications or logos may indicate target market expansion",
    ],
    urgency: [
      "Promotional activity may indicate sales pressure or quarter-end push",
      "Could temporarily affect competitive win rates",
    ],
  };

  return templates[changeType];
}

// Generate suggested actions
export function generateSuggestedActions(
  changeType: ChangeType
): string[] {
  const templates: Record<ChangeType, string[]> = {
    pricing: [
      "Review and update pricing comparison materials",
      "Brief sales team on competitive pricing changes",
    ],
    packaging: [
      "Update feature comparison matrix",
      "Review if your packaging addresses the same needs",
    ],
    positioning: [
      "Analyze if counter-positioning is needed",
      "Update sales battlecards with new competitive messaging",
    ],
    feature: [
      "Assess if similar capability is on your roadmap",
      "Prepare talking points for sales team",
    ],
    trust: [
      "Ensure your trust signals are prominently displayed",
      "Consider accelerating compliance certifications if applicable",
    ],
    urgency: [
      "Monitor impact on deal velocity",
      "Consider if promotional response is warranted",
    ],
  };

  return templates[changeType];
}

// Main function to detect and create changes
export function detectChanges(
  beforeContent: string,
  afterContent: string,
  competitorId: string,
  surfaceType: SurfaceType,
  competitorName: string
): Change[] {
  const { added, removed } = getSignificantChanges(beforeContent, afterContent);

  // Only create a change if there are meaningful differences
  if (added.length === 0 && removed.length === 0) {
    return [];
  }

  // Skip if changes are too minor (less than 10 characters of actual change)
  const totalChangeLength = added.join("").length + removed.join("").length;
  if (totalChangeLength < 10) {
    return [];
  }

  const changeType = classifyChange(added, removed, surfaceType);
  const summary = generateSummary(added, removed, changeType, competitorName);
  const whyItMatters = generateWhyItMatters(changeType);
  const suggestedActions = generateSuggestedActions(changeType);

  const change: Change = {
    id: generateId(),
    competitorId,
    surfaceType,
    changeType,
    detectedAt: new Date().toISOString(),
    summary,
    beforeText: removed.slice(0, 10).join("\n"),
    afterText: added.slice(0, 10).join("\n"),
    whyItMatters,
    suggestedActions,
    isRead: false,
  };

  return [change];
}

