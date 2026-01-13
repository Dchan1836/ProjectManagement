import { tasks, type Task, type InsertTask, type Metrics } from "@shared/schema";

export interface IStorage {
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
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
        taskExtra: "Project Initiation Extra",
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
        info: "Initial project kickoff and planning"
      },
      {
        id: 2,
        taskName: "Identify Site Location",
        taskExtra: "Idenfity Site Location Extra",
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
        info: "Site selection completed"
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
        parentId: 1,
        predecessor: "2FS",
        wbs: "1.2",
        assignee: "Alex Smith",
        info: "Soil quality is stable"
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
        parentId: 1,
        predecessor: "3FS",
        wbs: "1.3",
        assignee: "Jane Doe",
        info: "Budgeting in progress"
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
        parentId: null,
        predecessor: "1FS",
        wbs: "2",
        assignee: "Alex Smith",
        info: "Main development cycle"
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
        parentId: 5,
        predecessor: null,
        wbs: "2.1",
        assignee: "Alex Smith",
        info: "React and Tailwind setup"
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
        parentId: 5,
        predecessor: "6SS",
        wbs: "2.2",
        assignee: "Jane Doe",
        info: "Express and Drizzle configuration"
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
        parentId: 5,
        predecessor: "6FS,7FS",
        wbs: "2.3",
        assignee: "Alex Smith",
        info: "Connecting frontend to backend"
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
        parentId: null,
        predecessor: "5FS",
        wbs: "3",
        assignee: "Jane Doe",
        info: "QA and bug fixing"
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
        parentId: 9,
        predecessor: null,
        wbs: "3.1",
        assignee: "Alex Smith",
        info: "Verifying individual modules"
      },
      {
        id: 11,
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
        info: "End-to-end system testing"
      },
      {
        id: 12,
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
        info: "Client validation and sign-off"
      },
      {
        id: 13,
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
        info: "Production deployment and go-live"
      },
      {
        id: 14,
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
        info: "Configure production servers"
      },
      {
        id: 15,
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
        info: "Migrate data to production"
      },
      {
        id: 16,
        taskName: "Code Deployment",
        startDate: new Date("2024-06-22"),
        endDate: new Date("2024-06-24"),
        duration: 3,
        progress: 0,
        status: "Open",
        priority: "High",
        parentId: 13,
        predecessor: "14FS,15FS",
        wbs: "4.3",
        assignee: "Alex Smith",
        info: "Deploy application to production"
      },
      {
        id: 17,
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
        info: "Final production validation"
      },
      {
        id: 18,
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
        info: "Create user and technical documentation"
      }
    ];
    this.idCounter = 19;
  }

  async getTasks(): Promise<Task[]> {
    return this.tasks;
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.find(t => t.id === id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const task: Task = { 
      id: this.idCounter++,
      taskName: insertTask.taskName,
      startDate: insertTask.startDate,
      endDate: insertTask.endDate,
      duration: insertTask.duration ?? null,
      progress: insertTask.progress ?? 0,
      status: insertTask.status,
      priority: insertTask.priority ?? null,
      parentId: insertTask.parentId ?? null,
      predecessor: insertTask.predecessor ?? null,
      wbs: insertTask.wbs ?? null,
      assignee: insertTask.assignee ?? null,
      info: insertTask.info ?? null,
    };
    this.tasks.push(task);
    return task;
  }

  async updateTask(id: number, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    
    this.tasks[index] = { ...this.tasks[index], ...updates };
    return this.tasks[index];
  }

  async deleteTask(id: number): Promise<boolean> {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    this.tasks.splice(index, 1);
    return true;
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
