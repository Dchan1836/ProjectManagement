import { Layout } from "@/components/Layout";
import { useTasks } from "@/hooks/use-tasks";
import { useState } from "react";
import { SplitterComponent, PaneDirective, PanesDirective } from '@syncfusion/ej2-react-layouts';
import { GanttView } from "./GanttChart";
import { KanbanView } from "./KanbanBoard";
import { queryClient } from "@/lib/queryClient";

export default function SplitView() {
  const { data: tasks, isLoading } = useTasks();

  // Gantt State
  const [ganttSearch, setGanttSearch] = useState("");
  const [ganttStatus, setGanttStatus] = useState("all");
  const [ganttPriority, setGanttPriority] = useState("all");
  const [ganttAssignee, setGanttAssignee] = useState("all");

  // Kanban State
  const [kanbanSearch, setKanbanSearch] = useState("");
  const [kanbanPriority, setKanbanPriority] = useState("all");
  const [kanbanAssignee, setKanbanAssignee] = useState("all");

  if (isLoading) {
    return (
      <Layout>
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // Handle data updates to refresh both views
  const handleActionComplete = (args: any) => {
    if (args.requestType === 'save' || args.requestType === 'delete' || args.requestType === 'cardChanged') {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    }
  };

  // Filtering Logic (duplicated from components for now, ideally could be a hook)
  const filterTasks = (tasks: any, search: string, status: string, priority: string, assignee: string) => {
    return tasks?.filter((task: any) => {
      const matchesStatus = status === "all" || task.status === status;
      const matchesPriority = priority === "all" || task.priority === priority;
      const matchesAssignee = assignee === "all" || task.assignee === assignee;
      const matchesSearch = !search || (
        (task.taskName && task.taskName.toLowerCase().includes(search.toLowerCase())) || 
        (task.wbs && task.wbs.includes(search)) ||
        (task.id && task.id.toString().includes(search))
      );
      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
    });
  };

  const filteredGanttTasks = filterTasks(tasks, ganttSearch, ganttStatus, ganttPriority, ganttAssignee);
  const filteredKanbanTasks = filterTasks(tasks, kanbanSearch, "all", kanbanPriority, kanbanAssignee);

  return (
    <Layout>
      <div className="h-full flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interactive Split View</h1>
          <p className="text-muted-foreground">Edit tasks in Gantt or Kanban simultaneously.</p>
        </div>

        <div className="flex-1 min-h-0 bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <SplitterComponent height="100%" orientation="Vertical">
            <PanesDirective>
              <PaneDirective size="50%" min="30%" content={() => (
                <div className="h-full p-2 overflow-auto">
                  <GanttView 
                    tasks={tasks}
                    filteredTasks={filteredGanttTasks}
                    searchTerm={ganttSearch}
                    statusFilter={ganttStatus}
                    priorityFilter={ganttPriority}
                    assigneeFilter={ganttAssignee}
                    resetFilters={{
                      setSearchTerm: setGanttSearch,
                      setStatusFilter: setGanttStatus,
                      setPriorityFilter: setGanttPriority,
                      setAssigneeFilter: setGanttAssignee,
                      reset: () => {
                        setGanttSearch("");
                        setGanttStatus("all");
                        setGanttPriority("all");
                        setGanttAssignee("all");
                      }
                    }}
                    onActionComplete={handleActionComplete}
                  />
                </div>
              )} />
              <PaneDirective size="50%" min="30%" content={() => (
                <div className="h-full p-2 overflow-auto">
                  <KanbanView 
                    filteredTasks={filteredKanbanTasks}
                    searchTerm={kanbanSearch}
                    priorityFilter={kanbanPriority}
                    assigneeFilter={kanbanAssignee}
                    resetFilters={{
                      setSearchTerm: setKanbanSearch,
                      setPriorityFilter: setKanbanPriority,
                      setAssigneeFilter: setKanbanAssignee,
                      reset: () => {
                        setKanbanSearch("");
                        setKanbanPriority("all");
                        setKanbanAssignee("all");
                      }
                    }}
                    onActionComplete={handleActionComplete}
                  />
                </div>
              )} />
            </PanesDirective>
          </SplitterComponent>
        </div>
      </div>
    </Layout>
  );
}
