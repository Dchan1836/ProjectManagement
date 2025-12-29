import { Layout } from "@/components/Layout";
import { useTasks } from "@/hooks/use-tasks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function TaskList() {
  const { data: tasks, isLoading } = useTasks();

  if (isLoading) {
    return (
      <Layout>
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-full flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Tasks</h1>
          <p className="text-muted-foreground">Comprehensive list of all project tasks and their data.</p>
        </div>

        <div className="flex-1 bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">WBS</TableHead>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Task Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks?.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-mono">{task.wbs || "-"}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">#{task.id}</TableCell>
                  <TableCell className="font-medium">{task.taskName}</TableCell>
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
                  <TableCell>{format(new Date(task.startDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(new Date(task.endDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[60px]">
                        <div
                          className={`h-full rounded-full ${
                            task.progress === 100 ? 'bg-green-500' :
                            task.progress > 50 ? 'bg-blue-500' : 'bg-orange-400'
                          }`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{task.progress}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
