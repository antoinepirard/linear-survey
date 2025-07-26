import { useState, useEffect, useCallback, useRef } from "react";
import { useDebounce } from "./useDebounce";
import { Plan } from "@/types/plan";

interface UsePlanNotePadStorageProps {
  currentPlan: Plan | null;
  onUpdatePlan?: (updates: Partial<Pick<Plan, "notepadData">>) => void;
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
}

interface SaveContentOptions {
  onSaveComplete?: () => void;
  onSaveError?: (error: Error) => void;
}

interface UsePlanNotePadStorageReturn {
  title: string;
  width: number;
  isLoading: boolean;
  setTitle: (title: string) => void;
  setWidth: (width: number) => void;
  loadContent: () => string | null;
  saveContent: (content: string, options?: SaveContentOptions) => void;
}

export function usePlanNotePadStorage({
  currentPlan,
  onUpdatePlan,
  defaultWidth,
  minWidth,
  maxWidth,
}: UsePlanNotePadStorageProps): UsePlanNotePadStorageReturn {
  const [title, setTitle] = useState("");
  const [width, setWidth] = useState(defaultWidth);
  const [isLoading, setIsLoading] = useState(false);

  // Use a single pending updates object to batch all changes
  const [pendingUpdates, setPendingUpdates] = useState<{
    content?: string;
    title?: string;
    width?: number;
  }>({});

  // Store save callbacks for content saves
  const saveCallbacksRef = useRef<Map<string, SaveContentOptions>>(new Map());

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

  // Debounce all updates together to prevent race conditions
  const debouncedUpdates = useDebounce(pendingUpdates, 500);

  // Initialize from current plan - only when plan ID changes
  useEffect(() => {
    const currentPlanId = currentPlan?.id || null;

    // Only initialize if the plan ID has changed
    if (lastInitializedPlanId.current !== currentPlanId) {
      lastInitializedPlanId.current = currentPlanId;

      if (currentPlan) {
        setTitle(currentPlan.notepadData.title);
        setWidth(
          Math.max(minWidth, Math.min(maxWidth, currentPlan.notepadData.width))
        );
        setIsLoading(false);
      } else {
        setTitle("");
        setWidth(defaultWidth);
        setIsLoading(false);
      }
    }
  }, [currentPlan?.id, minWidth, maxWidth, defaultWidth, currentPlan]);

  // Single effect that batches all updates atomically with error handling
  useEffect(() => {
    const currentPlan = currentPlanRef.current;
    const onUpdatePlan = onUpdatePlanRef.current;

    if (
      Object.keys(debouncedUpdates).length > 0 &&
      currentPlan &&
      onUpdatePlan
    ) {
      // Validate that we're still on the same plan to prevent race conditions
      const currentPlanId = currentPlan.id;
      if (currentPlanId !== lastInitializedPlanId.current) {
        console.warn('Plan changed during save operation, discarding updates for old plan');
        setPendingUpdates({});
        return;
      }
      // Check if any updates are actually different from current plan
      const hasChanges =
        (debouncedUpdates.content !== undefined &&
          currentPlan.notepadData.content !== debouncedUpdates.content) ||
        (debouncedUpdates.title !== undefined &&
          currentPlan.notepadData.title !== debouncedUpdates.title) ||
        (debouncedUpdates.width !== undefined &&
          currentPlan.notepadData.width !== debouncedUpdates.width);

      if (hasChanges) {
        // Build the updated notepad data by applying all pending changes atomically
        const updatedNotepadData = {
          ...currentPlan.notepadData,
          ...(debouncedUpdates.content !== undefined && {
            content: debouncedUpdates.content,
          }),
          ...(debouncedUpdates.title !== undefined && {
            title: debouncedUpdates.title,
          }),
          ...(debouncedUpdates.width !== undefined && {
            width: debouncedUpdates.width,
          }),
        };

        try {
          onUpdatePlan({ notepadData: updatedNotepadData });
          
          // Call success callbacks for content saves
          if (debouncedUpdates.content !== undefined) {
            const callback = saveCallbacksRef.current.get(debouncedUpdates.content);
            if (callback?.onSaveComplete) {
              callback.onSaveComplete();
            }
            saveCallbacksRef.current.delete(debouncedUpdates.content);
          }
          
          // Clear the pending updates after successful save
          setPendingUpdates({});
        } catch (error) {
          console.error("Failed to save notepad updates to plan:", error);
          
          // Call error callbacks for content saves
          if (debouncedUpdates.content !== undefined) {
            const callback = saveCallbacksRef.current.get(debouncedUpdates.content);
            if (callback?.onSaveError) {
              callback.onSaveError(error as Error);
            }
            saveCallbacksRef.current.delete(debouncedUpdates.content);
          }

          // Fallback: save to localStorage as backup
          try {
            const backupKey = `plan-${currentPlan.id}-notepad-backup`;
            const backupData = {
              timestamp: Date.now(),
              updates: debouncedUpdates,
              fullData: updatedNotepadData,
            };
            localStorage.setItem(backupKey, JSON.stringify(backupData));
            console.log("Notepad data saved to localStorage backup");
          } catch (storageError) {
            console.error(
              "Failed to save backup to localStorage:",
              storageError
            );
            // Could emit an error event here for user notification
          }

          // Don't clear pending updates on error - keep them for potential retry
          // setPendingUpdates({});
        }
      }
    }
  }, [debouncedUpdates]);

  const handleSetTitle = useCallback((newTitle: string) => {
    setTitle(newTitle);
    setPendingUpdates((prev) => ({ ...prev, title: newTitle }));
  }, []);

  const handleSetWidth = useCallback(
    (newWidth: number) => {
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      setWidth(clampedWidth);

      // Width changes should be immediate for resize feedback
      const currentPlan = currentPlanRef.current;
      const onUpdatePlan = onUpdatePlanRef.current;

      if (
        currentPlan &&
        onUpdatePlan &&
        currentPlan.notepadData.width !== clampedWidth
      ) {
        try {
          onUpdatePlan({
            notepadData: {
              ...currentPlan.notepadData,
              width: clampedWidth,
            },
          });
        } catch (error) {
          console.error("Failed to save width update:", error);
          // Fallback: add to pending updates for retry
          setPendingUpdates((prev) => ({ ...prev, width: clampedWidth }));
        }
      }
    },
    [minWidth, maxWidth]
  );

  const loadContent = useCallback((): string | null => {
    if (!currentPlan) return null;

    // First try to load from the plan
    let content = currentPlan.notepadData.content;

    // If no content in plan, check for backup in localStorage
    if (!content) {
      try {
        const backupKey = `plan-${currentPlan.id}-notepad-backup`;
        const backupData = localStorage.getItem(backupKey);
        if (backupData) {
          const backup = JSON.parse(backupData);
          content = backup.fullData?.content || backup.updates?.content;
          if (content) {
            console.log("Loaded notepad content from localStorage backup");
          }
        }
      } catch (error) {
        console.error("Failed to load backup from localStorage:", error);
      }
    }

    return content || null;
  }, [currentPlan?.id, currentPlan?.notepadData.content]); // Memoize based on plan ID and content

  const saveContent = useCallback((content: string, options?: SaveContentOptions) => {
    // Store callbacks if provided
    if (options) {
      saveCallbacksRef.current.set(content, options);
    }
    
    setPendingUpdates((prev) => ({ ...prev, content }));
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
