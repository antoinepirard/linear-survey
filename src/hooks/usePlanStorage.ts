import { useState, useEffect, useCallback } from 'react';
import { Plan, PlanStorage, PlanMetadata } from '@/types/plan';
import { DEFAULT_TEAMPLAN_DATA } from '@/data/teamplan';

const PLAN_STORAGE_KEY = 'folio-plans';
const LEGACY_TEAMPLAN_KEY = 'teamplan-data';
const LEGACY_NOTEPAD_CONTENT_KEY = 'notepad-content';
const LEGACY_NOTEPAD_TITLE_KEY = 'notepad-title';
const LEGACY_NOTEPAD_WIDTH_KEY = 'notepad-width';

const generateId = () => Math.random().toString(36).substr(2, 9);

const createDefaultPlan = (name: string = 'My First Plan'): Plan => ({
  id: generateId(),
  name,
  createdAt: new Date(),
  updatedAt: new Date(),
  teamPlanData: DEFAULT_TEAMPLAN_DATA,
  notepadData: {
    content: '',
    title: 'Notes',
    width: 320
  }
});

const migrateExistingData = (): PlanStorage => {
  if (typeof window === 'undefined') {
    return { currentPlanId: null, plans: {} };
  }

  // Check for legacy data
  const legacyTeamPlanData = localStorage.getItem(LEGACY_TEAMPLAN_KEY);
  const legacyNotepadContent = localStorage.getItem(LEGACY_NOTEPAD_CONTENT_KEY);
  const legacyNotepadTitle = localStorage.getItem(LEGACY_NOTEPAD_TITLE_KEY);
  const legacyNotepadWidth = localStorage.getItem(LEGACY_NOTEPAD_WIDTH_KEY);

  const hasLegacyData = legacyTeamPlanData || legacyNotepadContent || legacyNotepadTitle || legacyNotepadWidth;

  if (hasLegacyData) {
    console.log('🔄 Migrating existing data to new plan structure...');
    
    const plan = createDefaultPlan('Migrated Plan');
    
    // Migrate team plan data
    if (legacyTeamPlanData) {
      try {
        plan.teamPlanData = JSON.parse(legacyTeamPlanData);
      } catch (error) {
        console.error('Failed to parse legacy team plan data:', error);
      }
    }
    
    // Migrate notepad data
    plan.notepadData.content = legacyNotepadContent || '';
    plan.notepadData.title = legacyNotepadTitle || 'Notes';
    plan.notepadData.width = legacyNotepadWidth ? parseInt(legacyNotepadWidth, 10) : 320;
    
    const planStorage: PlanStorage = {
      currentPlanId: plan.id,
      plans: { [plan.id]: plan }
    };
    
    // Save migrated data
    localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(planStorage));
    
    // Clean up legacy data
    localStorage.removeItem(LEGACY_TEAMPLAN_KEY);
    localStorage.removeItem(LEGACY_NOTEPAD_CONTENT_KEY);
    localStorage.removeItem(LEGACY_NOTEPAD_TITLE_KEY);
    localStorage.removeItem(LEGACY_NOTEPAD_WIDTH_KEY);
    
    console.log('✅ Migration complete');
    return planStorage;
  }

  // No legacy data, create default
  const defaultPlan = createDefaultPlan();
  return {
    currentPlanId: defaultPlan.id,
    plans: { [defaultPlan.id]: defaultPlan }
  };
};

export const usePlanStorage = () => {
  const [planStorage, setPlanStorage] = useState<PlanStorage>({ currentPlanId: null, plans: {} });
  const [isLoading, setIsLoading] = useState(true);

  // Load plans from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(PLAN_STORAGE_KEY);
    let storage: PlanStorage;

    if (stored) {
      try {
        storage = JSON.parse(stored);
        // Convert date strings back to Date objects
        Object.values(storage.plans).forEach(plan => {
          plan.createdAt = new Date(plan.createdAt);
          plan.updatedAt = new Date(plan.updatedAt);
        });
      } catch (error) {
        console.error('Failed to parse plan storage:', error);
        storage = migrateExistingData();
      }
    } else {
      storage = migrateExistingData();
    }

    setPlanStorage(storage);
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever planStorage changes
  const savePlanStorage = useCallback((storage: PlanStorage) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(storage));
    } catch (error) {
      console.error('Failed to save plan storage:', error);
    }
  }, []);

  const currentPlan = planStorage.currentPlanId ? planStorage.plans[planStorage.currentPlanId] : null;

  const createPlan = useCallback((name: string) => {
    const newPlan = createDefaultPlan(name);
    const newStorage = {
      ...planStorage,
      currentPlanId: newPlan.id,
      plans: {
        ...planStorage.plans,
        [newPlan.id]: newPlan
      }
    };
    
    setPlanStorage(newStorage);
    savePlanStorage(newStorage);
    
    return newPlan;
  }, [planStorage, savePlanStorage]);

  const deletePlan = useCallback((planId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [planId]: _deleted, ...remainingPlans } = planStorage.plans;
    const planIds = Object.keys(remainingPlans);
    
    // If deleting current plan, switch to another one or create new
    let newCurrentId = planStorage.currentPlanId;
    if (planStorage.currentPlanId === planId) {
      if (planIds.length > 0) {
        newCurrentId = planIds[0];
      } else {
        const defaultPlan = createDefaultPlan();
        remainingPlans[defaultPlan.id] = defaultPlan;
        newCurrentId = defaultPlan.id;
      }
    }
    
    const newStorage = {
      currentPlanId: newCurrentId,
      plans: remainingPlans
    };
    
    setPlanStorage(newStorage);
    savePlanStorage(newStorage);
  }, [planStorage, savePlanStorage]);

  const switchToPlan = useCallback((planId: string) => {
    if (!planStorage.plans[planId]) return;
    
    const newStorage = {
      ...planStorage,
      currentPlanId: planId
    };
    
    setPlanStorage(newStorage);
    savePlanStorage(newStorage);
  }, [planStorage, savePlanStorage]);

  const updateCurrentPlan = useCallback((updates: Partial<Pick<Plan, 'teamPlanData' | 'notepadData' | 'name'>>) => {
    if (!currentPlan) return;
    
    const updatedPlan = {
      ...currentPlan,
      ...updates,
      updatedAt: new Date()
    };
    
    const newStorage = {
      ...planStorage,
      plans: {
        ...planStorage.plans,
        [currentPlan.id]: updatedPlan
      }
    };
    
    setPlanStorage(newStorage);
    savePlanStorage(newStorage);
  }, [currentPlan, planStorage, savePlanStorage]);

  const getAllPlans = useCallback((): PlanMetadata[] => {
    return Object.values(planStorage.plans).map(plan => ({
      id: plan.id,
      name: plan.name,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt
    }));
  }, [planStorage.plans]);

  return {
    isLoading,
    currentPlan,
    allPlans: getAllPlans(),
    createPlan,
    deletePlan,
    switchToPlan,
    updateCurrentPlan
  };
};