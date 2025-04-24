import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Ingredients table to store information about ingredients and their health impacts
export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  impact: text("impact").notNull(),
  category: text("category").notNull(), // 'safe', 'caution', or 'danger'
  description: text("description"),
});

export const ingredientsRelations = relations(ingredients, ({ many }) => ({}));

export const insertIngredientSchema = createInsertSchema(ingredients, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  impact: (schema) => schema.min(2, "Impact must be at least 2 characters"),
  category: (schema) => schema.refine(val => ['safe', 'caution', 'danger'].includes(val), {
    message: "Category must be 'safe', 'caution', or 'danger'"
  }),
});

export type InsertIngredient = z.infer<typeof insertIngredientSchema>;
export type Ingredient = typeof ingredients.$inferSelect;

// Types for the analysis results
export const analysisResultSchema = z.object({
  foundIngredients: z.array(z.object({
    name: z.string(),
    impact: z.string(),
    category: z.string(),
    description: z.string().optional(),
  })),
  unknownIngredients: z.array(z.string()),
  safePercent: z.number(),
  cautionPercent: z.number(),
  dangerPercent: z.number(),
  productName: z.string().optional(),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;
