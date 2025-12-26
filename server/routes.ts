import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // CORS configuration if needed, though Vite proxy handles local dev.
  // The user asked for "Configure CORS on the Express server to allow requests from the React frontend".
  // Since we are running on the same origin via Vite proxy or serving static files in prod, explicit CORS might not be strictly needed for *our* specific setup,
  // but I'll add a middleware just in case they want to run them separately later.
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow all for simplicity in this mock
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.get(api.tasks.list.path, async (req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.get(api.metrics.get.path, async (req, res) => {
    const metrics = await storage.getMetrics();
    res.json(metrics);
  });

  return httpServer;
}
