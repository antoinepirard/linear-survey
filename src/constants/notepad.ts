// NotePad component constants
export const NOTEPAD_CONSTANTS = {
  // Storage keys
  STORAGE_KEY: 'teamplan-notes',
  TITLE_STORAGE_KEY: 'teamplan-notes-title',
  WIDTH_STORAGE_KEY: 'teamplan-notes-width',
  
  // Dimensions
  MIN_WIDTH: 300,
  MAX_WIDTH: 800,
  DEFAULT_WIDTH: typeof window !== 'undefined' ? Math.max(300, Math.min(800, Math.round(window.innerWidth * 0.35))) : 400,
  
  // Menu positioning
  MENU_WIDTH: 200,
  MENU_HEIGHT: 40,
  MENU_GAP: 20,
  
  // Debounce delays
  CONTENT_SAVE_DELAY: 500,
  SELECTION_HIDE_DELAY: 50,
  
  // Editor configuration
  MIN_EDITOR_HEIGHT: 400,
  PLACEHOLDER_TEXT: 'Start thinking, keep writing...',
  TITLE_PLACEHOLDER: 'Enter note title...',
  
  // Validation
  DOCUMENT_TITLE_MAX_LENGTH: 100,
  
  // Animation durations
  SPRING_CONFIG: {
    stiffness: 300,
    damping: 30,
  },
  COLLAPSE_SPRING_CONFIG: {
    stiffness: 250,
    damping: 28,
  },
  OPACITY_DURATION: 0.3,
  MENU_ANIMATION_DURATION: 0.15,
} as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  BOLD: 'mod+b',
  ITALIC: 'mod+i',
  STRIKETHROUGH: 'mod+shift+s',
  HEADING_1: 'mod+alt+1',
  HEADING_2: 'mod+alt+2',
  HEADING_3: 'mod+alt+3',
  BULLET_LIST: 'mod+shift+8',
  ORDERED_LIST: 'mod+shift+7',
} as const;