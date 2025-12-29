import { Layout } from "@/components/Layout";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { useRef } from "react";
import { SplitterComponent, PaneDirective, PanesDirective } from '@syncfusion/ej2-react-layouts';
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
import { taskFields, editSettings, toolbar, progressTemplate } from "./GanttChart";
import { KanbanView } from "./KanbanBoard";
import { useToast } from "@/hooks/use-toast";

export default function SplitView() {
  const { data: tasks, isLoading } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const { toast } = useToast();
  const ganttInstance = useRef<GanttComponent>(null);

  const handleGanttActionComplete = (args: any) => {
    if (args.requestType === 'save' && args.action === 'add') {
      const taskData = args.data;
      createTask.mutate({
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
      }, {
        onSuccess: () => toast({ title: "Task created" }),
        onError: () => toast({ title: "Failed to create task", variant: "destructive" }),
      });
    } else if (args.requestType === 'save' && args.action === 'edit') {
      const taskData = args.data;
      updateTask.mutate({
        id: taskData.id,
        data: {
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
        },
      }, {
        onSuccess: () => toast({ title: "Task updated" }),
        onError: () => toast({ title: "Failed to update task", variant: "destructive" }),
      });
    } else if (args.requestType === 'delete') {
      const taskData = args.data?.[0];
      if (taskData?.id) {
        deleteTask.mutate(taskData.id, {
          onSuccess: () => toast({ title: "Task deleted" }),
          onError: () => toast({ title: "Failed to delete task", variant: "destructive" }),
        });
      }
    }
  };

  const handleKanbanDragStop = (args: any) => {
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
          <h1 className="text-3xl font-bold text-foreground">Interactive Split View</h1>
          <p className="text-muted-foreground">Edit tasks in Gantt Chart or drag cards in Kanban simultaneously.</p>
        </div>

        <div className="flex-1 min-h-0 bg-white dark:bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <SplitterComponent height="100%" orientation="Vertical">
            <PanesDirective>
              <PaneDirective size="50%" min="30%" content={() => (
                <div className="h-full p-2">
                  <GanttComponent
                    ref={ganttInstance}
                    dataSource={tasks}
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
                    splitterSettings={{ position: '40%' }}
                    rowHeight={40}
                    taskbarHeight={26}
                    actionComplete={handleGanttActionComplete}
                  >
                    <ColumnsDirective>
                      <ColumnDirective field='wbs' headerText='WBS' width='60' textAlign='Left' />
                      <ColumnDirective field='id' headerText='ID' width='50' textAlign='Left' />
                      <ColumnDirective field='taskName' headerText='Task Name' width='180' clipMode='EllipsisWithTooltip' />
                      <ColumnDirective field='assignee' headerText='Assignee' width='100' />
                      <ColumnDirective field='status' headerText='Status' width='90' />
                      <ColumnDirective field='priority' headerText='Priority' width='80' />
                      <ColumnDirective field='startDate' headerText='Start' width='90' format='yMd' textAlign='Right' />
                      <ColumnDirective field='endDate' headerText='End' width='90' format='yMd' textAlign='Right' />
                      <ColumnDirective field='progress' headerText='Progress' width='100' template={progressTemplate} textAlign='Left' />
                    </ColumnsDirective>
                    <Inject services={[Selection, Toolbar, Edit, Filter, Sort, Resize, DayMarkers]} />
                  </GanttComponent>
                </div>
              )} />
              <PaneDirective size="50%" min="30%" content={() => (
                <div className="h-full p-2">
                  <KanbanView 
                    filteredTasks={tasks}
                    searchTerm=""
                    priorityFilter="all"
                    assigneeFilter="all"
                    resetFilters={{
                      setSearchTerm: () => {},
                      setPriorityFilter: () => {},
                      setAssigneeFilter: () => {},
                      reset: () => {}
                    }}
                    onDragStop={handleKanbanDragStop}
                    compact={true}
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
