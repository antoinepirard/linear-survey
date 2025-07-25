import { useState, useEffect, useCallback } from 'react';
import { Plan, PlanStorage, PlanMetadata } from '@/types/plan';
import { DEFAULT_TEAMPLAN_DATA } from '@/data/teamplan';

const PLAN_STORAGE_KEY = 'folio-plans';

const generateId = () => Math.random().toString(36).substr(2, 9);

const createDefaultPlan = (name: string = 'Monthly Plan'): Plan => {
  // Calculate 35% of viewport width, clamped between 300-800px
  const calculateDefaultWidth = () => {
    if (typeof window === 'undefined') return 400; // SSR fallback
    return Math.max(300, Math.min(800, Math.round(window.innerWidth * 0.35)));
  };

  return {
    id: generateId(),
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
    teamPlanData: DEFAULT_TEAMPLAN_DATA,
    notepadData: {
      content: '',
      title: 'Notes',
      width: calculateDefaultWidth()
    }
  };
};

export const usePlanStorage = () => {
  const [planStorage, setPlanStorage] = useState<PlanStorage>({ currentPlanId: null, plans: {} });
  const [isLoading, setIsLoading] = useState(true);

  // Load plans from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const createNewDefaultStorage = () => {
        const defaultPlan = createDefaultPlan();
        return {
            currentPlanId: defaultPlan.id,
            plans: { [defaultPlan.id]: defaultPlan }
        };
    };

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
        
        // Ensure there's at least one plan and a valid currentPlanId
        const planIds = Object.keys(storage.plans);
        if (planIds.length === 0 || !storage.currentPlanId || !storage.plans[storage.currentPlanId]) {
            storage = createNewDefaultStorage();
        }

      } catch (error) {
        console.error('Failed to parse plan storage, creating new default:', error);
        storage = createNewDefaultStorage();
      }
    } else {
        storage = createNewDefaultStorage();
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

  const renamePlan = useCallback((planId: string, newName: string) => {
    const plan = planStorage.plans[planId];
    if (!plan) return;
    
    const updatedPlan = {
      ...plan,
      name: newName,
      updatedAt: new Date()
    };
    
    const newStorage = {
      ...planStorage,
      plans: {
        ...planStorage.plans,
        [planId]: updatedPlan
      }
    };
    
    setPlanStorage(newStorage);
    savePlanStorage(newStorage);
  }, [planStorage, savePlanStorage]);

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
    updateCurrentPlan,
    renamePlan
  };
};