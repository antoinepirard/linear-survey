import { TeamPlanData } from '@/data/teamplan';

export interface NotepadDocument {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Plan {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  teamPlanData: TeamPlanData;
  notepadData: {
    width: number;
    currentDocumentId: string | null;
    documents: Record<string, NotepadDocument>;
  };
}

export interface PlanMetadata {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanStorage {
  currentPlanId: string | null;
  plans: Record<string, Plan>;
}

// Legacy notepad data structure for backward compatibility
export interface LegacyNotepadData {
  content: string;
  title: string;
  width: number;
}

// Type guard to check if notepadData is legacy format
export function isLegacyNotepadData(data: unknown): data is LegacyNotepadData {
  if (data === null || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return typeof obj.content === 'string' && typeof obj.title === 'string' && typeof obj.width === 'number';
}