import { useState, useCallback, useEffect, useRef } from "react";
import { Editor } from "@tiptap/react";

interface Position {
  x: number;
  y: number;
}

interface UseTextSelectionProps {
  editor: Editor | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
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
}: UseTextSelectionProps): UseTextSelectionReturn {
  const [showSelectionMenu, setShowSelectionMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<Position>({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculateMenuPosition = useCallback(
    (editor: Editor, container: HTMLDivElement | null): Position => {
      if (!container) return { x: 0, y: 0 };
      const { selection } = editor.state;
      const { from, to } = selection;

      const start = editor.view.coordsAtPos(from);
      const end = editor.view.coordsAtPos(to);
      const containerRect = container.getBoundingClientRect();

      const menuWidth = 200;
      const menuHeight = 40;
      const gap = 20;

      // Account for scroll position within the container
      let x = (start.left + end.left) / 2 - containerRect.left;
      let y =
        start.top - containerRect.top - menuHeight - gap + container.scrollTop;

      // Horizontal bounds checking
      const containerWidth = containerRect.width;
      const halfMenuWidth = menuWidth / 2;

      if (x - halfMenuWidth < 0) {
        x = halfMenuWidth;
      } else if (x + halfMenuWidth > containerWidth) {
        x = containerWidth - halfMenuWidth;
      }

      // Vertical bounds checking - position below if would go above container
      // Also account for scroll position in vertical bounds checking
      if (y < container.scrollTop) {
        y = end.top - containerRect.top + gap + 10 + container.scrollTop;
      }

      return { x, y };
    },
    []
  );

  const handleSelectionUpdate = useCallback(
    (editor: Editor) => {
      if (!containerRef.current) return;

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
    if (!editor || !showSelectionMenu) return;

    const { selection } = editor.state;
    const { empty } = selection;

    if (!empty) {
      // Active states will update naturally through React's re-rendering
      // No need to force remount with setMenuUpdateKey
    }
  }, [editor, showSelectionMenu]);

  const handleMouseUp = useCallback(
    (editor: Editor) => {
      if (!containerRef.current) return;

      const { selection } = editor.state;
      const { empty } = selection;

      // Only show menu if there's a non-empty selection after mouseup
      if (!empty) {
        const position = calculateMenuPosition(editor, containerRef.current);
        setMenuPosition(position);
        setShowSelectionMenu(true);
      }
    },
    [containerRef, calculateMenuPosition]
  );

  // Handle clicks outside to hide menu
  useEffect(() => {
    if (!showSelectionMenu) return;
    
    const currentContainer = containerRef.current; // Capture current value
    const handleClickOutside = (event: MouseEvent) => {
      if (currentContainer && !currentContainer.contains(event.target as Node)) {
        setShowSelectionMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSelectionMenu]); // Remove containerRef from dependencies to prevent unnecessary re-runs

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
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
