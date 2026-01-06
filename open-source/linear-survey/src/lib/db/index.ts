import { DatabaseAdapter } from "./types";
import { localStorageAdapter } from "./localStorage";
import { supabaseAdapter } from "./supabase";

export * from "./types";

/**
 * Supported database adapter types
 */
export type AdapterType = "supabase" | "postgres" | "sqlite" | "local";

/**
 * Get the configured adapter type from environment
 */
export function getAdapterType(): AdapterType {
  const explicit = process.env.NEXT_PUBLIC_DATABASE_ADAPTER as AdapterType | undefined;
  
  if (explicit) {
    return explicit;
  }

  // Auto-detect based on available environment variables
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return "supabase";
  }

  if (process.env.DATABASE_URL) {
    return "postgres";
  }

  if (process.env.SQLITE_PATH) {
    return "sqlite";
  }

  // Default to localStorage for demo/development
  return "local";
}

// Lazy-loaded adapters (only loaded when actually used)
let postgresAdapter: DatabaseAdapter | null = null;
let sqliteAdapter: DatabaseAdapter | null = null;

/**
 * Get the database adapter instance based on configuration
 */
export function getAdapter(): DatabaseAdapter {
  const type = getAdapterType();

  switch (type) {
    case "supabase":
      return supabaseAdapter;
      
    case "postgres":
      // Lazy load postgres adapter only when needed
      if (!postgresAdapter) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { PostgresAdapter } = require("./postgres");
        postgresAdapter = new PostgresAdapter();
      }
      return postgresAdapter!;
      
    case "sqlite":
      // Lazy load sqlite adapter only when needed
      if (!sqliteAdapter) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { SQLiteAdapter } = require("./sqlite");
        sqliteAdapter = new SQLiteAdapter();
      }
      return sqliteAdapter!;
      
    case "local":
    default:
      return localStorageAdapter;
  }
}

/**
 * Get information about all available adapters
 */
export function getAvailableAdapters(): Array<{
  type: AdapterType;
  name: string;
  isConfigured: boolean;
  isActive: boolean;
}> {
  const activeType = getAdapterType();
  
  return [
    {
      type: "supabase",
      name: "Supabase",
      isConfigured: supabaseAdapter.isConfigured,
      isActive: activeType === "supabase",
    },
    {
      type: "postgres",
      name: "PostgreSQL",
      isConfigured: !!process.env.DATABASE_URL,
      isActive: activeType === "postgres",
    },
    {
      type: "sqlite",
      name: "SQLite",
      isConfigured: !!process.env.SQLITE_PATH,
      isActive: activeType === "sqlite",
    },
    {
      type: "local",
      name: "Local Storage",
      isConfigured: true,
      isActive: activeType === "local",
    },
  ];
}

// Export individual adapters for direct access if needed
export { localStorageAdapter, supabaseAdapter };

// Default export is the active adapter
const db = getAdapter();
export default db;
