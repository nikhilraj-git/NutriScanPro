import { pgTable, text, serial, integer, boolean, uuid, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table with authentication fields
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Health conditions table
export const healthConditions = pgTable("health_conditions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  condition: text("condition").notNull(),
  severity: text("severity").notNull(), // mild, moderate, severe
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Ingredients table
export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  impact: text("impact").notNull(),
  category: text("category").notNull(), // 'safe', 'caution', or 'danger'
  description: text("description"),
  // Add fields for health condition impacts
  allergenWarnings: text("allergen_warnings").array(),
  healthImpacts: text("health_impacts").array(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  healthConditions: many(healthConditions),
}));

export const healthConditionsRelations = relations(healthConditions, ({ one }) => ({
  user: one(users, {
    fields: [healthConditions.userId],
    references: [users.id],
  }),
}));

// Schemas for validation
export const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const healthConditionSchema = z.object({
  condition: z.string().min(2),
  severity: z.enum(["mild", "moderate", "severe"]),
  notes: z.string().optional(),
});

export const analysisResultSchema = z.object({
  foundIngredients: z.array(z.object({
    name: z.string(),
    impact: z.string(),
    category: z.string(),
    description: z.string().optional(),
    allergenWarnings: z.array(z.string()).optional(),
    healthImpacts: z.array(z.string()).optional(),
  })),
  unknownIngredients: z.array(z.string()),
  safePercent: z.number(),
  cautionPercent: z.number(),
  dangerPercent: z.number(),
  productName: z.string().optional(),
  ocrText: z.string().optional(),
  healthWarnings: z.array(z.string()).optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type HealthCondition = typeof healthConditions.$inferSelect;
export type InsertHealthCondition = typeof healthConditions.$inferInsert;
export type Ingredient = typeof ingredients.$inferSelect;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;