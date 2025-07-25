// API-related type definitions for backend integration

export interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface SyncOperation {
  type: 'create' | 'update' | 'delete';
  planId: string;
  data?: unknown;
  timestamp: Date;
}

// Conflict resolution types for when multiple users edit the same plan
export interface ConflictResolution {
  strategy: 'local' | 'remote' | 'merge';
  resolvedData: unknown;
}

export interface SyncConflict {
  localData: unknown;
  remoteData: unknown;
  conflictType: 'concurrent_edit' | 'version_mismatch';
  timestamp: Date;
}

// Authentication types that will be used with the auth context
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: Date;
}