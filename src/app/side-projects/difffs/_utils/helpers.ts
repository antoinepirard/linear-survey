import { ChangeType, CHANGE_TYPE_CONFIG } from '../_types';

// Format relative time (e.g., "2 hours ago", "3 days ago")
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  
  if (minutes < 60) {
    return minutes <= 1 ? 'just now' : `${minutes} minutes ago`;
  }
  if (hours < 24) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  }
  if (days < 7) {
    return days === 1 ? 'yesterday' : `${days} days ago`;
  }
  if (weeks < 4) {
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Get week range string
export function getWeekRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  return `${startStr} - ${endStr}`;
}

// Get change type styling
export function getChangeTypeStyles(changeType: ChangeType) {
  return CHANGE_TYPE_CONFIG[changeType];
}

// Generate a simple ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// Get surface icon name (for heroicons)
export function getSurfaceIcon(surfaceType: string): string {
  const icons: Record<string, string> = {
    pricing: 'CurrencyDollarIcon',
    homepage: 'HomeIcon',
    changelog: 'DocumentTextIcon',
    product: 'CubeIcon',
    docs: 'BookOpenIcon',
    careers: 'UserGroupIcon',
  };
  return icons[surfaceType] || 'GlobeAltIcon';
}

// Count changes by type
export function countChangesByType(changes: { changeType: ChangeType }[]): Record<ChangeType, number> {
  const counts: Record<ChangeType, number> = {
    pricing: 0,
    packaging: 0,
    positioning: 0,
    feature: 0,
    trust: 0,
    urgency: 0,
  };
  
  changes.forEach((change) => {
    counts[change.changeType]++;
  });
  
  return counts;
}

// Get most common theme from changes
export function getMostCommonTheme(changes: { changeType: ChangeType }[]): string {
  const counts = countChangesByType(changes);
  const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
  
  if (sorted[0][1] === 0) return 'No changes detected';
  
  const themeLabels: Record<ChangeType, string> = {
    pricing: 'Pricing adjustments',
    packaging: 'Packaging restructuring',
    positioning: 'Messaging & positioning',
    feature: 'Feature announcements',
    trust: 'Social proof updates',
    urgency: 'Promotional urgency',
  };
  
  return themeLabels[sorted[0][0] as ChangeType];
}

