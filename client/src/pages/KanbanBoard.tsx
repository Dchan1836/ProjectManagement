import { Layout } from "@/components/Layout";
import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import {
  CalendarComponent,
  DateTimePicker,
  DatePickerComponent,
} from "@syncfusion/ej2-react-calendars";
import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
  CardSettingsModel,
} from "@syncfusion/ej2-react-kanban";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FilterX, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TextBoxComponent,
  NumericTextBoxComponent,
  SmartTextAreaComponent,
} from "@syncfusion/ej2-react-inputs";
import {
  DropDownListComponent,
  AutoCompleteComponent,
} from "@syncfusion/ej2-react-dropdowns";

export const cardSettings: CardSettingsModel = {
  contentField: "taskName",
  headerField: "taskId",
  tagsField: "priority",
  grabberField: "color",
  footerCssField: "className",
};
const CustomDialogTemplate = (props: any): JSX.Element => {
  // Access data fields using props
  const assignees = ["Jane Doe", "Alex Smith"];
  return (
    <div className="custom-dialog-template">
      <table>
        <tbody>
          <tr>
            <td className="e-label">ID</td>
            <td>
              <TextBoxComponent
                id="taskId"
                value={props.taskId}
                enabled={false}
                className="e-field"
              />
            </td>
          </tr>
          <tr>
            <td className="e-label">Status</td>
            <td>
              {/* Example DropDownList for Status */}
              <DropDownListComponent
                id="status"
                value={props.status}
                dataSource={["Open", "InProgress", "Testing", "Close"]}
                className="e-field"
              />
            </td>
          </tr>
          <tr>
            <td className="e-label">Start</td>
            <td>
              {/* Example DropDownList for Status */}
              <DatePickerComponent
                id="startDate"
                value={props.startDate}
                className="e-field"
              />
            </td>
          </tr>
          <tr>
            <td className="e-label">End</td>
            <td>
              {/* Example DropDownList for Status */}
              <DatePickerComponent
                id="endDate"
                value={props.endDate}
                className="e-field"
              />
            </td>
          </tr>
          <tr>
            <td className="e-label">Priority</td>
            <td>
              {/* Example DropDownList for Status */}
              <DropDownListComponent
                id="priority"
                value={props.priority}
                dataSource={["Low", "Normal", "High", "Critical"]}
                className="e-field"
              />
            </td>
          </tr>
          <tr>
            <td className="e-label">Progress</td>
            <td>
              {/* Example DropDownList for Status */}
              <NumericTextBoxComponent
                id="progress"
                value={props.progress}
                placeholder="Enter a number"
                min={0}
                max={100}
                step={1}
                className="e-field"
              />
            </td>
          </tr>
          <tr>
            <td className="e-label">Duration</td>

            <td>
              {/* Example DropDownList for Status */}
              <NumericTextBoxComponent
                id="duration"
                value={props.duration}
                placeholder="Enter a number"
                min={0}
                max={100}
                step={1}
                className="e-field"
              />
            </td>
          </tr>
          <tr>
            <td className="e-label">Assignee</td>
            <td>
              <DropDownListComponent
                id="assignee"
                value={props.assignee}
                placeholder=""
                dataSource={assignees}
                className="e-field"
              />
            </td>
          </tr>
          <tr>
            <td className="e-label">WBS</td>
            <td>
              <SmartTextAreaComponent
                id="wbs"
                value={props.wbs}
                placeholder=""
                className="e-field"
              />
            </td>
          </tr>
          <tr>
            <td className="e-label">Notes</td>
            <td>
              <SmartTextAreaComponent
                id="info"
                value={props.info}
                placeholder=""
                rows={4}
                cols={60}
                className="e-field"
              />
            </td>
          </tr>
          {/* Add more fields as needed (e.g., Priority, Assignee, Summary) */}
        </tbody>
      </table>
    </div>
  );
};
const CustomDatePicker = (props) => {
  // 'props' will contain the current data of the card being edited
  {
    console.log(`CalendarComponent: ${props.endDate}`);
  }
  return (
    <DatePickerComponent
      id="endDate"
      value={new Date(props.endDate)} // Bind the field value
      format="dd/MM/yyyy" // Set your desired format here
      placeholder="Enter date"
      // Ensure two-way binding if needed for the component's internal logic
    />
  );
};

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

    const getRoleColor = (role: string) => {
      if (role === "Developer") {
        return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400";
      } else if (role === "Construction") {
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400";
      }
      return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400";
    };

    const roles = Array.isArray(props.role)
      ? props.role
      : props.role
        ? [props.role]
        : [];

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
      <div id="MyE-Card" className="e-card-content p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-mono text-muted-foreground">
            #{props.taskId}
            {props.wbs ? ` | WBS: ${props.wbs}` : ""}
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {roles.map((role: string, index: number) => (
              <span
                key={index}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRoleColor(role)}`}
              >
                {role}
              </span>
            ))}
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
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
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
            duration: Number(cardData.duration) || null,
            parentId: Number(cardData.parentId) || null,
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

  const dialogFields = [
    { text: "Task ID", key: "taskId", type: "TextBox" },
    {
      text: "Task Name",
      key: "taskName",
      type: "TextArea",
      validationRules: { required: true },
    },
    { text: "Status", key: "status", type: "DropDown" },
    { text: "Role", key: "role", type: "TextBox" },
    { text: "Priority", key: "priority", type: "TextBox" },
    { text: "Progress", key: "progress", type: "Numeric" },
    { text: "Assignee", key: "assignee", type: "DropDown" },
    { text: "Start Date", key: "startDate", type: "TextBox" },
    { text: "End Date", key: "endDate", type: "TextBox" },
    { text: "Duration", key: "duration", type: "Numeric" },
    { text: "Parent ID", key: "parentId", type: "Numeric" },
    { text: "Predecessor", key: "predecessor", type: "TextBox" },
    { text: "WBS", key: "wbs", type: "TextBox" },
    { text: "Info", key: "info", type: "TextArea" },
  ];

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatDateToMMDDYYYY = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const tasksWithTaskId = tasks?.map((task: any) => ({
    ...task,
    taskId: task.id,
    startDate: formatDateToMMDDYYYY(task.startDate),
    endDate: formatDateToMMDDYYYY(task.endDate),
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
    const taskRoles = Array.isArray(task.role)
      ? task.role
      : task.role
        ? [task.role]
        : [];
    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "both"
        ? taskRoles.includes("Developer") && taskRoles.includes("Construction")
        : taskRoles.includes(roleFilter));

    return matchesSearch && matchesPriority && matchesAssignee && matchesRole;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setPriorityFilter("all");
    setAssigneeFilter("all");
    setRoleFilter("all");
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
      {/* {showHeader && (
        <div>
          <h1 className="text-3xl font-bold text-foreground">Task Board</h1>
          <p className="text-muted-foreground">
            Visualize and optimize your workflow.
          </p>
        </div>
      )} */}
      <div className="flex items-center gap-2 flex-wrap">
        <ButtonComponent
          onClick={toggleSwimlanes}
          cssClass="e-info e-small"
          style={{ width: "150px" }}
        >
          {swimlaneKey.keyField === "assignee"
            ? "Disable Swimlanes"
            : "Enable Swimlanes (by Assignee)"}
        </ButtonComponent>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          data-testid="button-toggle-filters-kanban"
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
        <div className="text-sm text-muted-foreground">
          Showing {filteredTasks?.length} tasks
        </div>
      </div>

      {showFilters && (
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

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger
                className="w-[150px]"
                data-testid="select-role-filter-kanban"
              >
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Construction">Construction</SelectItem>
                <SelectItem value="both">Both Roles</SelectItem>
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
          </div>
        </div>
      )}

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
              roleFilter,
              taskCount: tasks?.length,
            })}
            cardSettings={{ ...cardSettings, template: cardTemplate }}
            swimlaneSettings={swimlaneKey}
            dialogSettings={{ template: CustomDialogTemplate }}
            //dialogOpen={handleDialogOpen}
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
