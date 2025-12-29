import { Layout } from "@/components/Layout";
import { SplitterComponent, PaneDirective, PanesDirective } from '@syncfusion/ej2-react-layouts';
import { GanttChartCore } from "./GanttChart";
import { KanbanBoardCore } from "./KanbanBoard";

export default function SplitView() {
  return (
    <Layout>
      <div className="h-full flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interactive Split View</h1>
          <p className="text-muted-foreground">Edit tasks in Gantt or Kanban simultaneously.</p>
        </div>

        <div className="flex-1 min-h-0 bg-white dark:bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <SplitterComponent height="100%" orientation="Vertical">
            <PanesDirective>
              <PaneDirective size="50%" min="30%" content={() => (
                <div className="h-full p-2 overflow-auto">
                  <GanttChartCore />
                </div>
              )} />
              <PaneDirective size="50%" min="30%" content={() => (
                <div className="h-full p-2 overflow-auto">
                  <KanbanBoardCore />
                </div>
              )} />
            </PanesDirective>
          </SplitterComponent>
        </div>
      </div>
    </Layout>
  );
}
