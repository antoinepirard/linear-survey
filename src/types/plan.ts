import { TeamPlanData } from '@/data/teamplan';

export interface NotepadDocument {
  id: string;
  title: string;
  content: string;
  version: number;
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

// Error classes for document operations
export class DocumentConflictError extends Error {
  constructor(documentId: string, expectedVersion: number, actualVersion: number) {
    super(`Document ${documentId} conflict: expected version ${expectedVersion}, got ${actualVersion}`);
    this.name = 'DocumentConflictError';
  }
}

export class DocumentNotFoundError extends Error {
  constructor(documentId: string) {
    super(`Document ${documentId} not found`);
    this.name = 'DocumentNotFoundError';
  }
}

export class DocumentValidationError extends Error {
  constructor(message: string, field?: string) {
    super(`Document validation failed: ${message}${field ? ` (field: ${field})` : ''}`);
    this.name = 'DocumentValidationError';
  }
}

// Validation functions
export const validateDocument = (doc: Partial<NotepadDocument>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!doc.id || typeof doc.id !== 'string' || doc.id.trim().length === 0) {
    errors.push('Document ID is required and must be a non-empty string');
  }
  
  if (!doc.title || typeof doc.title !== 'string' || doc.title.trim().length === 0) {
    errors.push('Document title is required and must be a non-empty string');
  }
  
  if (doc.title && doc.title.length > 100) {
    errors.push('Document title must be 100 characters or less');
  }
  
  if (typeof doc.content !== 'string') {
    errors.push('Document content must be a string');
  }
  
  if (typeof doc.version !== 'number' || doc.version < 0) {
    errors.push('Document version must be a non-negative number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};