import { Layout } from "@/components/Layout";
import {
  SplitterComponent,
  PaneDirective,
  PanesDirective,
} from "@syncfusion/ej2-react-layouts";
import { GanttChartCore } from "./GanttChart";
import { KanbanBoardCore } from "./KanbanBoard";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@/hooks/use-tasks";

export default function SplitView() {
  const { data: tasks, isLoading } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

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
        {/* <div>
          <h1 className="text-3xl font-bold text-foreground">Interactive Split View</h1>
          <p className="text-muted-foreground">Edit tasks in Gantt or Kanban simultaneously.</p>
        </div> */}

        <div className="flex-1 min-h-0 bg-white dark:bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <SplitterComponent height="100%" orientation="Vertical">
            <PanesDirective>
              <PaneDirective
                size="50%"
                min="30%"
                content={() => (
                  <div id="ME20" className="h-full p-2 overflow-auto">
                    <GanttChartCore
                      tasks={tasks}
                      isLoading={isLoading}
                      createTask={createTask}
                      updateTask={updateTask}
                      deleteTask={deleteTask}
                    />
                  </div>
                )}
              />
              <PaneDirective
                size="50%"
                min="30%"
                content={() => (
                  <div id="ME20" className="h-full p-2 overflow-auto">
                    <KanbanBoardCore
                      tasks={tasks}
                      isLoading={isLoading}
                      updateTask={updateTask}
                      deleteTask={deleteTask}
                    />
                  </div>
                )}
              />
            </PanesDirective>
          </SplitterComponent>
        </div>
      </div>
    </Layout>
  );
}
