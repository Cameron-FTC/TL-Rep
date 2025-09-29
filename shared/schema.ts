import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // "lesson" or "problem"
  scenario: text("scenario").notNull(),
  lessonValue: text("lesson_value"),
  problemType: text("problem_type"), // time, money, resources, etc.
  hasIdea: boolean("has_idea").notNull(),
  ideaDescription: text("idea_description"),
  audioFiles: jsonb("audio_files").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
});

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;
