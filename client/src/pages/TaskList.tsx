import { Layout } from "@/components/Layout";
import { useTasks, useUpdateTask } from "@/hooks/use-tasks";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Search, FilterX, Download, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface EditingCell {
  taskId: number;
  field: string;
}

export default function TaskList() {
  const { data: tasks, isLoading } = useTasks();
  const updateTask = useUpdateTask();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue] = useState<string>("");
//   let taskListCopy1;
//   const { data: taskListCopy1 } = useTasks();
  const [taskListCopy1, setTaskListCopy1] = useState();
  let taskListCopy2;
  let taskListCopy3;
//   let currentIndex: number = 0;

  const [currentIndex, setCurrentIndex] = useState(0);
  if (isLoading) {
    return (
      <Layout>
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  const filteredTasks = tasks?.filter((task: any) => {
    const matchesSearch =
      task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.wbs && task.wbs.includes(searchTerm)) ||
      task.id.toString().includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    const matchesAssignee =
      assigneeFilter === "all" || task.assignee === assigneeFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setAssigneeFilter("all");
  };

  const exportToExcel = () => {
    if (!filteredTasks) return;

    const exportData = filteredTasks.map((task: any) => ({
      WBS: task.wbs || "",
      ID: task.id,
      "Task Name": task.taskName,
      Assignee: task.assignee || "",
      Info: task.info || "",
      Status: task.status,
      Priority: task.priority || "Normal",
      "Start Date": format(new Date(task.startDate), "yyyy-MM-dd"),
      "End Date": format(new Date(task.endDate), "yyyy-MM-dd"),
      "Progress (%)": task.progress,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
    XLSX.writeFile(
      workbook,
      `project_tasks_${format(new Date(), "yyyyMMdd")}.xlsx`,
    );
  };

  const startEditing = (taskId: number, field: string, currentValue: any) => {
    setEditingCell({ taskId, field });
    setEditValue(currentValue?.toString() || "");
  };

  const cancelEditing = () => {
    setEditingCell(null);
    setEditValue("");
  };
  const createCopy = () => {
      setCurrentIndex((currentIndex + 1) % 3);
      console.log("create copy " + currentIndex);
        switch (currentIndex) {
          case 0:{
              console.log("case 0");
              setTaskListCopy1(JSON.parse(JSON.stringify(tasks)));
              break;
            }
          case 1:{
              console.log("case 1");
              break;
            }
          case 2:{
              console.log("case 2");
              break;
            }
          default:{
              console.log("default case");
              break;
              }

        }
    };

  const saveEdit = (taskId: number, field: string) => {
      console.log("save task list");
//       console.log(tasks);
      console.log(taskListCopy1);
      createCopy();
      console.log(taskListCopy1);
    let value: any = editValue;

    if (field === "progress" || field === "duration" || field === "parentId") {
      value = editValue ? parseInt(editValue) : null;
    } else if (field === "startDate" || field === "endDate") {
      value = new Date(editValue);
    }

    updateTask.mutate(
      {
        id: taskId,
        data: { [field]: value },
      },
      {
        onSuccess: () => {
          toast({ title: "Task updated" });
          setEditingCell(null);
          setEditValue("");
        },
        onError: () => {
          toast({ title: "Failed to update task", variant: "destructive" });
        },
      },
    );
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    taskId: number,
    field: string,
  ) => {
    if (e.key === "Enter") {
      saveEdit(taskId, field);
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  const renderEditableCell = (
    task: any,
    field: string,
    displayValue: any,
    className?: string,
  ) => {
    const isEditing =
      editingCell?.taskId === task.id && editingCell?.field === field;

    if (isEditing) {
      if (field === "status") {
        return (
          <Select
            value={editValue}
            onValueChange={(val) => {
              setEditValue(val);
            }}
          >
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Testing">Testing</SelectItem>
              <SelectItem value="Close">Done</SelectItem>
            </SelectContent>
          </Select>
        );
      }
      if (field === "priority") {
        return (
          <Select
            value={editValue}
            onValueChange={(val) => {
              setEditValue(val);
            }}
          >
            <SelectTrigger className="h-8 w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Normal">Normal</SelectItem>
            </SelectContent>
          </Select>
        );
      }
      if (field === "assignee") {
        return (
          <Select
            value={editValue}
            onValueChange={(val) => {
              setEditValue(val);
            }}
          >
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Jane Doe">Jane Doe</SelectItem>
              <SelectItem value="Alex Smith">Alex Smith</SelectItem>
            </SelectContent>
          </Select>
        );
      }
      if (field === "startDate" || field === "endDate") {
        return (
          <Input
            type="date"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, task.id, field)}
            className="h-8 w-[140px]"
            autoFocus
          />
        );
      }
      if (field === "progress") {
        return (
          <Input
            type="number"
            min={0}
            max={100}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, task.id, field)}
            className="h-8 w-[70px]"
            autoFocus
          />
        );
      }
      return (
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, task.id, field)}
          className="h-8"
          autoFocus
        />
      );
    }

    return (
      <div
        className={`cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5 -mx-1 ${className || ""}`}
        onClick={() => {
          let val = task[field];
          if (field === "startDate" || field === "endDate") {
            val = format(new Date(task[field]), "yyyy-MM-dd");
          }
          startEditing(task.id, field, val);
        }}
        data-testid={`cell-${field}-${task.id}`}
      >
        {displayValue}
      </div>
    );
  };

  return (
    <Layout>
      <div className="h-full flex flex-col space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* <div>
            <h1 className="text-3xl font-bold text-foreground">All Tasks</h1>
            <p className="text-muted-foreground">Click any cell to edit. Press Enter to save, Escape to cancel.</p>
          </div> */}
          <div className="flex gap-2">
            {editingCell && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  onClick={() =>
                    saveEdit(editingCell.taskId, editingCell.field)
                  }
                  data-testid="button-save-edit"
                >
                  <Check className="h-4 w-4 mr-1" /> Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={cancelEditing}
                  data-testid="button-cancel-edit"
                >
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
              </div>
            )}
            <Button
              onClick={exportToExcel}
              className="gap-2"
              data-testid="button-export"
            >
              <Download className="h-4 w-4" />
              Export Spreadsheet
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, WBS or ID..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className="w-[150px]"
                data-testid="select-status-filter"
              >
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

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger
                className="w-[150px]"
                data-testid="select-priority-filter"
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
                data-testid="select-assignee-filter"
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
              data-testid="button-reset-filters"
            >
              <FilterX className="h-4 w-4 mr-2" />
              Reset
            </Button>

            <div className="ml-auto text-sm text-muted-foreground">
              Showing {filteredTasks?.length} tasks
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white dark:bg-card rounded-2xl border border-border shadow-sm overflow-hidden overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white dark:bg-card z-10 shadow-sm">
              <TableRow>
                <TableHead className="w-[80px]">WBS</TableHead>
                <TableHead className="w-[60px]">ID</TableHead>
                <TableHead className="min-w-[200px]">Task Name</TableHead>
                <TableHead className="w-[120px]">Assignee</TableHead>
                <TableHead className="min-w-[150px]">Info</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[100px]">Priority</TableHead>
                <TableHead className="w-[130px]">Start Date</TableHead>
                <TableHead className="w-[130px]">End Date</TableHead>
                <TableHead className="w-[120px]">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No tasks found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks?.map((task: any) => (
                  <TableRow
                    key={task.id}
                    className="hover:bg-muted/30 transition-colors"
                    data-testid={`row-task-${task.id}`}
                  >
                    <TableCell className="font-mono">
                      {renderEditableCell(task, "wbs", task.wbs || "-")}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      #{task.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {renderEditableCell(task, "taskName", task.taskName)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {renderEditableCell(
                        task,
                        "assignee",
                        task.assignee || "-",
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground italic max-w-[200px]">
                      {renderEditableCell(
                        task,
                        "info",
                        task.info || "-",
                        "truncate",
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCell?.taskId === task.id &&
                      editingCell?.field === "status" ? (
                        renderEditableCell(task, "status", task.status)
                      ) : (
                        <div
                          className="cursor-pointer"
                          onClick={() =>
                            startEditing(task.id, "status", task.status)
                          }
                          data-testid={`cell-status-${task.id}`}
                        >
                          <Badge
                            variant="outline"
                            className={
                              task.status === "Close"
                                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400"
                                : task.status === "In Progress"
                                  ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
                                  : task.status === "Testing"
                                    ? "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400"
                                    : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400"
                            }
                          >
                            {task.status}
                          </Badge>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCell?.taskId === task.id &&
                      editingCell?.field === "priority" ? (
                        renderEditableCell(task, "priority", task.priority)
                      ) : (
                        <div
                          className="cursor-pointer"
                          onClick={() =>
                            startEditing(
                              task.id,
                              "priority",
                              task.priority || "Normal",
                            )
                          }
                          data-testid={`cell-priority-${task.id}`}
                        >
                          <Badge
                            variant="outline"
                            className={
                              task.priority === "Critical"
                                ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400"
                                : task.priority === "High"
                                  ? "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400"
                                  : task.priority === "Normal"
                                    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400"
                            }
                          >
                            {task.priority || "Normal"}
                          </Badge>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {renderEditableCell(
                        task,
                        "startDate",
                        format(new Date(task.startDate), "MMM dd, yyyy"),
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {renderEditableCell(
                        task,
                        "endDate",
                        format(new Date(task.endDate), "MMM dd, yyyy"),
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCell?.taskId === task.id &&
                      editingCell?.field === "progress" ? (
                        renderEditableCell(task, "progress", task.progress)
                      ) : (
                        <div
                          className="flex items-center gap-2 min-w-[100px] cursor-pointer"
                          onClick={() =>
                            startEditing(task.id, "progress", task.progress)
                          }
                          data-testid={`cell-progress-${task.id}`}
                        >
                          <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                task.progress === 100
                                  ? "bg-green-500"
                                  : task.progress > 50
                                    ? "bg-blue-500"
                                    : "bg-orange-400"
                              }`}
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground w-8">
                            {task.progress}%
                          </span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
