import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// This is the correct way neon config - DO NOT change this
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a pool with error handling
let dbPool: Pool;
try {
  // Try to connect to the database using the provided URL
  dbPool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    // Add a short connection timeout to fail faster in case of connection issues
    connectionTimeoutMillis: 5000 
  });
  
  // Add event listener for connection errors
  dbPool.on('error', (err) => {
    console.error('Unexpected database error:', err);
    console.warn('Database connection error. The application will use hardcoded fallback data instead.');
  });
} catch (error) {
  console.error('Failed to create database pool:', error);
  console.warn('Database connection failed. The application will use hardcoded fallback data instead.');
  
  // Create a dummy pool that will trigger errors, forcing the use of fallback data
  dbPool = {} as Pool;
}

// Create Drizzle ORM instance with error handling
export const pool = dbPool;
export const db = drizzle({ client: dbPool, schema });