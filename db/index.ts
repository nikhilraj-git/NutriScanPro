import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "@shared/schema";

// Create a mock client for Drizzle that will always throw errors
// This will force our code to fall back to the local data
const mockClient = {
  query: async () => {
    throw new Error('Database not available');
  },
  release: () => {},
  end: async () => {},
  on: () => {}
};

// Log that we're using fallback mode
console.log('Running in fallback mode without database connection');
console.log('All data will be sourced from local fallback data');

// Export mock pool and db that will trigger the fallback code paths
export const pool = mockClient as unknown as Pool;
export const db = {
  query: {
    ingredients: {
      findFirst: async () => { throw new Error('Database not available'); },
      findMany: async () => { throw new Error('Database not available'); }
    }
  },
  insert: () => { throw new Error('Database not available'); },
  delete: () => { throw new Error('Database not available'); },
  update: () => { throw new Error('Database not available'); }
} as unknown as ReturnType<typeof drizzle>;