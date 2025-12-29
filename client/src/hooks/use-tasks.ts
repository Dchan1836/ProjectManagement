import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { InsertTask } from "@shared/schema";

// Extend the shared type to include runtime-only date conversions if needed
// Syncfusion needs actual Date objects, not ISO strings
export interface FormattedTask {
  id: number;
  taskName: string;
  startDate: Date;
  endDate: Date;
  duration: number | null;
  progress: number;
  status: string;
  priority: string | null;
  parentId: number | null;
  wbs?: string | null;
  assignee?: string | null;
  info?: string | null;
}

export function useTasks() {
  return useQuery({
    queryKey: [api.tasks.list.path],
    queryFn: async () => {
      const res = await fetch(api.tasks.list.path);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      
      const data = await res.json();
      const parsed = api.tasks.list.responses[200].parse(data);
      
      // Transform ISO strings to Date objects for Syncfusion
      return parsed.map((task) => ({
        ...task,
        startDate: new Date(task.startDate),
        endDate: new Date(task.endDate),
      })) as FormattedTask[];
    },
  });
}

export function useCreateTask() {
  return useMutation({
    mutationFn: async (task: InsertTask) => {
      const res = await apiRequest("POST", "/api/tasks", task);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.metrics.get.path] });
    },
  });
}

export function useUpdateTask() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertTask> }) => {
      const res = await apiRequest("PUT", `/api/tasks/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.metrics.get.path] });
    },
  });
}

export function useDeleteTask() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.metrics.get.path] });
    },
  });
}

export function useMetrics() {
  return useQuery({
    queryKey: [api.metrics.get.path],
    queryFn: async () => {
      const res = await fetch(api.metrics.get.path);
      if (!res.ok) throw new Error("Failed to fetch metrics");
      return api.metrics.get.responses[200].parse(await res.json());
    },
  });
}
