import { Editor } from "@tiptap/react";
import { Plan } from "@/types/plan";

// Type for TipTap editor instance
export type TipTapEditor = Editor;

// Basic interfaces
export interface Position {
  x: number;
  y: number;
}

export interface NotePadProps {
  className?: string;
  onError?: (error: Error) => void;
  width?: number;
  currentPlan?: Plan | null;
  onUpdatePlan?: (updates: Partial<Pick<Plan, "notepadData">>) => void;
}

// Storage related interfaces
export interface StorageConfig {
  contentKey: string;
  titleKey: string;
  widthKey: string;
}

export interface NotePadState {
  isExpanded: boolean;
  isLoading: boolean;
  hasAnimated: boolean;
  title: string;
  width: number;
  isResizing: boolean;
}

// Editor related interfaces
export interface EditorConfig {
  placeholder: string;
  minHeight: number;
  className: string;
}

export interface TextSelectionState {
  showSelectionMenu: boolean;
  menuPosition: Position;
}

// Menu related interfaces
export interface MenuButtonProps {
  isActive?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
  disabled?: boolean;
}

export interface TextSelectionMenuProps {
  editor: Editor;
  className?: string;
}

// Hook interfaces
export interface UseNotePadStorageOptions {
  contentKey: string;
  titleKey: string;
  widthKey: string;
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
}

export interface UseResizableOptions {
  initialWidth: number;
  minWidth: number;
  maxWidth: number;
  onWidthChange: (width: number) => void;
}

export interface UseTextSelectionOptions {
  editor: Editor | null;
  containerRef: React.RefObject<HTMLElement>;
}

// Error types
export interface NotePadError extends Error {
  code: "STORAGE_ERROR" | "EDITOR_ERROR" | "RENDER_ERROR";
  details?: Record<string, unknown>;
}

// Event handler types
export type NotePadEventHandler<T = void> = (event: React.SyntheticEvent) => T;
export type EditorEventHandler = (editor: Editor) => void;
export type ResizeEventHandler = (e: React.MouseEvent) => void;
