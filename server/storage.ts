import { tasks, type Task, type InsertTask, type Metrics } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  getMetrics(): Promise<Metrics>;
}

export class DatabaseStorage implements IStorage {
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(insertTask).returning();
    return task;
  }

  async updateTask(id: number, partialTask: Partial<InsertTask>): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set(partialTask)
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id)).returning();
    return result.length > 0;
  }

  async getMetrics(): Promise<Metrics> {
    const allTasks = await this.getTasks();
    const totalProjects = allTasks.filter(t => t.parentId === null).length;
    const completedTasks = allTasks.filter(t => t.progress === 100).length;
    const inProgressTasks = allTasks.filter(t => t.status === "In Progress").length;
    const criticalTasks = allTasks.filter(t => t.priority === "Critical" && t.status !== "Close").length;

    return {
      totalProjects,
      completedTasks,
      inProgressTasks,
      criticalTasks
    };
  }
}

export const storage = new DatabaseStorage();
