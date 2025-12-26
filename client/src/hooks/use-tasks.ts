import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

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
