import type { Competitor, Change, WeeklyDigestData } from '../_types';

// Mock competitors
export const mockCompetitors: Competitor[] = [
  {
    id: 'comp-1',
    name: 'Flowbase',
    domain: 'flowbase.io',
    surfaces: [
      { type: 'pricing', url: 'https://flowbase.io/pricing', lastChecked: '2026-01-04T10:00:00Z' },
      { type: 'homepage', url: 'https://flowbase.io', lastChecked: '2026-01-04T10:00:00Z' },
      { type: 'changelog', url: 'https://flowbase.io/changelog', lastChecked: '2026-01-04T10:00:00Z' },
    ],
    addedAt: '2025-11-15T09:00:00Z',
  },
  {
    id: 'comp-2',
    name: 'Streamline',
    domain: 'streamline.app',
    surfaces: [
      { type: 'pricing', url: 'https://streamline.app/pricing', lastChecked: '2026-01-04T09:30:00Z' },
      { type: 'homepage', url: 'https://streamline.app', lastChecked: '2026-01-04T09:30:00Z' },
    ],
    addedAt: '2025-12-01T14:00:00Z',
  },
  {
    id: 'comp-3',
    name: 'Nexus Pro',
    domain: 'nexuspro.com',
    surfaces: [
      { type: 'homepage', url: 'https://nexuspro.com', lastChecked: '2026-01-04T08:00:00Z' },
      { type: 'changelog', url: 'https://nexuspro.com/updates', lastChecked: '2026-01-04T08:00:00Z' },
    ],
    addedAt: '2025-12-20T11:00:00Z',
  },
];

// Mock changes with realistic data
export const mockChanges: Change[] = [
  {
    id: 'change-1',
    competitorId: 'comp-1',
    surfaceType: 'pricing',
    changeType: 'pricing',
    detectedAt: '2026-01-04T06:30:00Z',
    summary: 'Flowbase increased Pro plan pricing from $29/mo to $39/mo',
    beforeText: 'Pro Plan\n$29/month\n• Unlimited projects\n• Priority support\n• API access',
    afterText: 'Pro Plan\n$39/month\n• Unlimited projects\n• Priority support\n• API access\n• Advanced analytics',
    whyItMatters: [
      'Their Pro tier now costs 34% more — creates pricing gap we can exploit',
      'Added "Advanced analytics" to justify increase, signaling feature parity concern',
    ],
    suggestedActions: [
      'Update pricing comparison page to highlight our value',
      'Arm sales team with talking points on total cost of ownership',
    ],
    isRead: false,
  },
  {
    id: 'change-2',
    competitorId: 'comp-2',
    surfaceType: 'homepage',
    changeType: 'positioning',
    detectedAt: '2026-01-03T14:15:00Z',
    summary: 'Streamline changed headline from "Project management simplified" to "AI-powered project management for modern teams"',
    beforeText: 'Project management simplified\nThe intuitive way to manage work.',
    afterText: 'AI-powered project management for modern teams\nLet AI handle the busy work while you focus on what matters.',
    whyItMatters: [
      'Clear pivot to AI positioning — they\'re betting on this trend',
      'Target persona shift: "simplified" (SMB) → "modern teams" (mid-market)',
    ],
    suggestedActions: [
      'Audit our homepage — do we mention AI capabilities prominently?',
      'Consider counter-positioning: "Human-first" or emphasize reliability over AI hype',
    ],
    isRead: false,
  },
  {
    id: 'change-3',
    competitorId: 'comp-1',
    surfaceType: 'changelog',
    changeType: 'feature',
    detectedAt: '2026-01-02T09:00:00Z',
    summary: 'Flowbase announced Slack integration with real-time sync',
    beforeText: '',
    afterText: '🚀 New: Slack Integration\nGet real-time notifications in Slack. Two-way sync keeps your team in the loop without switching tabs.',
    whyItMatters: [
      'Slack integration is a common buying criteria — they\'re checking a box',
      'Emphasizes "real-time" — speed is becoming a differentiator',
    ],
    suggestedActions: [
      'If we have Slack integration, highlight it more prominently',
      'If not, prioritize on roadmap or prepare competitive response',
    ],
    isRead: true,
  },
  {
    id: 'change-4',
    competitorId: 'comp-3',
    surfaceType: 'homepage',
    changeType: 'trust',
    detectedAt: '2026-01-01T16:45:00Z',
    summary: 'Nexus Pro added SOC 2 certification badge and 3 new enterprise logos',
    beforeText: 'Trusted by 500+ companies\n[Logo: Acme Corp] [Logo: TechStart]',
    afterText: 'Trusted by 500+ companies\nSOC 2 Type II Certified\n[Logo: Acme Corp] [Logo: TechStart] [Logo: GlobalBank] [Logo: SecureHealth] [Logo: FinanceFirst]',
    whyItMatters: [
      'SOC 2 certification signals enterprise sales push',
      'New logos are all regulated industries (finance, healthcare) — targeting compliance-heavy buyers',
    ],
    suggestedActions: [
      'Verify our compliance certifications are prominently displayed',
      'Consider case study push with similar enterprise customers',
    ],
    isRead: true,
  },
  {
    id: 'change-5',
    competitorId: 'comp-2',
    surfaceType: 'pricing',
    changeType: 'packaging',
    detectedAt: '2025-12-30T11:20:00Z',
    summary: 'Streamline introduced new "Starter" tier and moved SSO from Team to Enterprise',
    beforeText: 'Team Plan - $15/user/mo\n• Unlimited projects\n• SSO\n• Priority support',
    afterText: 'Starter Plan - $9/user/mo\n• 10 projects\n• Basic support\n\nTeam Plan - $15/user/mo\n• Unlimited projects\n• Priority support\n\nEnterprise - Custom\n• SSO\n• Dedicated support',
    whyItMatters: [
      'New $9 Starter tier — attacking the low end of market',
      'SSO moved to Enterprise = upsell lever for security-conscious buyers',
    ],
    suggestedActions: [
      'Review our entry-level offering — can we compete at $9?',
      'Highlight SSO inclusion in our mid-tier if applicable',
    ],
    isRead: true,
  },
  {
    id: 'change-6',
    competitorId: 'comp-1',
    surfaceType: 'homepage',
    changeType: 'urgency',
    detectedAt: '2025-12-28T08:00:00Z',
    summary: 'Flowbase added "New Year Sale: 40% off annual plans" banner',
    beforeText: '',
    afterText: '🎉 New Year Sale: 40% off annual plans — ends Jan 15th',
    whyItMatters: [
      '40% discount is aggressive — likely pushing for annual commitments',
      'Time-limited offer suggests end-of-quarter/year push',
    ],
    suggestedActions: [
      'Monitor if this converts — may indicate pricing flexibility',
      'Consider counter-promotion or emphasize "no gimmicks" steady pricing',
    ],
    isRead: true,
  },
  {
    id: 'change-7',
    competitorId: 'comp-3',
    surfaceType: 'changelog',
    changeType: 'feature',
    detectedAt: '2025-12-26T13:30:00Z',
    summary: 'Nexus Pro launched AI-powered task prioritization',
    beforeText: '',
    afterText: 'Introducing Smart Priority\nOur new AI engine analyzes your workflow and automatically suggests task priorities based on deadlines, dependencies, and team capacity.',
    whyItMatters: [
      'Another competitor jumping on AI — market expectation is shifting',
      '"Smart Priority" is a branded feature — they\'re building differentiated IP',
    ],
    suggestedActions: [
      'Track user feedback on this feature in reviews/social',
      'Evaluate if similar capability fits our product vision',
    ],
    isRead: true,
  },
];

// Mock weekly digest data
export const mockWeeklyDigest: WeeklyDigestData = {
  weekStart: '2025-12-29T00:00:00Z',
  weekEnd: '2026-01-04T23:59:59Z',
  summaries: [
    {
      competitorId: 'comp-1',
      competitorName: 'Flowbase',
      changeCount: 3,
      changeTypes: ['pricing', 'feature', 'urgency'],
    },
    {
      competitorId: 'comp-2',
      competitorName: 'Streamline',
      changeCount: 2,
      changeTypes: ['positioning', 'packaging'],
    },
    {
      competitorId: 'comp-3',
      competitorName: 'Nexus Pro',
      changeCount: 2,
      changeTypes: ['trust', 'feature'],
    },
  ],
  topTheme: 'AI & automation messaging',
  totalChanges: 7,
};

// Helper to get changes for a specific competitor
export function getChangesForCompetitor(competitorId: string): Change[] {
  return mockChanges.filter((c) => c.competitorId === competitorId);
}

// Helper to get recent changes (last 7 days)
export function getRecentChanges(): Change[] {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return mockChanges
    .filter((c) => new Date(c.detectedAt) >= sevenDaysAgo)
    .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());
}

// Helper to get unread changes count
export function getUnreadCount(): number {
  return mockChanges.filter((c) => !c.isRead).length;
}

