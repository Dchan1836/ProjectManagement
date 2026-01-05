import { Layout } from "@/components/Layout";
import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
  CardSettingsModel,
} from "@syncfusion/ej2-react-kanban";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FilterX, Trash2, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const cardSettings: CardSettingsModel = {
  contentField: "taskName",
  headerField: "taskId",
  tagsField: "priority",
  grabberField: "color",
  footerCssField: "className",
};

interface DialogTemplateProps {
  taskId: number;
  taskName: string;
  status: string;
  priority: string;
  progress: number;
  assignee: string;
  startDate: string | Date;
  endDate: string | Date;
  duration: number;
  parentId: number | null;
  predecessor: string | null;
  wbs: string;
  info: string;
}

interface KanbanDialogProps extends DialogTemplateProps {
  onSave: (data: any) => void;
  onDelete: (taskId: number) => void;
  onCancel: () => void;
}

function KanbanDialogContent({
  onSave,
  onDelete,
  onCancel,
  ...props
}: KanbanDialogProps) {
  const [formData, setFormData] = useState({
    taskId: props.taskId,
    taskName: props.taskName || "",
    status: props.status || "Open",
    priority: props.priority || "Normal",
    progress: props.progress || 0,
    assignee: props.assignee || "",
    startDate: props.startDate ? new Date(props.startDate) : null,
    endDate: props.endDate ? new Date(props.endDate) : null,
    duration: props.duration || 0,
    parentId: props.parentId || null,
    predecessor: props.predecessor || "",
    wbs: props.wbs || "",
    info: props.info || "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({
      ...formData,
      startDate: formData.startDate?.toISOString?.() || formData.startDate,
      endDate: formData.endDate?.toISOString?.() || formData.endDate,
    });
  };

  const handleDelete = () => {
    if (confirm(`Delete task "${formData.taskName}"?`)) {
      onDelete(formData.taskId);
    }
  };

  return (
    <div className="p-4 bg-background">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="taskId" className="text-sm font-medium">Task ID</Label>
          <Input
            id="taskId"
            value={formData.taskId}
            disabled
            className="bg-muted cursor-not-allowed"
            data-testid="input-dialog-taskId"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="status" className="text-sm font-medium">Status</Label>
          <Select value={formData.status} onValueChange={(v) => handleChange("status", v)}>
            <SelectTrigger id="status" data-testid="select-dialog-status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Testing">Testing</SelectItem>
              <SelectItem value="Close">Close</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2 space-y-1">
          <Label htmlFor="taskName" className="text-sm font-medium">Task Name</Label>
          <Textarea
            id="taskName"
            value={formData.taskName}
            onChange={(e) => handleChange("taskName", e.target.value)}
            className="min-h-[60px]"
            data-testid="input-dialog-taskName"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
          <Select value={formData.priority} onValueChange={(v) => handleChange("priority", v)}>
            <SelectTrigger id="priority" data-testid="select-dialog-priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Normal">Normal</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="progress" className="text-sm font-medium">Progress (%)</Label>
          <Input
            id="progress"
            type="number"
            min={0}
            max={100}
            value={formData.progress}
            onChange={(e) => handleChange("progress", parseInt(e.target.value) || 0)}
            data-testid="input-dialog-progress"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="assignee" className="text-sm font-medium">Assignee</Label>
          <Select value={formData.assignee} onValueChange={(v) => handleChange("assignee", v)}>
            <SelectTrigger id="assignee" data-testid="select-dialog-assignee">
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Jane Doe">Jane Doe</SelectItem>
              <SelectItem value="Alex Smith">Alex Smith</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="duration" className="text-sm font-medium">Duration (days)</Label>
          <Input
            id="duration"
            type="number"
            min={0}
            value={formData.duration}
            onChange={(e) => handleChange("duration", parseInt(e.target.value) || 0)}
            data-testid="input-dialog-duration"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-sm font-medium">Start Date</Label>
          <DatePickerComponent
            id="startDate"
            value={formData.startDate}
            format="yyyy-MM-dd"
            placeholder="Select start date"
            change={(e: any) => handleChange("startDate", e.value)}
            cssClass="e-custom-datepicker"
            data-testid="datepicker-dialog-startDate"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium">End Date</Label>
          <DatePickerComponent
            id="endDate"
            value={formData.endDate}
            format="yyyy-MM-dd"
            placeholder="Select end date"
            change={(e: any) => handleChange("endDate", e.value)}
            cssClass="e-custom-datepicker"
            data-testid="datepicker-dialog-endDate"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="parentId" className="text-sm font-medium">Parent ID</Label>
          <Input
            id="parentId"
            type="number"
            value={formData.parentId || ""}
            onChange={(e) => handleChange("parentId", e.target.value ? parseInt(e.target.value) : null)}
            data-testid="input-dialog-parentId"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="predecessor" className="text-sm font-medium">Predecessor</Label>
          <Input
            id="predecessor"
            value={formData.predecessor || ""}
            onChange={(e) => handleChange("predecessor", e.target.value)}
            placeholder="e.g., 2FS, 3SS"
            data-testid="input-dialog-predecessor"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="wbs" className="text-sm font-medium">WBS</Label>
          <Input
            id="wbs"
            value={formData.wbs}
            onChange={(e) => handleChange("wbs", e.target.value)}
            data-testid="input-dialog-wbs"
          />
        </div>

        <div className="col-span-2 space-y-1">
          <Label htmlFor="info" className="text-sm font-medium">Info / Notes</Label>
          <Textarea
            id="info"
            value={formData.info}
            onChange={(e) => handleChange("info", e.target.value)}
            className="min-h-[60px]"
            data-testid="input-dialog-info"
          />
        </div>
      </div>

      <div className="flex justify-between mt-6 pt-4 border-t border-border">
        <Button
          variant="destructive"
          onClick={handleDelete}
          data-testid="button-dialog-delete"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            data-testid="button-dialog-cancel"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            data-testid="button-dialog-save"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export const createDialogTemplate = (
  onSave: (data: any) => void,
  onDelete: (taskId: number) => void,
  onCancel: () => void
) => (props: DialogTemplateProps) => (
  <KanbanDialogContent
    {...props}
    onSave={onSave}
    onDelete={onDelete}
    onCancel={onCancel}
  />
);

export const createCardTemplate =
  (onDelete: (taskId: number) => void) => (props: any) => {
    const priorityColor =
      props.priority === "Critical"
        ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400"
        : props.priority === "High"
          ? "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400"
          : props.priority === "Normal"
            ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
            : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400";

    const getInitials = (name: string) => {
      if (!name) return "??";
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    };

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (confirm(`Delete task "${props.taskName}"?`)) {
        onDelete(props.taskId);
      }
    };

    return (
      <div className="e-card-content p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-mono text-muted-foreground">
            #{props.taskId}
            {props.wbs ? ` | WBS: ${props.wbs}` : ""}
          </span>
          <div className="flex items-center gap-1">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityColor}`}
            >
              {props.priority || "Normal"}
            </span>
            <button
              onClick={handleDelete}
              className="p-1 text-muted-foreground hover:text-destructive transition-colors rounded"
              data-testid={`button-delete-task-${props.taskId}`}
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
            <div
              className={`w-6 h-6 rounded-full ${props.assignee === "Jane Doe" ? "bg-blue-500" : "bg-purple-500"} border-2 border-white flex items-center justify-center text-[10px] text-white font-bold shadow-sm`}
            >
              {getInitials(props.assignee)}
            </div>
            <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[80px]">
              {props.assignee || "Unassigned"}
            </span>
          </div>
          <div
            className={`text-xs font-medium ${
              props.progress === 100
                ? "text-green-600"
                : "text-muted-foreground"
            }`}
          >
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
  deleteTask: injectedDeleteTask,
}: KanbanBoardCoreProps) {
  const { data: fetchedTasks, isLoading: fetchedLoading } = useTasks();
  const defaultUpdateTask = useUpdateTask();
  const defaultDeleteTask = useDeleteTask();
  const kanbanInstance = useRef(null);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [swimlaneKey, setSwimlaneKey] = useState({ keyField: "assignee" }); // Default to 'Assignee' for swimlanes

  const tasks = injectedTasks ?? fetchedTasks;
  const isLoading = injectedLoading ?? fetchedLoading;
  const updateTask = injectedUpdateTask ?? defaultUpdateTask;
  const deleteTask = injectedDeleteTask ?? defaultDeleteTask;

  const handleDragStop = (args: any) => {
    const cardData = args.data?.[0];
    if (cardData && cardData.taskId) {
      updateTask.mutate(
        {
          id: cardData.taskId,
          data: { status: cardData.status },
        },
        {
          onSuccess: () => toast({ title: "Task status updated" }),
          onError: () =>
            toast({ title: "Failed to update task", variant: "destructive" }),
        },
      );
    }
  };

  const handleDeleteTask = (taskId: number) => {
    deleteTask.mutate(taskId, {
      onSuccess: () => toast({ title: "Task deleted successfully" }),
      onError: () =>
        toast({ title: "Failed to delete task", variant: "destructive" }),
    });
  };

  const handleActionBegin = (args: any) => {
    console.log("Kanban actionBegin:", args.requestType);

    if (args.requestType === "cardChange" && args.changedRecords?.length > 0) {
      const cardData = args.changedRecords[0];
      console.log("Card data to save:", JSON.stringify(cardData));

      const taskId = cardData.taskId || cardData.TaskId;
      if (!taskId) {
        console.error("No task ID found in card data");
        return;
      }

      updateTask.mutate(
        {
          id: taskId,
          data: {
            taskName: cardData.taskName || cardData.TaskName,
            status: cardData.status || cardData.Status,
            priority: cardData.priority || cardData.Priority,
            progress: Number(cardData.progress ?? cardData.Progress ?? 0),
            assignee: cardData.assignee || cardData.Assignee,
            startDate: cardData.startDate,
            endDate: cardData.endDate,
            duration: Number(cardData.duration),
            parentId: Number(cardData.parentId),
            predecessor: cardData.predecessor,
            wbs: cardData.wbs,
            info: cardData.info || cardData.Info,
          },
        },
        {
          onSuccess: () => toast({ title: "Task saved successfully" }),
          onError: (err) => {
            console.error("Failed to save task:", err);
            toast({ title: "Failed to save task", variant: "destructive" });
          },
        },
      );
    } else if (
      args.requestType === "cardRemove" &&
      args.deletedRecords?.length > 0
    ) {
      const cardData = args.deletedRecords[0];
      const taskId = cardData.taskId || cardData.TaskId;
      deleteTask.mutate(taskId, {
        onSuccess: () => toast({ title: "Task deleted successfully" }),
        onError: () =>
          toast({ title: "Failed to delete task", variant: "destructive" }),
      });
    }
  };

  const cardTemplate = createCardTemplate(handleDeleteTask);

  const handleDialogSave = (data: any) => {
    updateTask.mutate(
      {
        id: data.taskId,
        data: {
          taskName: data.taskName,
          status: data.status,
          priority: data.priority,
          progress: Number(data.progress) || 0,
          assignee: data.assignee,
          startDate: data.startDate,
          endDate: data.endDate,
          duration: Number(data.duration) || 0,
          parentId: data.parentId ? Number(data.parentId) : null,
          predecessor: data.predecessor || null,
          wbs: data.wbs,
          info: data.info,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Task saved successfully" });
          if (kanbanInstance.current) {
            (kanbanInstance.current as any).closeDialog();
          }
        },
        onError: (err) => {
          console.error("Failed to save task:", err);
          toast({ title: "Failed to save task", variant: "destructive" });
        },
      }
    );
  };

  const handleDialogDelete = (taskId: number) => {
    deleteTask.mutate(taskId, {
      onSuccess: () => {
        toast({ title: "Task deleted successfully" });
        if (kanbanInstance.current) {
          (kanbanInstance.current as any).closeDialog();
        }
      },
      onError: () => toast({ title: "Failed to delete task", variant: "destructive" }),
    });
  };

  const handleDialogCancel = () => {
    if (kanbanInstance.current) {
      (kanbanInstance.current as any).closeDialog();
    }
  };

  const dialogTemplate = createDialogTemplate(
    handleDialogSave,
    handleDialogDelete,
    handleDialogCancel
  );

  // const handleDialogOpen = (args: any) => {
  //   if (args.element) {
  //     const idInput = args.element.querySelector('input[name="id"]');
  //     if (idInput) {
  //       idInput.setAttribute('readonly', 'true');
  //       idInput.style.backgroundColor = 'var(--muted)';
  //       idInput.style.cursor = 'not-allowed';
  //     }

  //     // Find and replace the Save button with custom handler
  //     const saveBtn = args.element.querySelector('.e-dialog-edit');
  //     if (saveBtn) {
  //       const newSaveBtn = saveBtn.cloneNode(true);
  //       saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

  //       newSaveBtn.addEventListener('click', (e: Event) => {
  //         e.preventDefault();
  //         e.stopPropagation();

  //         // Collect form data from dialog inputs
  //         const formData: any = {};
  //         const inputs = args.element.querySelectorAll('input, textarea, select');
  //         inputs.forEach((input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) => {
  //           const name = input.getAttribute('name');
  //           if (name) {
  //             formData[name] = input.value;
  //           }
  //         });

  //         // Also get data from Syncfusion dropdowns
  //         const dropdowns = args.element.querySelectorAll('.e-dropdownlist');
  //         dropdowns.forEach((dd: any) => {
  //           if (dd.ej2_instances && dd.ej2_instances[0]) {
  //             const instance = dd.ej2_instances[0];
  //             const name = instance.element?.getAttribute('name');
  //             if (name) {
  //               formData[name] = instance.value;
  //             }
  //           }
  //         });

  //         // Get numeric inputs
  //         const numerics = args.element.querySelectorAll('.e-numerictextbox');
  //         numerics.forEach((num: any) => {
  //           if (num.ej2_instances && num.ej2_instances[0]) {
  //             const instance = num.ej2_instances[0];
  //             const name = instance.element?.getAttribute('name');
  //             if (name) {
  //               formData[name] = instance.value;
  //             }
  //           }
  //         });

  //         const taskId = parseInt(formData.id || args.data?.id);
  //         if (!taskId) {
  //           console.error('No task ID found');
  //           return;
  //         }

  //         updateTask.mutate({
  //           id: taskId,
  //           data: {
  //             taskName: formData.taskName,
  //             status: formData.status,
  //             priority: formData.priority,
  //             progress: parseInt(formData.progress) || 0,
  //             assignee: formData.assignee,
  //             startDate: formData.startDate,
  //             endDate: formData.endDate,
  //             duration: parseInt(formData.duration) || null,
  //             parentId: parseInt(formData.parentId) || null,
  //             predecessor: formData.predecessor || null,
  //             wbs: formData.wbs,
  //             info: formData.info,
  //           },
  //         }, {
  //           onSuccess: () => {
  //             toast({ title: "Task saved successfully" });
  //             // Close the dialog
  //             if (kanbanInstance.current) {
  //               (kanbanInstance.current as any).closeDialog();
  //             }
  //           },
  //           onError: (err) => {
  //             console.error('Failed to save task:', err);
  //             toast({ title: "Failed to save task", variant: "destructive" });
  //           },
  //         });

  //         // if (kanbanInstance.current) {
  //         //   (kanbanInstance.current as any).closeDialog();
  //         // }
  //       });

  //     }
  //   }
  // };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const tasksWithTaskId = tasks?.map((task: any) => ({
    ...task,
    taskId: task.id,
  }));

  const filteredTasks = tasksWithTaskId?.filter((task: any) => {
    const matchesSearch =
      !searchTerm ||
      (task.taskName &&
        task.taskName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.wbs && task.wbs.includes(searchTerm)) ||
      (task.taskId && task.taskId.toString().includes(searchTerm));
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    const matchesAssignee =
      assigneeFilter === "all" || task.assignee === assigneeFilter;

    return matchesSearch && matchesPriority && matchesAssignee;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setPriorityFilter("all");
    setAssigneeFilter("all");
  };

  const toggleSwimlanes = (event) => {
    // Toggle between 'Assignee' (with swimlanes) and an empty string (no swimlanes)
    if (swimlaneKey.keyField === "assignee") {
      setSwimlaneKey({ keyField: null });
      // Message to Enable
      event.target.style.width = "260px";
    } else {
      setSwimlaneKey({ keyField: "assignee" });
      // Message to Disable
      event.target.style.width = "150px";
    }
    kanbanInstance.current.dataBind();
    // kanbanInstance.current.refresh();
  };
  return (
    <div className="h-full flex flex-col space-y-4">
      {showHeader && (
        <div>
          <h1 className="text-3xl font-bold text-foreground">Task Board</h1>
          <p className="text-muted-foreground">
            Visualize and optimize your workflow.
          </p>
        </div>
      )}
      <ButtonComponent
        onClick={toggleSwimlanes}
        cssClass="e-info e-small"
        style={{ width: "150px" }}
      >
        {swimlaneKey.keyField === "assignee"
          ? "Disable Swimlanes"
          : "Enable Swimlanes (by Assignee)"}
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
            <SelectTrigger
              className="w-[150px]"
              data-testid="select-priority-filter-kanban"
            >
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
            <SelectTrigger
              className="w-[150px]"
              data-testid="select-assignee-filter-kanban"
            >
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
            key={JSON.stringify({
              searchTerm,
              priorityFilter,
              assigneeFilter,
              taskCount: tasks?.length,
            })}
            cardSettings={{ ...cardSettings, template: cardTemplate }}
            swimlaneSettings={swimlaneKey}
            dialogSettings={{ template: dialogTemplate }}
            allowDragAndDrop={true}
            height="100%"
            style={{ backgroundColor: "transparent" }}
            dragStop={handleDragStop}
            actionBegin={handleActionBegin}
          >
            <ColumnsDirective>
              <ColumnDirective
                headerText="To Do"
                keyField="Open"
                allowToggle={true}
                template={(props: any) => (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="font-bold text-foreground">To Do</span>
                    <span className="ml-auto bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">
                      {props.count}
                    </span>
                  </div>
                )}
              />
              <ColumnDirective
                headerText="In Progress"
                keyField="In Progress"
                allowToggle={true}
                template={(props: any) => (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="font-bold text-foreground">
                      In Progress
                    </span>
                    <span className="ml-auto bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">
                      {props.count}
                    </span>
                  </div>
                )}
              />
              <ColumnDirective
                headerText="Testing"
                keyField="Testing"
                allowToggle={true}
                template={(props: any) => (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                    <span className="font-bold text-foreground">Testing</span>
                    <span className="ml-auto bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">
                      {props.count}
                    </span>
                  </div>
                )}
              />
              <ColumnDirective
                headerText="Done"
                keyField="Close"
                allowToggle={true}
                template={(props: any) => (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="font-bold text-foreground">Done</span>
                    <span className="ml-auto bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">
                      {props.count}
                    </span>
                  </div>
                )}
              />
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
