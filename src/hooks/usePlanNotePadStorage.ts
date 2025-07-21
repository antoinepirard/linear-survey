import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { Plan } from '@/types/plan';

interface UsePlanNotePadStorageProps {
  currentPlan: Plan | null;
  onUpdatePlan?: (updates: Partial<Pick<Plan, 'notepadData'>>) => void;
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
}

interface UsePlanNotePadStorageReturn {
  title: string;
  width: number;
  isLoading: boolean;
  setTitle: (title: string) => void;
  setWidth: (width: number) => void;
  loadContent: () => string | null;
  saveContent: (content: string) => void;
}

export function usePlanNotePadStorage({
  currentPlan,
  onUpdatePlan,
  defaultWidth,
  minWidth,
  maxWidth,
}: UsePlanNotePadStorageProps): UsePlanNotePadStorageReturn {
  const [title, setTitle] = useState('');
  const [width, setWidth] = useState(defaultWidth);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingContent, setPendingContent] = useState<string | null>(null);
  const [pendingTitle, setPendingTitle] = useState<string | null>(null);
  const [pendingWidth, setPendingWidth] = useState<number | null>(null);
  
  // Track the last initialized plan ID to prevent re-initialization
  const lastInitializedPlanId = useRef<string | null>(null);
  
  // Store current plan and callback in refs to avoid dependency issues
  const currentPlanRef = useRef(currentPlan);
  const onUpdatePlanRef = useRef(onUpdatePlan);
  
  // Update refs when props change
  useEffect(() => {
    currentPlanRef.current = currentPlan;
    onUpdatePlanRef.current = onUpdatePlan;
  });

  // Debounce saves to prevent excessive updates
  const debouncedContent = useDebounce(pendingContent, 500);
  const debouncedTitle = useDebounce(pendingTitle, 500);
  const debouncedWidth = useDebounce(pendingWidth, 300);

  // Initialize from current plan - only when plan ID changes
  useEffect(() => {
    const currentPlanId = currentPlan?.id || null;
    
    // Only initialize if the plan ID has changed
    if (lastInitializedPlanId.current !== currentPlanId) {
      lastInitializedPlanId.current = currentPlanId;
      
      if (currentPlan) {
        setTitle(currentPlan.notepadData.title);
        setWidth(Math.max(minWidth, Math.min(maxWidth, currentPlan.notepadData.width)));
        setIsLoading(false);
      } else {
        setTitle('');
        setWidth(defaultWidth);
        setIsLoading(false);
      }
    }
  }, [currentPlan?.id, minWidth, maxWidth, defaultWidth, currentPlan]);

  // Save debounced content - only save if it's actually different from current plan
  useEffect(() => {
    const currentPlan = currentPlanRef.current;
    const onUpdatePlan = onUpdatePlanRef.current;
    
    if (debouncedContent !== null && currentPlan && onUpdatePlan && currentPlan.notepadData.content !== debouncedContent) {
      onUpdatePlan({
        notepadData: {
          ...currentPlan.notepadData,
          content: debouncedContent
        }
      });
    }
  }, [debouncedContent]);

  // Save debounced title - only save if it's actually different from current plan
  useEffect(() => {
    const currentPlan = currentPlanRef.current;
    const onUpdatePlan = onUpdatePlanRef.current;
    
    if (debouncedTitle !== null && currentPlan && onUpdatePlan && currentPlan.notepadData.title !== debouncedTitle) {
      onUpdatePlan({
        notepadData: {
          ...currentPlan.notepadData,
          title: debouncedTitle
        }
      });
    }
  }, [debouncedTitle]);

  // Save debounced width - only save if it's actually different from current plan
  useEffect(() => {
    const currentPlan = currentPlanRef.current;
    const onUpdatePlan = onUpdatePlanRef.current;
    
    if (debouncedWidth !== null && currentPlan && onUpdatePlan && currentPlan.notepadData.width !== debouncedWidth) {
      onUpdatePlan({
        notepadData: {
          ...currentPlan.notepadData,
          width: debouncedWidth
        }
      });
    }
  }, [debouncedWidth]);

  const handleSetTitle = useCallback((newTitle: string) => {
    setTitle(newTitle);
    setPendingTitle(newTitle);
  }, []);

  const handleSetWidth = useCallback((newWidth: number) => {
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    setWidth(clampedWidth);
    setPendingWidth(clampedWidth);
  }, [minWidth, maxWidth]);

  const loadContent = useCallback((): string | null => {
    return currentPlan?.notepadData.content || null;
  }, [currentPlan]);

  const saveContent = useCallback((content: string) => {
    setPendingContent(content);
  }, []);

  return {
    title,
    width,
    isLoading,
    setTitle: handleSetTitle,
    setWidth: handleSetWidth,
    loadContent,
    saveContent,
  };
}