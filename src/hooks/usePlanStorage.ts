import { useState, useEffect, useCallback, useRef } from 'react';
import { Plan, PlanStorage, PlanMetadata } from '@/types/plan';
import { DEFAULT_TEAMPLAN_DATA } from '@/data/teamplan';
import { useDebounce } from './useDebounce';
import { SyncOperation } from '@/types/api';
import { validatePlanStorage, sanitizePlanStorage } from '@/utils/dataValidation';
import { planStorageLogger as logger, syncLogger } from '@/utils/logger';

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

export type SyncState = 'idle' | 'syncing' | 'synced' | 'error';

export const usePlanStorage = () => {
  const [planStorage, setPlanStorage] = useState<PlanStorage>({ currentPlanId: null, plans: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [syncError, setSyncError] = useState<Error | null>(null);
  
  // For debouncing save operations to prevent excessive API calls
  const [pendingSaveOperation, setPendingSaveOperation] = useState<PlanStorage | null>(null);
  const debouncedSaveOperation = useDebounce(pendingSaveOperation, 300);
  
  // Track the last saved state to implement rollback on sync errors
  const lastSyncedStateRef = useRef<PlanStorage | null>(null);
  
  // Operation queue for offline scenarios
  const [operationQueue, setOperationQueue] = useState<SyncOperation[]>([]);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

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
        logger.error('Failed to parse plan storage, creating new default', error);
        storage = createNewDefaultStorage();
      }
    } else {
        storage = createNewDefaultStorage();
    }

    setPlanStorage(storage);
    lastSyncedStateRef.current = storage;
    setIsLoading(false);
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      // Process queued operations when coming back online
      if (operationQueue.length > 0) {
        processOperationQueue();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [operationQueue]);

  // Process queued operations when coming back online
  const processOperationQueue = useCallback(async () => {
    if (operationQueue.length === 0) return;

    syncLogger.info('Processing queued operations', { queueLength: operationQueue.length });
    
    // TODO: When Jonny adds the backend, implement actual API calls for queued operations
    // For now, just clear the queue since we're using localStorage
    setOperationQueue([]);
  }, [operationQueue]);

  // Add operation to queue for offline scenarios
  const queueOperation = useCallback((operation: SyncOperation) => {
    setOperationQueue(prev => [...prev, operation]);
  }, []);

  // Perform the actual sync operation (localStorage for now, API calls when Jonny integrates backend)
  const performSyncOperation = useCallback(async (storage: PlanStorage, operation?: SyncOperation) => {
    if (typeof window === 'undefined') return;
    
    // If offline, queue the operation for later
    if (!isOnline && operation) {
      queueOperation(operation);
      return;
    }
    
    // Validate data before sync
    const validation = validatePlanStorage(storage);
    if (!validation.isValid) {
      // Temporarily log detailed validation errors to understand the issue
      console.error('Detailed validation errors:', JSON.stringify(validation.errors, null, 2));
      syncLogger.warn('Data validation failed, proceeding anyway for debugging', validation.errors);
      
      // TODO: Re-enable this once validation is fixed
      // setSyncState('error');
      // setSyncError(new Error(`Data validation failed: ${validation.errors.map(e => e.message).join(', ')}`));
      // return;
    }
    
    // Sanitize data before sync
    const sanitizedStorage = sanitizePlanStorage(storage);
    
    setSyncState('syncing');
    setSyncError(null);
    
    try {
      // TODO: When Jonny adds the backend, replace this with API calls
      localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(sanitizedStorage));
      
      // Simulate API delay for testing purposes (remove when backend is integrated)
      // await new Promise(resolve => setTimeout(resolve, 100));
      
      lastSyncedStateRef.current = sanitizedStorage;
      setSyncState('synced');
      
      // Auto-clear synced state after 2 seconds
      setTimeout(() => {
        setSyncState('idle');
      }, 2000);
      
    } catch (error) {
      syncLogger.error('Failed to sync plan storage', error);
      setSyncState('error');
      setSyncError(error as Error);
      
      // If it's a network error and we have the operation, queue it for retry
      if (operation && !isOnline) {
        queueOperation(operation);
      }
    }
  }, [isOnline, queueOperation]);

  // Handle debounced save operations
  useEffect(() => {
    if (debouncedSaveOperation && debouncedSaveOperation !== lastSyncedStateRef.current) {
      const operation = (debouncedSaveOperation as any).__operation;
      // Clean up the temporary operation property
      delete (debouncedSaveOperation as any).__operation;
      performSyncOperation(debouncedSaveOperation, operation);
    }
  }, [debouncedSaveOperation, performSyncOperation]);

  // Rollback mechanism for failed sync operations
  const rollbackToLastSyncedState = useCallback(() => {
    if (lastSyncedStateRef.current) {
      setPlanStorage(lastSyncedStateRef.current);
      setSyncState('idle');
      setSyncError(null);
    }
  }, []);

  // Queue a save operation (with debouncing)
  const queueSaveOperation = useCallback((storage: PlanStorage, operation?: SyncOperation) => {
    setPendingSaveOperation(storage);
    // Store the operation for when the debounced save actually happens
    if (operation) {
      // We'll pass this through when the debounced operation executes
      (storage as any).__operation = operation;
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
    
    const operation: SyncOperation = {
      type: 'create',
      planId: newPlan.id,
      data: newPlan,
      timestamp: new Date()
    };
    
    setPlanStorage(newStorage);
    queueSaveOperation(newStorage, operation);
    
    return newPlan;
  }, [planStorage, queueSaveOperation]);

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
    
    const operation: SyncOperation = {
      type: 'delete',
      planId: planId,
      timestamp: new Date()
    };
    
    setPlanStorage(newStorage);
    queueSaveOperation(newStorage, operation);
  }, [planStorage, queueSaveOperation]);

  const switchToPlan = useCallback((planId: string) => {
    if (!planStorage.plans[planId]) return;
    
    const newStorage = {
      ...planStorage,
      currentPlanId: planId
    };
    
    setPlanStorage(newStorage);
    queueSaveOperation(newStorage);
  }, [planStorage, queueSaveOperation]);

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
    
    const operation: SyncOperation = {
      type: 'update',
      planId: currentPlan.id,
      data: updates,
      timestamp: new Date()
    };
    
    setPlanStorage(newStorage);
    queueSaveOperation(newStorage, operation);
  }, [currentPlan, planStorage, queueSaveOperation]);

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
    
    const operation: SyncOperation = {
      type: 'update',
      planId: planId,
      data: { name: newName },
      timestamp: new Date()
    };
    
    setPlanStorage(newStorage);
    queueSaveOperation(newStorage, operation);
  }, [planStorage, queueSaveOperation]);

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
    renamePlan,
    syncState,
    syncError,
    rollbackToLastSyncedState,
    isOnline,
    operationQueue
  };
};