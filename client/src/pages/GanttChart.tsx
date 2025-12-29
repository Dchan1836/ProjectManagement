import { Layout } from "@/components/Layout";
import { useState, useRef, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  GanttComponent, 
  Inject, 
  Selection, 
  Toolbar, 
  Edit, 
  Filter, 
  Sort, 
  Resize, 
  DayMarkers,
  ColumnsDirective,
  ColumnDirective
} from '@syncfusion/ej2-react-gantt';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";

export const taskFields = {
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
  priority: 'priority',
  resourceInfo: 'assignee',
  info: 'info'
};

export const editSettings = {
  allowAdding: true,
  allowEditing: true,
  allowDeleting: true,
  allowTaskbarEditing: true,
  showDeleteConfirmDialog: true
};

export const toolbar = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'];

export const progressTemplate = (props: any) => {
  return (
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
};

class TaskAdaptor extends UrlAdaptor {
  processResponse(data: any, ds?: any, query?: any, xhr?: any, request?: any, changes?: any): Object {
    if (Array.isArray(data)) {
      return data.map((task: any) => ({
        ...task,
        startDate: new Date(task.startDate),
        endDate: new Date(task.endDate),
      }));
    }
    if (data && typeof data === 'object') {
      return {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      };
    }
    return data;
  }
}

export function GanttView({ dataManager, searchTerm, statusFilter, priorityFilter, assigneeFilter, resetFilters, onActionComplete }: any) {
  const ganttInstance = useRef<GanttComponent>(null);

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, WBS or ID..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => resetFilters.setSearchTerm(e.target.value)}
              data-testid="input-gantt-search"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={resetFilters.setStatusFilter}>
            <SelectTrigger className="w-[150px]" data-testid="select-gantt-status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Testing">Testing</SelectItem>
              <SelectItem value="Close">Done</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={resetFilters.setPriorityFilter}>
            <SelectTrigger className="w-[150px]" data-testid="select-gantt-priority">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Normal">Normal</SelectItem>
            </SelectContent>
          </Select>

          <Select value={assigneeFilter} onValueChange={resetFilters.setAssigneeFilter}>
            <SelectTrigger className="w-[150px]" data-testid="select-gantt-assignee">
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
            onClick={resetFilters.reset}
            className="text-muted-foreground hover:text-foreground"
            data-testid="button-gantt-reset-filters"
          >
            <FilterX className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-border shadow-sm overflow-hidden p-1">
        <GanttComponent
          ref={ganttInstance}
          dataSource={dataManager}
          taskFields={taskFields}
          height="100%"
          treeColumnIndex={2}
          allowSelection={true}
          allowFiltering={true}
          allowSorting={true}
          allowResizing={true}
          highlightWeekends={true}
          toolbar={toolbar}
          editSettings={editSettings}
          projectStartDate={new Date('2024-01-01')}
          projectEndDate={new Date('2024-12-31')}
          gridLines="Both"
          labelSettings={{ leftLabel: 'taskName' }}
          splitterSettings={{ position: '45%' }}
          rowHeight={45}
          taskbarHeight={30}
          actionComplete={onActionComplete}
        >
          <ColumnsDirective>
            <ColumnDirective field='wbs' headerText='WBS' width='70' textAlign='Left'></ColumnDirective>
            <ColumnDirective field='id' headerText='ID' width='70' textAlign='Left'></ColumnDirective>
            <ColumnDirective field='taskName' headerText='Task Name' width='250' clipMode='EllipsisWithTooltip'></ColumnDirective>
            <ColumnDirective field='assignee' headerText='Assignee' width='120'></ColumnDirective>
            <ColumnDirective field='info' headerText='Info' width='200' clipMode='EllipsisWithTooltip'></ColumnDirective>
            <ColumnDirective field='priority' headerText='Priority' width='100'></ColumnDirective>
            <ColumnDirective field='status' headerText='Status' width='120'></ColumnDirective>
            <ColumnDirective field='startDate' headerText='Start Date' width='120' format='yMd' textAlign='Right'></ColumnDirective>
            <ColumnDirective field='endDate' headerText='End Date' width='120' format='yMd' textAlign='Right'></ColumnDirective>
            <ColumnDirective field='duration' headerText='Duration' width='90' textAlign='Right'></ColumnDirective>
            <ColumnDirective field='progress' headerText='Progress' width='120' template={progressTemplate} textAlign='Left'></ColumnDirective>
          </ColumnsDirective>
          <Inject services={[Selection, Toolbar, Edit, Filter, Sort, Resize, DayMarkers]} />
        </GanttComponent>
      </div>
    </div>
  );
}

export default function GanttChart() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const dataManager = useMemo(() => new DataManager({
    url: '/api/tasks',
    adaptor: new TaskAdaptor(),
    crossDomain: false
  }), []);

  const handleActionComplete = async (args: any) => {
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
          toast({ title: "Task created successfully" });
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
          toast({ title: "Task updated successfully" });
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
            toast({ title: "Task deleted successfully" });
          } else {
            toast({ title: "Failed to delete task", variant: "destructive" });
          }
        } catch {
          toast({ title: "Failed to delete task", variant: "destructive" });
        }
      }
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setAssigneeFilter("all");
  };

  return (
    <Layout>
      <div className="h-full flex flex-col space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Project Timeline</h1>
            <p className="text-muted-foreground">Manage project schedules and dependencies.</p>
          </div>
          <Button data-testid="button-export-report">
            Export Report
          </Button>
        </div>

        <GanttView 
          dataManager={dataManager}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          assigneeFilter={assigneeFilter}
          resetFilters={{
            setSearchTerm,
            setStatusFilter,
            setPriorityFilter,
            setAssigneeFilter,
            reset: resetFilters
          }}
          onActionComplete={handleActionComplete}
        />
      </div>
    </Layout>
  );
}
