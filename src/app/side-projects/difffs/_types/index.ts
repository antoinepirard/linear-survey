// Surface types - pages/sections to track on competitor sites
export type SurfaceType = 'pricing' | 'homepage' | 'changelog' | 'product' | 'docs' | 'careers';

export interface Surface {
  type: SurfaceType;
  url: string;
  lastChecked: string; // ISO date
}

// Change classification types
export type ChangeType = 
  | 'pricing'      // Numbers, billing period, tiers
  | 'packaging'    // Plan names, feature movement
  | 'positioning'  // Headline, subheadline, target persona
  | 'feature'      // New integrations, AI, Security sections
  | 'trust'        // Logos, testimonials, certifications
  | 'urgency';     // Limited offers, promos

// A detected change on a competitor's surface
export interface Change {
  id: string;
  competitorId: string;
  surfaceType: SurfaceType;
  changeType: ChangeType;
  detectedAt: string; // ISO date
  
  // What changed
  summary: string;
  beforeText?: string;
  afterText?: string;
  
  // So what? - AI-generated insights
  whyItMatters: string[];
  suggestedActions: string[];
  
  // UI state
  isRead: boolean;
}

// A tracked competitor
export interface Competitor {
  id: string;
  name: string;
  domain: string; // e.g., "acme.com"
  logoUrl?: string;
  surfaces: Surface[];
  addedAt: string; // ISO date
}

// Weekly digest summary
export interface DigestSummary {
  competitorId: string;
  competitorName: string;
  changeCount: number;
  changeTypes: ChangeType[];
}

export interface WeeklyDigestData {
  weekStart: string; // ISO date
  weekEnd: string;
  summaries: DigestSummary[];
  topTheme: string;
  totalChanges: number;
}

// Surface configuration for UI
export const SURFACE_CONFIG: Record<SurfaceType, { label: string; description: string }> = {
  pricing: { label: 'Pricing', description: 'Track pricing page changes' },
  homepage: { label: 'Homepage', description: 'Monitor homepage messaging' },
  changelog: { label: 'Changelog', description: 'Follow product updates' },
  product: { label: 'Product', description: 'Watch feature pages' },
  docs: { label: 'Docs', description: 'Track documentation changes' },
  careers: { label: 'Careers', description: 'Spot hiring signals' },
};

// Change type configuration for UI
export const CHANGE_TYPE_CONFIG: Record<ChangeType, { label: string; color: string; bgColor: string }> = {
  pricing: { label: 'Pricing', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  packaging: { label: 'Packaging', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
  positioning: { label: 'Positioning', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  feature: { label: 'Feature', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
  trust: { label: 'Trust', color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  urgency: { label: 'Urgency', color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
};

