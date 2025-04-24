// Simple storage module for temporary file handling
import { tmpdir } from 'os';
import { join } from 'path';

// Export storage path for temp files
export const tempDir = tmpdir();
export const storagePath = join(tempDir, 'nutriscan-uploads');

// Simple in-memory storage as alternative
export const storage = {
  // In-memory map for temporary storage
  items: new Map<string, any>(),

  // Store an item
  set(key: string, value: any): void {
    this.items.set(key, value);
  },

  // Get an item
  get(key: string): any {
    return this.items.get(key);
  },

  // Check if an item exists
  has(key: string): boolean {
    return this.items.has(key);
  },

  // Remove an item
  delete(key: string): boolean {
    return this.items.delete(key);
  },

  // Clear all items
  clear(): void {
    this.items.clear();
  }
};