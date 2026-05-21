import { eq, isNull, and, ne, sql } from "drizzle-orm";
import { db } from "./db";
import {
  tasks,
  type Task,
  type InsertTask,
  type Metrics,
} from "@shared/schema";

export interface IStorage {
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  getMetrics(): Promise<Metrics>;
}

const SEED_TASKS: InsertTask[] = [
  {
    taskName: "Project Initiation",
    startDate: new Date("2024-04-01"),
    endDate: new Date("2024-04-21"),
    duration: 20,
    progress: 100,
    status: "Close",
    priority: "High",
    parentId: null,
    predecessor: null,
    wbs: "1",
    assignee: "Jane Doe",
    info: "Initial project kickoff and planning",
    role: null,
  },
  {
    taskName: "Identify Site Location",
    startDate: new Date("2024-04-01"),
    endDate: new Date("2024-04-05"),
    duration: 4,
    progress: 100,
    status: "Close",
    priority: "Normal",
    parentId: 1,
    predecessor: null,
    wbs: "1.1",
    assignee: "Jane Doe",
    info: "Site selection completed",
    role: null,
  },
  {
    taskName: "Perform Soil Test",
    startDate: new Date("2024-04-05"),
    endDate: new Date("2024-04-10"),
    duration: 5,
    progress: 100,
    status: "Close",
    priority: "Critical",
    parentId: 1,
    predecessor: "2FS",
    wbs: null,
    assignee: "Alex Smith",
    info: "Soil quality is stable",
    role: null,
  },
  {
    taskName: "Project Estimation",
    startDate: new Date("2024-04-10"),
    endDate: new Date("2024-04-21"),
    duration: 11,
    progress: 60,
    status: "In Progress",
    priority: "High",
    parentId: 1,
    predecessor: "3FS",
    wbs: "1.3",
    assignee: "Jane Doe",
    info: "Budgeting in progress",
    role: null,
  },
  {
    taskName: "Development Phase",
    startDate: new Date("2024-04-22"),
    endDate: new Date("2024-05-31"),
    duration: 40,
    progress: 40,
    status: "In Progress",
    priority: "Normal",
    parentId: null,
    predecessor: "1FS",
    wbs: "2",
    assignee: "Alex Smith",
    info: "Main development cycle",
    role: null,
  },
  {
    taskName: "Frontend Setup",
    startDate: new Date("2024-04-22"),
    endDate: new Date("2024-05-05"),
    duration: 14,
    progress: 80,
    status: "In Progress",
    priority: "Normal",
    parentId: 5,
    predecessor: null,
    wbs: "2.1",
    assignee: "Alex Smith",
    info: "React and Tailwind setup",
    role: null,
  },
  {
    taskName: "Backend Setup",
    startDate: new Date("2024-04-22"),
    endDate: new Date("2024-05-10"),
    duration: 18,
    progress: 60,
    status: "In Progress",
    priority: "Critical",
    parentId: 5,
    predecessor: "6SS",
    wbs: "2.2",
    assignee: "Jane Doe",
    info: "Express and Drizzle configuration",
    role: null,
  },
  {
    taskName: "API Integration",
    startDate: new Date("2024-05-11"),
    endDate: new Date("2024-05-20"),
    duration: 10,
    progress: 0,
    status: "Open",
    priority: "High",
    parentId: 5,
    predecessor: "6FS,7FS",
    wbs: "2.3",
    assignee: "Alex Smith",
    info: "Connecting frontend to backend",
    role: null,
  },
  {
    taskName: "Testing Phase",
    startDate: new Date("2024-06-01"),
    endDate: new Date("2024-06-15"),
    duration: 15,
    progress: 0,
    status: "Open",
    priority: "Normal",
    parentId: null,
    predecessor: "5FS",
    wbs: "3",
    assignee: "Jane Doe",
    info: "QA and bug fixing",
    role: null,
  },
  {
    taskName: "Unit Testing",
    startDate: new Date("2024-06-01"),
    endDate: new Date("2024-06-07"),
    duration: 7,
    progress: 0,
    status: "Testing",
    priority: "Normal",
    parentId: 9,
    predecessor: null,
    wbs: "3.1",
    assignee: "Alex Smith",
    info: "Verifying individual modules",
    role: null,
  },
  {
    taskName: "Integration Testing",
    startDate: new Date("2024-06-08"),
    endDate: new Date("2024-06-12"),
    duration: 5,
    progress: 0,
    status: "Open",
    priority: "High",
    parentId: 9,
    predecessor: "10FS",
    wbs: "3.2",
    assignee: "Jane Doe",
    info: "End-to-end system testing",
    role: null,
  },
  {
    taskName: "User Acceptance Testing",
    startDate: new Date("2024-06-12"),
    endDate: new Date("2024-06-15"),
    duration: 4,
    progress: 0,
    status: "Open",
    priority: "Critical",
    parentId: 9,
    predecessor: "11FS",
    wbs: "3.3",
    assignee: "Alex Smith",
    info: "Client validation and sign-off",
    role: null,
  },
  {
    taskName: "Deployment Phase",
    startDate: new Date("2024-06-16"),
    endDate: new Date("2024-06-30"),
    duration: 15,
    progress: 0,
    status: "Open",
    priority: "High",
    parentId: null,
    predecessor: "9FS",
    wbs: "4",
    assignee: "Jane Doe",
    info: "Production deployment and go-live",
    role: null,
  },
  {
    taskName: "Environment Setup",
    startDate: new Date("2024-06-16"),
    endDate: new Date("2024-06-18"),
    duration: 3,
    progress: 0,
    status: "Open",
    priority: "Normal",
    parentId: 13,
    predecessor: null,
    wbs: "4.1",
    assignee: "Alex Smith",
    info: "Configure production servers",
    role: null,
  },
  {
    taskName: "Database Migration",
    startDate: new Date("2024-06-19"),
    endDate: new Date("2024-06-21"),
    duration: 3,
    progress: 0,
    status: "Open",
    priority: "Critical",
    parentId: 13,
    predecessor: "14FS",
    wbs: "4.2",
    assignee: "Jane Doe",
    info: "Migrate data to production",
    role: null,
  },
  {
    taskName: "Code Deployment",
    startDate: new Date("2024-06-22"),
    endDate: new Date("2024-07-20"),
    duration: 8,
    progress: 0,
    status: "Open",
    priority: "High",
    parentId: 13,
    predecessor: "14FS,15FS",
    wbs: "4.3",
    assignee: "Alex Smith",
    info: "Deploy application to production",
    role: null,
  },
  {
    taskName: "Go-Live Verification",
    startDate: new Date("2024-06-25"),
    endDate: new Date("2024-06-27"),
    duration: 3,
    progress: 0,
    status: "Open",
    priority: "Critical",
    parentId: 13,
    predecessor: "16FS",
    wbs: "4.4",
    assignee: "Jane Doe",
    info: "Final production validation",
    role: null,
  },
  {
    taskName: "Documentation",
    startDate: new Date("2024-06-22"),
    endDate: new Date("2024-06-30"),
    duration: 9,
    progress: 0,
    status: "Open",
    priority: "Normal",
    parentId: 13,
    predecessor: "16SS",
    wbs: "4.5",
    assignee: "Alex Smith",
    info: "Create user and technical documentation",
    role: null,
  },
];

export class DatabaseStorage implements IStorage {
  async getTasks(): Promise<Task[]> {
    return db.select().from(tasks).orderBy(tasks.id);
  }

  async getTask(id: number): Promise<Task | undefined> {
    const rows = await db.select().from(tasks).where(eq(tasks.id, id));
    return rows[0];
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const rows = await db.insert(tasks).values(insertTask).returning();
    return rows[0];
  }

  async updateTask(
    id: number,
    updates: Partial<InsertTask>,
  ): Promise<Task | undefined> {
    const currentRows = await db.select().from(tasks).where(eq(tasks.id, id));
    if (currentRows.length === 0) return undefined;

    const currentTask = currentRows[0];

    if ("parentId" in updates && updates.parentId !== currentTask.parentId) {
      const newParentId = updates.parentId ?? null;

      if (newParentId === null) {
        const topLevelRows = await db
          .select()
          .from(tasks)
          .where(and(isNull(tasks.parentId), ne(tasks.id, id)));
        updates.wbs = String(topLevelRows.length + 1);
      } else {
        const parentRows = await db
          .select()
          .from(tasks)
          .where(eq(tasks.id, newParentId));
        if (parentRows.length > 0) {
          const parent = parentRows[0];
          const parentWbs = parent.wbs ?? String(newParentId);
          const siblingRows = await db
            .select()
            .from(tasks)
            .where(
              and(eq(tasks.parentId, newParentId), ne(tasks.id, id)),
            );
          updates.wbs = `${parentWbs}.${siblingRows.length + 1}`;
        }
      }
    }

    console.log(updates);
    const rows = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
    return rows[0];
  }

  async deleteTask(id: number): Promise<boolean> {
    const rows = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning({ id: tasks.id });
    return rows.length > 0;
  }

  async getMetrics(): Promise<Metrics> {
    const allTasks = await db.select().from(tasks);
    const totalProjects = allTasks.filter((t) => t.parentId === null).length;
    const completedTasks = allTasks.filter((t) => t.progress === 100).length;
    const inProgressTasks = allTasks.filter(
      (t) => t.status === "In Progress",
    ).length;
    const criticalTasks = allTasks.filter(
      (t) => t.priority === "Critical" && t.status !== "Close",
    ).length;

    return {
      totalProjects,
      completedTasks,
      inProgressTasks,
      criticalTasks,
    };
  }
}

export async function seedIfEmpty(): Promise<void> {
  const existing = await db.select({ id: tasks.id }).from(tasks).limit(1);
  if (existing.length > 0) {
    console.log("[seed] Tasks table already has data, skipping seed.");
    return;
  }

  console.log("[seed] Seeding initial tasks...");
  for (const task of SEED_TASKS) {
    await db.insert(tasks).values(task);
  }
  console.log(`[seed] Inserted ${SEED_TASKS.length} tasks.`);
}

export const storage = new DatabaseStorage();
