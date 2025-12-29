import { Layout } from "@/components/Layout";
import { useTasks } from "@/hooks/use-tasks";
import { 
  GanttComponent, 
  Inject, 
  Selection as GanttSelection, 
  Toolbar as GanttToolbar, 
  Edit as GanttEdit, 
  Filter as GanttFilter, 
  Sort as GanttSort, 
  Resize as GanttResize, 
  DayMarkers,
  ColumnsDirective as GanttColumnsDirective,
  ColumnDirective as GanttColumnDirective
} from '@syncfusion/ej2-react-gantt';
import { 
  KanbanComponent, 
  ColumnsDirective as KanbanColumnsDirective, 
  ColumnDirective as KanbanColumnDirective,
  CardSettingsModel
} from '@syncfusion/ej2-react-kanban';
import { SplitterComponent, PaneDirective, PanesDirective } from '@syncfusion/ej2-react-layouts';

export default function SplitView() {
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

  // Gantt Settings
  const taskFields = {
    id: 'id',
    name: 'taskName',
    startDate: 'startDate',
    endDate: 'endDate',
    duration: 'duration',
    progress: 'progress',
    parentID: 'parentId',
    dependency: 'predecessor',
    status: 'status',
    wbs: 'wbs'
  };

  const ganttEditSettings = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    allowTaskbarEditing: true,
    showDeleteConfirmDialog: true
  };

  const ganttToolbar = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'];

  // Kanban Settings
  const cardSettings: CardSettingsModel = {
    contentField: 'taskName',
    headerField: 'id',
    tagsField: 'priority',
  };

  return (
    <Layout>
      <div className="h-full flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interactive Split View</h1>
          <p className="text-muted-foreground">Edit tasks in Gantt or Kanban simultaneously.</p>
        </div>

        <div className="flex-1 min-h-0 bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <SplitterComponent height="100%" orientation="Vertical">
            <PanesDirective>
              <PaneDirective size="50%" min="30%" content={() => (
                <div className="h-full p-2">
                  <GanttComponent
                    dataSource={tasks}
                    taskFields={taskFields}
                    height="100%"
                    treeColumnIndex={1}
                    toolbar={ganttToolbar}
                    editSettings={ganttEditSettings}
                    gridLines="Both"
                    splitterSettings={{ position: '30%' }}
                  >
                    <GanttColumnsDirective>
                      <GanttColumnDirective field='wbs' headerText='WBS' width='60'></GanttColumnDirective>
                      <GanttColumnDirective field='id' headerText='ID' width='60'></GanttColumnDirective>
                      <GanttColumnDirective field='taskName' headerText='Task Name' width='150'></GanttColumnDirective>
                      <GanttColumnDirective field='status' headerText='Status' width='100'></GanttColumnDirective>
                      <GanttColumnDirective field='progress' headerText='Progress' width='100'></GanttColumnDirective>
                    </GanttColumnsDirective>
                    <Inject services={[GanttSelection, GanttToolbar, GanttEdit, GanttFilter, GanttSort, GanttResize, DayMarkers]} />
                  </GanttComponent>
                </div>
              )} />
              <PaneDirective size="50%" min="30%" content={() => (
                <div className="h-full p-2 overflow-auto">
                  <KanbanComponent
                    id="kanban_split"
                    keyField="status"
                    dataSource={tasks}
                    cardSettings={cardSettings}
                    height="100%"
                  >
                    <KanbanColumnsDirective>
                      <KanbanColumnDirective headerText="To Do" keyField="Open" />
                      <KanbanColumnDirective headerText="In Progress" keyField="In Progress" />
                      <KanbanColumnDirective headerText="Testing" keyField="Testing" />
                      <KanbanColumnDirective headerText="Done" keyField="Close" />
                    </KanbanColumnsDirective>
                  </KanbanComponent>
                </div>
              )} />
            </PanesDirective>
          </SplitterComponent>
        </div>
      </div>
    </Layout>
  );
}
