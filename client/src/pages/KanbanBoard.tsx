import { Layout } from "@/components/Layout";
import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import {ButtonComponent} from '@syncfusion/ej2-react-buttons';
import {
  KanbanComponent, 
  ColumnsDirective, 
  ColumnDirective,
  CardSettingsModel
} from '@syncfusion/ej2-react-kanban';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FilterX, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const cardSettings: CardSettingsModel = {
  contentField: 'taskName',
  headerField: 'id',
  tagsField: 'priority',
  grabberField: 'color',
  footerCssField: 'className'
};

export const createCardTemplate = (onDelete: (id: number) => void) => (props: any) => {
  const priorityColor = 
    props.priority === 'Critical' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400' :
    props.priority === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400' :
    props.priority === 'Normal' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400' :
    'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400';

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete task "${props.taskName}"?`)) {
      onDelete(props.id);
    }
  };

  return (
    <div className="e-card-content p-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-mono text-muted-foreground">{props.wbs ? `WBS: ${props.wbs}` : `#${props.id}`}</span>
        <div className="flex items-center gap-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityColor}`}>
            {props.priority || 'Normal'}
          </span>
          <button
            onClick={handleDelete}
            className="p-1 text-muted-foreground hover:text-destructive transition-colors rounded"
            data-testid={`button-delete-task-${props.id}`}
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
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

interface KanbanBoardCoreProps {
  showHeader?: boolean;
  tasks?: any[];
  isLoading?: boolean;
  updateTask?: any;
  deleteTask?: any;
}

export function KanbanBoardCore({ 
  showHeader = false,
  tasks: injectedTasks,
  isLoading: injectedLoading,
  updateTask: injectedUpdateTask,
  deleteTask: injectedDeleteTask
}: KanbanBoardCoreProps) {
  const { data: fetchedTasks, isLoading: fetchedLoading } = useTasks();
  const defaultUpdateTask = useUpdateTask();
  const defaultDeleteTask = useDeleteTask();
  const kanbanInstance = useRef(null);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [swimlaneKey, setSwimlaneKey] = useState({ keyField: 'assignee' }); // Default to 'Assignee' for swimlanes


  const tasks = injectedTasks ?? fetchedTasks;
  const isLoading = injectedLoading ?? fetchedLoading;
  const updateTask = injectedUpdateTask ?? defaultUpdateTask;
  const deleteTask = injectedDeleteTask ?? defaultDeleteTask;

  const handleDragStop = (args: any) => {
    const cardData = args.data?.[0];
    if (cardData && cardData.id) {
      updateTask.mutate({
        id: cardData.id,
        data: { status: cardData.status },
      }, {
        onSuccess: () => toast({ title: "Task status updated" }),
        onError: () => toast({ title: "Failed to update task", variant: "destructive" }),
      });
    }
  };

  const handleDeleteTask = (id: number) => {
    deleteTask.mutate(id, {
      onSuccess: () => toast({ title: "Task deleted successfully" }),
      onError: () => toast({ title: "Failed to delete task", variant: "destructive" }),
    });
  };

  const handleActionComplete = (args: any) => {
    if (args.requestType === 'cardChanged' && args.changedRecords?.length > 0) {
      const cardData = args.changedRecords[0];
      updateTask.mutate({
        id: cardData.id,
        data: {
          taskName: cardData.taskName,
          status: cardData.status,
          priority: cardData.priority,
          progress: cardData.progress,
          assignee: cardData.assignee,
          info: cardData.info,
        },
      }, {
        onSuccess: () => toast({ title: "Task saved successfully" }),
        onError: () => toast({ title: "Failed to save task", variant: "destructive" }),
      });
    } else if (args.requestType === 'cardRemoved' && args.deletedRecords?.length > 0) {
      const cardData = args.deletedRecords[0];
      deleteTask.mutate(cardData.id, {
        onSuccess: () => toast({ title: "Task deleted successfully" }),
        onError: () => toast({ title: "Failed to delete task", variant: "destructive" }),
      });
    }
  };

  const cardTemplate = createCardTemplate(handleDeleteTask);

  const dialogFields = [
    { text: 'ID', key: 'id', type: 'Input' },
    { key: 'taskName', type: 'TextArea', validationRules: { required: true } },
    { key: 'status', type: 'DropDown' },
    { key: 'priority', type: 'DropDown' },
    { key: 'progress', type: 'Numeric' },
    { key: 'assignee', type: 'DropDown' },
    { key: 'info', type: 'TextArea' },
  ];

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredTasks = tasks?.filter((task: any) => {
    const matchesSearch = !searchTerm || (
      (task.taskName && task.taskName.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (task.wbs && task.wbs.includes(searchTerm)) ||
      (task.id && task.id.toString().includes(searchTerm))
    );
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === "all" || task.assignee === assigneeFilter;
    
    return matchesSearch && matchesPriority && matchesAssignee;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setPriorityFilter("all");
    setAssigneeFilter("all");

  };

  const toggleSwimlanes = (event) => {
    // Toggle between 'Assignee' (with swimlanes) and an empty string (no swimlanes)
    if(swimlaneKey.keyField === 'assignee' ) {
        setSwimlaneKey({keyField: null });
        // Message to Enable
        event.target.style.width = '260px';
    } else
    {
        setSwimlaneKey( { keyField: 'assignee' });
        // Message to Disable
        event.target.style.width = '150px';
    }
    kanbanInstance.current.dataBind();
    // kanbanInstance.current.refresh();
    };
  return (
    <div className="h-full flex flex-col space-y-4">
      {showHeader && (
        <div>
          <h1 className="text-3xl font-bold text-foreground">Task Board</h1>
          <p className="text-muted-foreground">Visualize and optimize your workflow.</p>
        </div>
      )}
<ButtonComponent onClick={toggleSwimlanes} cssClass='e-info e-small' style={{width: '150px',}}>
        {swimlaneKey.keyField === 'assignee' ? 'Disable Swimlanes' : 'Enable Swimlanes (by Assignee)'}
      </ButtonComponent>
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, WBS or ID..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search-kanban"
            />
          </div>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px]" data-testid="select-priority-filter-kanban">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Normal">Normal</SelectItem>
            </SelectContent>
          </Select>

          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-[150px]" data-testid="select-assignee-filter-kanban">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              <SelectItem value="Jane Doe">Jane Doe</SelectItem>
              <SelectItem value="Alex Smith">Alex Smith</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="text-muted-foreground hover:text-foreground"
            data-testid="button-reset-filters-kanban"
          >
            <FilterX className="h-4 w-4 mr-2" />
            Reset
          </Button>
          
          <div className="ml-auto text-sm text-muted-foreground">
            Showing {filteredTasks?.length} tasks
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="h-full min-w-[1000px] bg-transparent">
          <KanbanComponent
            id="kanban"
            ref={kanbanInstance}
            keyField="status"
            dataSource={filteredTasks}
            key={JSON.stringify({ searchTerm, priorityFilter, assigneeFilter, taskCount: tasks?.length })}
            cardSettings={{ ...cardSettings, template: cardTemplate }}
            swimlaneSettings={swimlaneKey}
            dialogSettings={{ fields: dialogFields }}
            height="100%"
            style={{ backgroundColor: 'transparent' }}
            dragStop={handleDragStop}
            actionComplete={handleActionComplete}
          >
            <ColumnsDirective>
              <ColumnDirective headerText="To Do" keyField="Open" allowToggle={true} template={(props: any) => (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="font-bold text-foreground">To Do</span>
                    <span className="ml-auto bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">{props.count}</span>
                  </div>
              )}/>
              <ColumnDirective headerText="In Progress" keyField="In Progress" allowToggle={true} template={(props: any) => (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="font-bold text-foreground">In Progress</span>
                    <span className="ml-auto bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">{props.count}</span>
                  </div>
              )}/>
              <ColumnDirective headerText="Testing" keyField="Testing" allowToggle={true} template={(props: any) => (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                    <span className="font-bold text-foreground">Testing</span>
                    <span className="ml-auto bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">{props.count}</span>
                  </div>
              )}/>
              <ColumnDirective headerText="Done" keyField="Close" allowToggle={true} template={(props: any) => (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="font-bold text-foreground">Done</span>
                    <span className="ml-auto bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">{props.count}</span>
                  </div>
              )}/>
            </ColumnsDirective>
          </KanbanComponent>
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  return (
    <Layout>
      <KanbanBoardCore showHeader={true} />
    </Layout>
  );
}
