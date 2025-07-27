import { useState, useCallback, useEffect, useRef } from "react";
import { Editor } from "@tiptap/react";

interface Position {
  x: number;
  y: number;
}

interface UseTextSelectionProps {
  editor: Editor | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isFullScreen?: boolean;
}

interface UseTextSelectionReturn {
  showSelectionMenu: boolean;
  menuPosition: Position;
  setShowSelectionMenu: (show: boolean) => void;
  handleSelectionUpdate: (editor: Editor) => void;
  handleTransaction: () => void;
  handleMouseUp: (editor: Editor) => void;
}

export function useTextSelection({
  editor,
  containerRef,
  isFullScreen = false,
}: UseTextSelectionProps): UseTextSelectionReturn {
  const [showSelectionMenu, setShowSelectionMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<Position>({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculateMenuPosition = useCallback(
    (editor: Editor, container: HTMLDivElement | null): Position => {
      if (!container || !editor?.view || editor.isDestroyed)
        return { x: 0, y: 0 };

      const { selection } = editor.state;
      const { from, to } = selection;

      try {
        const start = editor.view.coordsAtPos(from);
        const end = editor.view.coordsAtPos(to);
        
        // In full-screen mode, look for the centered content wrapper
        let referenceRect: DOMRect;
        let referenceElement: HTMLElement;
        
        if (isFullScreen) {
          // Find the centered content wrapper (max-w-4xl element)
          const contentWrapper = container.querySelector('.max-w-4xl') as HTMLElement;
          if (contentWrapper) {
            referenceRect = contentWrapper.getBoundingClientRect();
            referenceElement = contentWrapper;
          } else {
            // Fallback to container if content wrapper not found
            referenceRect = container.getBoundingClientRect();
            referenceElement = container;
          }
        } else {
          // Use container for sidebar mode
          referenceRect = container.getBoundingClientRect();
          referenceElement = container;
        }

        const menuWidth = 200;
        const menuHeight = 40;
        const gap = 20;

        // Calculate position relative to the reference element
        let x = (start.left + end.left) / 2 - referenceRect.left;
        let y =
          start.top -
          referenceRect.top -
          menuHeight -
          gap +
          referenceElement.scrollTop;

        // Horizontal bounds checking against reference element width
        const referenceWidth = referenceRect.width;
        const halfMenuWidth = menuWidth / 2;

        if (x - halfMenuWidth < 0) {
          x = halfMenuWidth;
        } else if (x + halfMenuWidth > referenceWidth) {
          x = referenceWidth - halfMenuWidth;
        }

        // Vertical bounds checking - position below if would go above reference element
        // Also account for scroll position in vertical bounds checking
        if (y < referenceElement.scrollTop) {
          y = end.top - referenceRect.top + gap + 10 + referenceElement.scrollTop;
        }

        return { x, y };
      } catch (error) {
        console.warn("Failed to calculate menu position:", error);
        return { x: 0, y: 0 };
      }
    },
    [isFullScreen]
  );

  const handleSelectionUpdate = useCallback(
    (editor: Editor) => {
      if (!containerRef.current || !editor?.state || editor.isDestroyed) return;

      const { selection } = editor.state;
      const { empty } = selection;

      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Only hide menu if selection becomes empty, don't show it here
      if (empty) {
        // Add small delay to prevent flickering when selection changes quickly
        timeoutRef.current = setTimeout(() => {
          setShowSelectionMenu(false);
        }, 50);
      }
    },
    [containerRef]
  );

  const handleTransaction = useCallback(() => {
    if (!editor || !showSelectionMenu || !editor?.state || editor.isDestroyed)
      return;

    const { selection } = editor.state;
    const { empty } = selection;

    if (!empty) {
      // Active states will update naturally through React's re-rendering
      // No need to force remount with setMenuUpdateKey
    }
  }, [editor, showSelectionMenu]);

  const handleMouseUp = useCallback(
    (editor: Editor) => {
      console.log("🔍 handleMouseUp called", {
        hasContainer: !!containerRef.current,
        hasEditor: !!editor,
        isDestroyed: editor?.isDestroyed,
      });

      if (!containerRef.current || !editor?.state || editor.isDestroyed) return;

      const { selection } = editor.state;
      const { empty } = selection;

      console.log("🔍 Selection state:", {
        empty,
        from: selection.from,
        to: selection.to,
        text: selection.empty
          ? ""
          : editor.state.doc.textBetween(selection.from, selection.to),
      });

      // Only show menu if there's a non-empty selection after mouseup
      if (!empty) {
        const position = calculateMenuPosition(editor, containerRef.current);
        console.log("🔍 Setting menu position:", position);
        setMenuPosition(position);
        setShowSelectionMenu(true);
        console.log("🔍 Menu should now be visible");
      }
    },
    [containerRef, calculateMenuPosition]
  );

  // Handle clicks outside to hide menu
  useEffect(() => {
    if (!showSelectionMenu) return;

    const currentContainer = containerRef.current; // Capture current value
    const handleClickOutside = (event: MouseEvent) => {
      if (
        currentContainer &&
        !currentContainer.contains(event.target as Node)
      ) {
        setShowSelectionMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSelectionMenu, containerRef]); // Include containerRef dependency

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return {
    showSelectionMenu,
    menuPosition,
    setShowSelectionMenu,
    handleSelectionUpdate,
    handleTransaction,
    handleMouseUp,
  };
}
