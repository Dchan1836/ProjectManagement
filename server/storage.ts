import { tasks, type Task, type InsertTask, type Metrics } from "@shared/schema";

export interface IStorage {
  getTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  getMetrics(): Promise<Metrics>;
}

export class MemStorage implements IStorage {
  private tasks: Task[];
  private idCounter: number;

  constructor() {
    this.tasks = [
      {
        id: 1,
        taskName: "Project Initiation",
        startDate: new Date("2024-04-01"),
        endDate: new Date("2024-04-21"),
        duration: 20,
        progress: 100,
        status: "Close",
        priority: "High",
        parentId: null
      },
      {
        id: 2,
        taskName: "Identify Site Location",
        startDate: new Date("2024-04-01"),
        endDate: new Date("2024-04-05"),
        duration: 4,
        progress: 100,
        status: "Close",
        priority: "Normal",
        parentId: 1
      },
      {
        id: 3,
        taskName: "Perform Soil Test",
        startDate: new Date("2024-04-05"),
        endDate: new Date("2024-04-10"),
        duration: 5,
        progress: 100,
        status: "Close",
        priority: "Critical",
        parentId: 1
      },
      {
        id: 4,
        taskName: "Project Estimation",
        startDate: new Date("2024-04-10"),
        endDate: new Date("2024-04-21"),
        duration: 11,
        progress: 60,
        status: "In Progress",
        priority: "High",
        parentId: 1
      },
      {
        id: 5,
        taskName: "Development Phase",
        startDate: new Date("2024-04-22"),
        endDate: new Date("2024-05-31"),
        duration: 40,
        progress: 40,
        status: "In Progress",
        priority: "Normal",
        parentId: null
      },
      {
        id: 6,
        taskName: "Frontend Setup",
        startDate: new Date("2024-04-22"),
        endDate: new Date("2024-05-05"),
        duration: 14,
        progress: 80,
        status: "In Progress",
        priority: "Normal",
        parentId: 5
      },
      {
        id: 7,
        taskName: "Backend Setup",
        startDate: new Date("2024-04-22"),
        endDate: new Date("2024-05-10"),
        duration: 18,
        progress: 60,
        status: "In Progress",
        priority: "Critical",
        parentId: 5
      },
      {
        id: 8,
        taskName: "API Integration",
        startDate: new Date("2024-05-11"),
        endDate: new Date("2024-05-20"),
        duration: 10,
        progress: 0,
        status: "Open",
        priority: "High",
        parentId: 5
      },
      {
        id: 9,
        taskName: "Testing Phase",
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-06-15"),
        duration: 15,
        progress: 0,
        status: "Open",
        priority: "Normal",
        parentId: null
      },
       {
        id: 10,
        taskName: "Unit Testing",
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-06-07"),
        duration: 7,
        progress: 0,
        status: "Testing",
        priority: "Normal",
        parentId: 9
      }
    ];
    this.idCounter = 11;
  }

  async getTasks(): Promise<Task[]> {
    return this.tasks;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const task: Task = { ...insertTask, id: this.idCounter++ };
    this.tasks.push(task);
    return task;
  }

  async getMetrics(): Promise<Metrics> {
    const totalProjects = this.tasks.filter(t => t.parentId === null).length;
    const completedTasks = this.tasks.filter(t => t.progress === 100).length;
    const inProgressTasks = this.tasks.filter(t => t.status === "In Progress").length;
    const criticalTasks = this.tasks.filter(t => t.priority === "Critical" && t.status !== "Close").length;

    return {
      totalProjects,
      completedTasks,
      inProgressTasks,
      criticalTasks
    };
  }
}

export const storage = new MemStorage();
