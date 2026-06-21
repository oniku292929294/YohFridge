import { pgTable, serial, text, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const dailyConfigTable = pgTable("daily_config", {
  id: serial("id").primaryKey(),
  dismissal_time: text("dismissal_time"),
  has_lunchbox: boolean("has_lunchbox").notNull().default(false),
  has_star: boolean("has_star").notNull().default(false),
  has_dog: boolean("has_dog").notNull().default(false),
  has_spiral: boolean("has_spiral").notNull().default(false),
});

export const insertDailyConfigSchema = createInsertSchema(dailyConfigTable).omit({ id: true });
export type InsertDailyConfig = z.infer<typeof insertDailyConfigSchema>;
export type DailyConfig = typeof dailyConfigTable.$inferSelect;
