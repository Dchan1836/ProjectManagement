import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  taskName: text("task_name").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  duration: integer("duration"),
  progress: integer("progress").notNull().default(0),
  status: text("status").notNull(), // Open, In Progress, Testing, Close
  priority: text("priority").default("Normal"),
  parentId: integer("parent_id"), // For hierarchical data in Gantt
  wbs: text("wbs"), // Work Breakdown Structure
});

export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true });

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

// Dashboard Metrics Type
export const metricsSchema = z.object({
  totalProjects: z.number(),
  completedTasks: z.number(),
  inProgressTasks: z.number(),
  criticalTasks: z.number(),
});

export type Metrics = z.infer<typeof metricsSchema>;
