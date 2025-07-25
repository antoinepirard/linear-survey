import { Plan, PlanStorage } from '@/types/plan';

// Helper functions for consistent data serialization before API calls

import { TeamPlanData } from '@/data/teamplan';

export interface SerializedPlan {
  id: string;
  name: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  teamPlanData: TeamPlanData;
  notepadData: {
    content: string;
    title: string;
    width: number;
  };
}

export interface SerializedPlanStorage {
  currentPlanId: string | null;
  plans: Record<string, SerializedPlan>;
}

// Serialize a Plan object for API transmission
export const serializePlan = (plan: Plan): SerializedPlan => {
  return {
    id: plan.id,
    name: plan.name,
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
    teamPlanData: plan.teamPlanData,
    notepadData: {
      content: plan.notepadData.content,
      title: plan.notepadData.title,
      width: plan.notepadData.width
    }
  };
};

// Deserialize a Plan object from API response
export const deserializePlan = (serializedPlan: SerializedPlan): Plan => {
  return {
    id: serializedPlan.id,
    name: serializedPlan.name,
    createdAt: new Date(serializedPlan.createdAt),
    updatedAt: new Date(serializedPlan.updatedAt),
    teamPlanData: serializedPlan.teamPlanData,
    notepadData: {
      content: serializedPlan.notepadData.content,
      title: serializedPlan.notepadData.title,
      width: serializedPlan.notepadData.width
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