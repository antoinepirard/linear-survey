import { Plan, PlanStorage, NotepadDocument } from '@/types/plan';

// Helper functions for consistent data serialization before API calls

import { TeamPlanData } from '@/data/teamplan';

export interface SerializedNotepadDocument {
  id: string;
  title: string;
  content: string;
  version: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface SerializedPlan {
  id: string;
  name: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  teamPlanData: TeamPlanData;
  notepadData: {
    width: number;
    currentDocumentId: string | null;
    documents: Record<string, SerializedNotepadDocument>;
  };
}

export interface SerializedPlanStorage {
  currentPlanId: string | null;
  plans: Record<string, SerializedPlan>;
}

// Serialize a Plan object for API transmission
export const serializePlan = (plan: Plan): SerializedPlan => {
  const serializedDocuments: Record<string, SerializedNotepadDocument> = {};
  
  // Serialize all documents
  Object.entries(plan.notepadData.documents).forEach(([id, document]) => {
    serializedDocuments[id] = {
      id: document.id,
      title: document.title,
      content: document.content,
      version: document.version,
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString()
    };
  });

  return {
    id: plan.id,
    name: plan.name,
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
    teamPlanData: plan.teamPlanData,
    notepadData: {
      width: plan.notepadData.width,
      currentDocumentId: plan.notepadData.currentDocumentId,
      documents: serializedDocuments
    }
  };
};

// Deserialize a Plan object from API response
export const deserializePlan = (serializedPlan: SerializedPlan): Plan => {
  const documents: Record<string, NotepadDocument> = {};
  
  // Deserialize all documents
  Object.entries(serializedPlan.notepadData.documents).forEach(([id, serializedDocument]) => {
    documents[id] = {
      id: serializedDocument.id,
      title: serializedDocument.title,
      content: serializedDocument.content,
      version: serializedDocument.version,
      createdAt: new Date(serializedDocument.createdAt),
      updatedAt: new Date(serializedDocument.updatedAt)
    };
  });

  return {
    id: serializedPlan.id,
    name: serializedPlan.name,
    createdAt: new Date(serializedPlan.createdAt),
    updatedAt: new Date(serializedPlan.updatedAt),
    teamPlanData: serializedPlan.teamPlanData,
    notepadData: {
      width: serializedPlan.notepadData.width,
      currentDocumentId: serializedPlan.notepadData.currentDocumentId,
      documents: documents
    }
  };
};

// Serialize PlanStorage for API transmission
export const serializePlanStorage = (storage: PlanStorage): SerializedPlanStorage => {
  return {
    currentPlanId: storage.currentPlanId,
    plans: Object.fromEntries(
      Object.entries(storage.plans).map(([id, plan]) => [
        id,
        serializePlan(plan)
      ])
    )
  };
};

// Deserialize PlanStorage from API response
export const deserializePlanStorage = (serializedStorage: SerializedPlanStorage): PlanStorage => {
  return {
    currentPlanId: serializedStorage.currentPlanId,
    plans: Object.fromEntries(
      Object.entries(serializedStorage.plans).map(([id, serializedPlan]) => [
        id,
        deserializePlan(serializedPlan)
      ])
    )
  };
};

// Create a deep clone of plan storage (useful for optimistic updates)
export const clonePlanStorage = (storage: PlanStorage): PlanStorage => {
  return deserializePlanStorage(serializePlanStorage(storage));
};

// Create a minimal version of plan data for efficient API calls (just metadata)
export const createPlanMetadata = (plan: Plan) => {
  return {
    id: plan.id,
    name: plan.name,
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString()
  };
};

// Helper to prepare partial updates for API calls
export const serializePartialUpdate = (updates: Partial<Pick<Plan, 'teamPlanData' | 'notepadData' | 'name'>>) => {
  const serialized: Record<string, unknown> = {};
  
  if (updates.name !== undefined) {
    serialized.name = updates.name;
  }
  
  if (updates.teamPlanData !== undefined) {
    serialized.teamPlanData = updates.teamPlanData;
  }
  
  if (updates.notepadData !== undefined) {
    serialized.notepadData = updates.notepadData;
  }
  
  // Always include updated timestamp
  serialized.updatedAt = new Date().toISOString();
  
  return serialized;
};