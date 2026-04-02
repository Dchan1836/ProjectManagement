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
  predecessor: text("predecessor"), // Task dependencies (e.g., "2FS", "3SS+1")
  wbs: text("wbs"), // Work Breakdown Structure
  assignee: text("assignee"), // Task assignee
  info: text("info"), // Task info
  role: text("role").array(), // Role types (e.g., ["Developer", "Construction"])
});

export const insertTaskSchema = createInsertSchema(tasks, {
  startDate: z.preprocess((val) => {
    if (typeof val === 'string') return new Date(val);
    return val;
  }, z.date()),
  endDate: z.preprocess((val) => {
    if (typeof val === 'string') return new Date(val);
    return val;
  }, z.date()),
}).omit({ id: true });

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export class TaskBuilder implements Task {
  id: number = 0;
  taskName: string = "";
  startDate: Date = new Date();
  endDate: Date = new Date();
  duration: number | null = 0;
  progress: number = 0;
  status: string = "Open";
  priority: string | null = "Normal";
  parentId: number | null = null;
  predecessor: string | null = null;
  wbs: string | null = null;
  assignee: string | null = null;
  info: string | null = null;
  role: string[] | null = [];
}

export const defaultTask = new TaskBuilder();

// Dashboard Metrics Type
export const metricsSchema = z.object({
  totalProjects: z.number(),
  completedTasks: z.number(),
  inProgressTasks: z.number(),
  criticalTasks: z.number(),
});

export type Metrics = z.infer<typeof metricsSchema>;
