import { Layout } from "@/components/Layout";
import { useTasks } from "@/hooks/use-tasks";
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

export default function GanttChart() {
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

  const taskFields = {
    id: 'id',
    name: 'taskName',
    startDate: 'startDate',
    endDate: 'endDate',
    duration: 'duration',
    progress: 'progress',
    parentID: 'parentId',
    dependency: 'predecessor'
  };

  const editSettings = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    allowTaskbarEditing: true,
    showDeleteConfirmDialog: true
  };

  const toolbar = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search'];

  // Add custom template for the progress bar
  const progressTemplate = (props: any) => {
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

  return (
    <Layout>
      <div className="h-full flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Project Timeline</h1>
            <p className="text-muted-foreground">Manage project schedules and dependencies.</p>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-primary/30 transition-all active:scale-95">
            Export Report
          </button>
        </div>

        <div className="flex-1 bg-white rounded-2xl border border-border shadow-sm overflow-hidden p-1">
          <GanttComponent
            dataSource={tasks}
            taskFields={taskFields}
            height="100%"
            treeColumnIndex={1}
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
            rowHeight={45}
            taskbarHeight={30}
          >
            <ColumnsDirective>
              <ColumnDirective field='id' headerText='ID' width='70' textAlign='Left'></ColumnDirective>
              <ColumnDirective field='taskName' headerText='Task Name' width='250' clipMode='EllipsisWithTooltip'></ColumnDirective>
              <ColumnDirective field='startDate' headerText='Start Date' width='120' format='yMd' textAlign='Right'></ColumnDirective>
              <ColumnDirective field='endDate' headerText='End Date' width='120' format='yMd' textAlign='Right'></ColumnDirective>
              <ColumnDirective field='duration' headerText='Duration' width='90' textAlign='Right'></ColumnDirective>
              <ColumnDirective field='progress' headerText='Progress' width='120' template={progressTemplate} textAlign='Left'></ColumnDirective>
            </ColumnsDirective>
            <Inject services={[Selection, Toolbar, Edit, Filter, Sort, Resize, DayMarkers]} />
          </GanttComponent>
        </div>
      </div>
    </Layout>
  );
}
