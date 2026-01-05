import { Layout } from "@/components/Layout";
import { useMetrics, useTasks } from "@/hooks/use-tasks";
import { MetricsCard } from "@/components/MetricsCard";
import { DashboardLayoutComponent, PanelModel } from '@syncfusion/ej2-react-layouts';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layers,
  GripVertical
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useRef } from "react";

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useMetrics();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const dashboardRef = useRef<DashboardLayoutComponent>(null);

  if (metricsLoading || tasksLoading) {
    return (
      <Layout>
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  const statusCounts = tasks?.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = [
    { name: 'Open', value: statusCounts?.['Open'] || 0, color: '#6366f1' },
    { name: 'In Progress', value: statusCounts?.['In Progress'] || 0, color: '#f59e0b' },
    { name: 'Testing', value: statusCounts?.['Testing'] || 0, color: '#ec4899' },
    { name: 'Done', value: statusCounts?.['Close'] || 0, color: '#10b981' },
  ];

  const priorityCounts = tasks?.reduce((acc, task) => {
    acc[task.priority || 'Normal'] = (acc[task.priority || 'Normal'] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityData = [
    { name: 'Critical', value: priorityCounts?.['Critical'] || 0, color: '#ef4444' },
    { name: 'High', value: priorityCounts?.['High'] || 0, color: '#f97316' },
    { name: 'Normal', value: priorityCounts?.['Normal'] || 0, color: '#3b82f6' },
  ];

  const progressData = [
    { name: 'Week 1', completed: 3, inProgress: 5 },
    { name: 'Week 2', completed: 5, inProgress: 4 },
    { name: 'Week 3', completed: 8, inProgress: 6 },
    { name: 'Week 4', completed: 12, inProgress: 3 },
  ];

  const cellSpacing: [number, number] = [16, 16];

  const PanelHeader = ({ title }: { title: string }) => (
    <div className="e-panel-header flex items-center gap-2 p-3 bg-secondary/30 border-b border-border cursor-move">
      <GripVertical className="h-4 w-4 text-muted-foreground" />
      <span className="font-semibold text-foreground">{title}</span>
    </div>
  );

  const panels: PanelModel[] = [
    {
      id: 'metrics-projects',
      sizeX: 1,
      sizeY: 1,
      row: 0,
      col: 0,
      header: '<div class="panel-header">Total Projects</div>',
      content: '<div id="metrics-projects-content"></div>'
    },
    {
      id: 'metrics-progress',
      sizeX: 1,
      sizeY: 1,
      row: 0,
      col: 1,
      header: '<div class="panel-header">In Progress</div>',
      content: '<div id="metrics-progress-content"></div>'
    },
    {
      id: 'metrics-completed',
      sizeX: 1,
      sizeY: 1,
      row: 0,
      col: 2,
      header: '<div class="panel-header">Completed</div>',
      content: '<div id="metrics-completed-content"></div>'
    },
    {
      id: 'metrics-critical',
      sizeX: 1,
      sizeY: 1,
      row: 0,
      col: 3,
      header: '<div class="panel-header">Critical Tasks</div>',
      content: '<div id="metrics-critical-content"></div>'
    },
    {
      id: 'chart-distribution',
      sizeX: 2,
      sizeY: 2,
      row: 1,
      col: 0,
      header: '<div class="panel-header">Task Distribution</div>',
      content: '<div id="chart-distribution-content"></div>'
    },
    {
      id: 'chart-priority',
      sizeX: 2,
      sizeY: 2,
      row: 1,
      col: 2,
      header: '<div class="panel-header">Priority Breakdown</div>',
      content: '<div id="chart-priority-content"></div>'
    },
    {
      id: 'chart-progress',
      sizeX: 2,
      sizeY: 2,
      row: 3,
      col: 0,
      header: '<div class="panel-header">Weekly Progress</div>',
      content: '<div id="chart-progress-content"></div>'
    },
    {
      id: 'recent-activities',
      sizeX: 2,
      sizeY: 2,
      row: 3,
      col: 2,
      header: '<div class="panel-header">Recent Activities</div>',
      content: '<div id="recent-activities-content"></div>'
    }
  ];
  let resize = ['e-south-east', 'e-east', 'e-west', 'e-north', 'e-south'];
function onResizeStart() {
        console.log("Resize start");
    }
    //Dashboard Layout's drag event function
    function onResize(args) {
        // console.log("Resizing");
    }
    //Dashboard Layout's dragstop event function
    function onResizeStop(args) {
        console.log("Resize stop");
    }
  return (
    <Layout>
      <div className="space-y-6 h-full flex flex-col">

        <div className="flex-1 min-h-0">
          <DashboardLayoutComponent 
            ref={dashboardRef}
            id="dashboard-layout"
            cellSpacing={cellSpacing}
            columns={4}
            allowResizing={true}
            resizableHandles={resize} resizeStart={onResizeStart.bind(this)} resize={onResize.bind(this)} resizeStop={onResizeStop.bind(this)}
            cellAspectRatio={1.2}
            allowDragging={true}
            allowFloating={true}
            draggableHandle=".e-panel-header"
          >
            <div id="panel-metrics-projects" className="e-panel" data-row="0" data-col="0" data-sizex="1" data-sizey="1">
              <div className="e-panel-container">
                <PanelHeader title="Total Projects" />
                <div className="p-4 h-[100%]">
                  <MetricsCard
                    title="Total Projects"
                    value={metrics?.totalProjects ?? 0}
                    icon={<Layers className="text-blue-600" size={24} />}
                    colorClass="bg-blue-100 text-blue-600"
                    trend={{ value: 12, isPositive: true }}
                  />
                </div>
              </div>
            </div>

            <div id="panel-metrics-progress" className="e-panel" data-row="0" data-col="1" data-sizex="1" data-sizey="1">
              <div className="e-panel-container">
                <PanelHeader title="In Progress" />
                <div className="p-4 h-[100%]" >
                  <MetricsCard
                    title="In Progress"
                    value={metrics?.inProgressTasks ?? 0}
                    icon={<Clock className="text-amber-600" size={24} />}
                    colorClass="bg-amber-100 text-amber-600"
                    trend={{ value: 5, isPositive: true }}
                  />
                </div>
              </div>
            </div>

            <div id="panel-metrics-completed" className="e-panel" data-row="0" data-col="2" data-sizex="1" data-sizey="1">
              <div className="e-panel-container">
                <PanelHeader title="Completed" />
                <div className="p-4  h-[100%]">
                  <MetricsCard
                    title="Completed"
                    value={metrics?.completedTasks ?? 0}
                    icon={<CheckCircle2 className="text-emerald-600" size={24} />}
                    colorClass="bg-emerald-100 text-emerald-600"
                    trend={{ value: 8, isPositive: true }}
                  />
                </div>
              </div>
            </div>

            <div id="panel-metrics-critical" className="e-panel" data-row="0" data-col="3" data-sizex="1" data-sizey="1">
              <div className="e-panel-container">
                <PanelHeader title="Critical Tasks" />
                <div className="p-4" style={{ height:'100%'}}>
                  <MetricsCard
                    title="Critical Tasks"
                    value={metrics?.criticalTasks ?? 0}
                    icon={<AlertCircle className="text-rose-600" size={24} />}
                    colorClass="bg-rose-100 text-rose-600"
                    trend={{ value: 2, isPositive: false }}
                  />
                </div>
              </div>
            </div>

            <div id="panel-chart-distribution" className="e-panel" data-row="1" data-col="0" data-sizex="2" data-sizey="2">
              <div className="e-panel-container">
                <PanelHeader title="Task Distribution" />
                <div className="p-4 h-[calc(100%-48px)]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip 
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div id="panel-chart-priority" className="e-panel" data-row="1" data-col="2" data-sizex="2" data-sizey="2">
              <div className="e-panel-container">
                <PanelHeader title="Priority Breakdown" />
                <div className="p-4 h-[calc(100%-48px)] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={priorityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {priorityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div id="panel-chart-progress" className="e-panel" data-row="3" data-col="0" data-sizex="2" data-sizey="2">
              <div className="e-panel-container">
                <PanelHeader title="Weekly Progress" />
                <div className="p-4 h-[calc(100%-48px)]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2 }} />
                      <Line type="monotone" dataKey="inProgress" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div id="panel-recent-activities" className="e-panel" data-row="3" data-col="2" data-sizex="2" data-sizey="2">
              <div className="e-panel-container">
                <PanelHeader title="Recent Activities" />
                <div className="p-4 h-[calc(100%-48px)] overflow-auto">
                  <div className="space-y-3">
                    {tasks?.slice(0, 5).map((task) => (
                      <div key={task.id} className="bg-secondary/30 p-3 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium
                            ${task.status === 'Open' ? 'bg-blue-100 text-blue-700' : 
                              task.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                              task.status === 'Testing' ? 'bg-pink-100 text-pink-700' :
                              'bg-emerald-100 text-emerald-700'
                            }
                          `}>
                            {task.status}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(task.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-semibold text-foreground text-sm mb-1 line-clamp-1">{task.taskName}</h4>
                        <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full transition-all duration-500" 
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DashboardLayoutComponent>
        </div>
      </div>
    </Layout>
  );
}
