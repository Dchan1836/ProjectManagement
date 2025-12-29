import { Layout } from "@/components/Layout";
import { useTasks } from "@/hooks/use-tasks";
import { 
  KanbanComponent, 
  ColumnsDirective, 
  ColumnDirective,
  CardSettingsModel
} from '@syncfusion/ej2-react-kanban';

export default function KanbanBoard() {
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

  const cardSettings: CardSettingsModel = {
    contentField: 'taskName',
    headerField: 'id',
    tagsField: 'priority',
    grabberField: 'color',
    footerCssField: 'className'
  };

  const cardTemplate = (props: any) => {
    const priorityColor = 
      props.priority === 'Critical' ? 'bg-red-100 text-red-700 border-red-200' :
      props.priority === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200' :
      props.priority === 'Normal' ? 'bg-blue-100 text-blue-700 border-blue-200' :
      'bg-gray-100 text-gray-700 border-gray-200';

    return (
      <div className="e-card-content p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-mono text-muted-foreground">{props.wbs ? `WBS: ${props.wbs}` : `#${props.id}`}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityColor}`}>
            {props.priority || 'Normal'}
          </span>
        </div>
        <div className="e-card-header-title font-semibold text-foreground mb-3 text-sm leading-tight">
          {props.taskName}
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-[10px] text-white">
              JD
            </div>
            <div className="w-6 h-6 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-[10px] text-white">
              AS
            </div>
          </div>
          <div className={`text-xs font-medium ${
            props.progress === 100 ? 'text-green-600' : 'text-muted-foreground'
          }`}>
            {props.progress}%
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="h-full flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Task Board</h1>
          <p className="text-muted-foreground">Visualize and optimize your workflow.</p>
        </div>

        <div className="flex-1 overflow-x-auto pb-4">
          <div className="h-full min-w-[1000px] bg-transparent">
            <KanbanComponent
              id="kanban"
              keyField="status"
              dataSource={tasks}
              cardSettings={{ ...cardSettings, template: cardTemplate }}
              swimlaneSettings={{ keyField: 'assignee' }}
              height="100%"
              style={{ backgroundColor: 'transparent' }}
            >
              <ColumnsDirective>
                <ColumnDirective headerText="To Do" keyField="Open" allowToggle={true} template={(props: any) => (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="font-bold text-foreground">To Do</span>
                      <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{props.count}</span>
                    </div>
                )}/>
                <ColumnDirective headerText="In Progress" keyField="In Progress" allowToggle={true} template={(props: any) => (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <span className="font-bold text-foreground">In Progress</span>
                      <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{props.count}</span>
                    </div>
                )}/>
                <ColumnDirective headerText="Testing" keyField="Testing" allowToggle={true} template={(props: any) => (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                      <span className="font-bold text-foreground">Testing</span>
                      <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{props.count}</span>
                    </div>
                )}/>
                <ColumnDirective headerText="Done" keyField="Close" allowToggle={true} template={(props: any) => (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="font-bold text-foreground">Done</span>
                      <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{props.count}</span>
                    </div>
                )}/>
              </ColumnsDirective>
            </KanbanComponent>
          </div>
        </div>
      </div>
    </Layout>
  );
}
