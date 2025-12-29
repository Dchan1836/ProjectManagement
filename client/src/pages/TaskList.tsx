import { Layout } from "@/components/Layout";
import { useTasks } from "@/hooks/use-tasks";
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
import { Search, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TaskList() {
  const { data: tasks, isLoading } = useTasks();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

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
    const matchesSearch = task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (task.wbs && task.wbs.includes(searchTerm)) ||
                          task.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === "all" || task.assignee === assigneeFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setAssigneeFilter("all");
  };

  return (
    <Layout>
      <div className="h-full flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Tasks</h1>
          <p className="text-muted-foreground">Comprehensive list of all project tasks and their data.</p>
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
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
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
              <SelectTrigger className="w-[150px]">
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
              <SelectTrigger className="w-[150px]">
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
            >
              <FilterX className="h-4 w-4 mr-2" />
              Reset
            </Button>
            
            <div className="ml-auto text-sm text-muted-foreground">
              Showing {filteredTasks?.length} tasks
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl border border-border shadow-sm overflow-hidden overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
              <TableRow>
                <TableHead className="w-[80px]">WBS</TableHead>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Task Name</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                    No tasks found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks?.map((task: any) => (
                  <TableRow key={task.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-mono">{task.wbs || "-"}</TableCell>
                    <TableCell className="font-mono text-muted-foreground">#{task.id}</TableCell>
                    <TableCell className="font-medium">{task.taskName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{task.assignee || "-"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground italic max-w-[200px] truncate">{task.info || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        task.status === 'Close' ? 'bg-green-50 text-green-700 border-green-200' :
                        task.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        task.status === 'Testing' ? 'bg-pink-50 text-pink-700 border-pink-200' :
                        'bg-gray-50 text-gray-700 border-gray-200'
                      }>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        task.priority === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' :
                        task.priority === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        task.priority === 'Normal' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-gray-50 text-gray-700 border-gray-200'
                      }>
                        {task.priority || 'Normal'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{format(new Date(task.startDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell className="text-muted-foreground">{format(new Date(task.endDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              task.progress === 100 ? 'bg-green-500' :
                              task.progress > 50 ? 'bg-blue-500' : 'bg-orange-400'
                            }`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground w-8">{task.progress}%</span>
                      </div>
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
