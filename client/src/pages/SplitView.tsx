import { Layout } from "@/components/Layout";
import { useState, useMemo } from "react";
import { SplitterComponent, PaneDirective, PanesDirective } from '@syncfusion/ej2-react-layouts';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { GanttView } from "./GanttChart";
import { KanbanView } from "./KanbanBoard";
import { useToast } from "@/hooks/use-toast";

class TaskAdaptor extends UrlAdaptor {
  processResponse(data: any, ds?: any, query?: any, xhr?: any, request?: any, changes?: any): Object {
    if (Array.isArray(data)) {
      return data.map((task: any) => ({
        ...task,
        startDate: new Date(task.startDate),
        endDate: new Date(task.endDate),
      }));
    }
    return data;
  }
}

export default function SplitView() {
  const { toast } = useToast();

  // Gantt State
  const [ganttSearch, setGanttSearch] = useState("");
  const [ganttStatus, setGanttStatus] = useState("all");
  const [ganttPriority, setGanttPriority] = useState("all");
  const [ganttAssignee, setGanttAssignee] = useState("all");

  // Kanban State
  const [kanbanSearch, setKanbanSearch] = useState("");
  const [kanbanPriority, setKanbanPriority] = useState("all");
  const [kanbanAssignee, setKanbanAssignee] = useState("all");

  const ganttDataManager = useMemo(() => new DataManager({
    url: '/api/tasks',
    adaptor: new TaskAdaptor(),
    crossDomain: false
  }), []);

  const kanbanDataManager = useMemo(() => new DataManager({
    url: '/api/tasks',
    adaptor: new TaskAdaptor(),
    crossDomain: false
  }), []);

  const handleGanttActionComplete = async (args: any) => {
    if (args.requestType === 'save' && args.action === 'add') {
      const taskData = args.data;
      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskName: taskData.taskName,
            startDate: taskData.startDate,
            endDate: taskData.endDate,
            duration: taskData.duration,
            progress: taskData.progress || 0,
            status: taskData.status || 'Open',
            priority: taskData.priority,
            parentId: taskData.parentId,
            wbs: taskData.wbs,
            assignee: taskData.assignee,
            info: taskData.info,
          }),
        });
        if (response.ok) {
          toast({ title: "Task created" });
        } else {
          toast({ title: "Failed to create task", variant: "destructive" });
        }
      } catch {
        toast({ title: "Failed to create task", variant: "destructive" });
      }
    } else if (args.requestType === 'save' && args.action === 'edit') {
      const taskData = args.data;
      try {
        const response = await fetch(`/api/tasks/${taskData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskName: taskData.taskName,
            startDate: taskData.startDate,
            endDate: taskData.endDate,
            duration: taskData.duration,
            progress: taskData.progress,
            status: taskData.status,
            priority: taskData.priority,
            parentId: taskData.parentId,
            wbs: taskData.wbs,
            assignee: taskData.assignee,
            info: taskData.info,
          }),
        });
        if (response.ok) {
          toast({ title: "Task updated" });
        } else {
          toast({ title: "Failed to update task", variant: "destructive" });
        }
      } catch {
        toast({ title: "Failed to update task", variant: "destructive" });
      }
    } else if (args.requestType === 'delete') {
      const taskData = args.data?.[0];
      if (taskData?.id) {
        try {
          const response = await fetch(`/api/tasks/${taskData.id}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            toast({ title: "Task deleted" });
          } else {
            toast({ title: "Failed to delete task", variant: "destructive" });
          }
        } catch {
          toast({ title: "Failed to delete task", variant: "destructive" });
        }
      }
    }
  };

  const handleKanbanDragStop = async (args: any) => {
    const cardData = args.data?.[0];
    if (cardData && cardData.id) {
      try {
        const response = await fetch(`/api/tasks/${cardData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: cardData.status }),
        });
        if (response.ok) {
          toast({ title: "Task status updated" });
        } else {
          toast({ title: "Failed to update task", variant: "destructive" });
        }
      } catch {
        toast({ title: "Failed to update task", variant: "destructive" });
      }
    }
  };

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
                    dataManager={ganttDataManager}
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
                    onActionComplete={handleGanttActionComplete}
                  />
                </div>
              )} />
              <PaneDirective size="50%" min="30%" content={() => (
                <div className="h-full p-2 overflow-auto">
                  <KanbanView 
                    dataManager={kanbanDataManager}
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
                    onDragStop={handleKanbanDragStop}
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
