import { DatabaseAdapter } from "./types";
import { localStorageAdapter } from "./localStorage";
import { supabaseAdapter } from "./supabase";
import { postgresAdapter } from "./postgres";
import { sqliteAdapter } from "./sqlite";

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

/**
 * Get the database adapter instance based on configuration
 */
export function getAdapter(): DatabaseAdapter {
  const type = getAdapterType();

  switch (type) {
    case "supabase":
      return supabaseAdapter;
    case "postgres":
      return postgresAdapter;
    case "sqlite":
      return sqliteAdapter;
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
      isConfigured: postgresAdapter.isConfigured,
      isActive: activeType === "postgres",
    },
    {
      type: "sqlite",
      name: "SQLite",
      isConfigured: sqliteAdapter.isConfigured,
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
export { localStorageAdapter, supabaseAdapter, postgresAdapter, sqliteAdapter };

// Default export is the active adapter
const db = getAdapter();
export default db;

