import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { insertTaskSchema } from "@shared/schema";
import { TaskBuilder } from "./task-builder";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept",
    );
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  app.get(api.tasks.list.path, async (req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.get("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }
    const task = await storage.getTask(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  });

  app.post(api.tasks.list.path, async (req, res) => {
    try {
      const parsed = insertTaskSchema.safeParse(req.body);
      if (!parsed.success) {
        return res
          .status(400)
          .json({ error: "Invalid task data", details: parsed.error.errors });
      }
      console.log(`app.post: ${JSON.stringify(parsed.data)}`);
      if (parsed.data.parentId == 0) {
        console.log(`Seting parentId to null`);
        parsed.data.parentId = null;
      }
      const task = await storage.createTask(parsed.data);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid task ID" });
      }

      const parsed = insertTaskSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        return res
          .status(400)
          .json({ error: "Invalid task data", details: parsed.error.errors });
      }

    if (parsed.data.parentId == 0) {
          console.log(`Seting parentId to null`);
          parsed.data.parentId = null;
        }
      const task = await storage.updateTask(id, parsed.data);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
    console.log("====================================  update task", id)
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid task ID" });
      }

      const deleted = await storage.deleteTask(id);
      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  app.get(api.metrics.get.path, async (req, res) => {
    const metrics = await storage.getMetrics();
    res.json(metrics);
  });

  app.get("/api/date-info", (req, res) => {
    const country = typeof req.query.country === "string" ? req.query.country : "US";
    const tb = new TaskBuilder();
    const info = tb.getCurrentDate(country);
    res.json({
      date: info.date.toISOString(),
      isHoliday: info.isHoliday,
      holidayName: info.holidayName,
      holidayType: info.holidayType,
      nextWorkday: info.nextWorkday.toISOString(),
    });
  });

  return httpServer;
}
