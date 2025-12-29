import { Layout } from "@/components/Layout";
import { useTasks } from "@/hooks/use-tasks";
import { useState } from "react";
import { SplitterComponent, PaneDirective, PanesDirective } from '@syncfusion/ej2-react-layouts';
import { GanttView } from "./GanttChart";
import { KanbanView } from "./KanbanBoard";

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

  // Shared Settings
  const taskFields = {
    id: 'id',
    name: 'taskName',
    startDate: 'startDate',
    endDate: 'endDate',
    duration: 'duration',
    progress: 'progress',
    parentID: 'parentId',
    dependency: 'predecessor',
    status: 'status',
    wbs: 'wbs',
    resourceInfo: 'assignee',
    priority: 'priority',
    info: 'info'
  };

  const editSettings = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    allowTaskbarEditing: true,
    showDeleteConfirmDialog: true
  };

  const toolbar = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'];

  const progressTemplate = (props: any) => (
    <div className="w-full flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${
            props.progress === 100 ? 'bg-green-500' : 
            props.progress > 50 ? 'bg-blue-500' : 'bg-orange-400'
          }`}
          style={{ width: `${props.progress}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 w-8">{props.progress}%</span>
    </div>
  );

  const cardSettings = {
    contentField: 'taskName',
    headerField: 'id',
    tagsField: 'priority',
    grabberField: 'color',
    footerCssField: 'className'
  };

  const cardTemplate = (props: any) => {
    const priorityColor = 
      props.priority === 'Critical' ? 'bg-red-100 text-red-700 border-red-200' :
      props.priority === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200' :
      props.priority === 'Normal' ? 'bg-blue-100 text-blue-700 border-blue-200' :
      'bg-gray-100 text-gray-700 border-gray-200';

    const getInitials = (name: string) => {
      if (!name) return "??";
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
      <div className="e-card-content p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-mono text-muted-foreground">{props.wbs ? `WBS: ${props.wbs}` : `#${props.id}`}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityColor}`}>
            {props.priority || 'Normal'}
          </span>
        </div>
        <div className="e-card-header-title font-semibold text-foreground mb-3 text-sm leading-tight">
          {props.taskName}
        </div>
        {props.info && (
          <div className="text-[11px] text-muted-foreground italic mb-2 line-clamp-2">
            {props.info}
          </div>
        )}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full ${props.assignee === 'Jane Doe' ? 'bg-blue-500' : 'bg-purple-500'} border-2 border-white flex items-center justify-center text-[10px] text-white font-bold shadow-sm`}>
              {getInitials(props.assignee)}
            </div>
            <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[80px]">
              {props.assignee || 'Unassigned'}
            </span>
          </div>
          <div className={`text-xs font-medium ${
            props.progress === 100 ? 'text-green-600' : 'text-muted-foreground'
          }`}>
            {props.progress}%
          </div>
        </div>
      </div>
    );
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
                    tasks={tasks}
                    filteredTasks={filteredGanttTasks}
                    searchTerm={ganttSearch}
                    statusFilter={ganttStatus}
                    priorityFilter={ganttPriority}
                    assigneeFilter={ganttAssignee}
                    taskFields={taskFields}
                    editSettings={editSettings}
                    toolbar={toolbar}
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
                    progressTemplate={progressTemplate}
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
                    cardSettings={cardSettings}
                    cardTemplate={cardTemplate}
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
