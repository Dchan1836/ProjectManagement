import { Layout } from "@/components/Layout";
import { useMetrics, useTasks } from "@/hooks/use-tasks";
import { MetricsCard } from "@/components/MetricsCard";
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layers,
  GripHorizontal
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useMetrics();
  const { data: tasks, isLoading: tasksLoading } = useTasks();

  if (metricsLoading || tasksLoading) {
    return (
      <Layout>
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // Calculate chart data from tasks
  const statusCounts = tasks?.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = [
    { name: 'Open', value: statusCounts?.['Open'] || 0, color: '#6366f1' },
    { name: 'In Progress', value: statusCounts?.['In Progress'] || 0, color: '#f59e0b' },
    { name: 'Testing', value: statusCounts?.['Testing'] || 0, color: '#ec4899' },
    { name: 'Close', value: statusCounts?.['Close'] || 0, color: '#10b981' },
  ];

  const layouts = {
    lg: [
      { i: 'metric-1', x: 0, y: 0, w: 3, h: 2 },
      { i: 'metric-2', x: 3, y: 0, w: 3, h: 2 },
      { i: 'metric-3', x: 6, y: 0, w: 3, h: 2 },
      { i: 'metric-4', x: 9, y: 0, w: 3, h: 2 },
      { i: 'chart-distribution', x: 0, y: 2, w: 8, h: 8 },
      { i: 'recent-activity', x: 8, y: 2, w: 4, h: 8 },
    ],
  };

  return (
    <Layout>
      <div className="h-full flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Project Overview</h1>
          <p className="text-muted-foreground">Welcome back! Drag and resize components to customize your view.</p>
        </div>

        <ResponsiveGridLayout
          className="layout flex-1"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          draggableHandle=".drag-handle"
        >
          <div key="metric-1">
            <div className="h-full group relative">
              <div className="drag-handle absolute top-2 right-2 p-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <GripHorizontal size={14} className="text-muted-foreground" />
              </div>
              <MetricsCard
                title="Total Projects"
                value={metrics?.totalProjects ?? 0}
                icon={<Layers className="text-blue-600" size={24} />}
                colorClass="bg-blue-100 text-blue-600"
                trend={{ value: 12, isPositive: true }}
              />
            </div>
          </div>
          <div key="metric-2">
            <div className="h-full group relative">
              <div className="drag-handle absolute top-2 right-2 p-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <GripHorizontal size={14} className="text-muted-foreground" />
              </div>
              <MetricsCard
                title="In Progress"
                value={metrics?.inProgressTasks ?? 0}
                icon={<Clock className="text-amber-600" size={24} />}
                colorClass="bg-amber-100 text-amber-600"
                trend={{ value: 5, isPositive: true }}
              />
            </div>
          </div>
          <div key="metric-3">
            <div className="h-full group relative">
              <div className="drag-handle absolute top-2 right-2 p-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <GripHorizontal size={14} className="text-muted-foreground" />
              </div>
              <MetricsCard
                title="Completed"
                value={metrics?.completedTasks ?? 0}
                icon={<CheckCircle2 className="text-emerald-600" size={24} />}
                colorClass="bg-emerald-100 text-emerald-600"
                trend={{ value: 8, isPositive: true }}
              />
            </div>
          </div>
          <div key="metric-4">
            <div className="h-full group relative">
              <div className="drag-handle absolute top-2 right-2 p-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <GripHorizontal size={14} className="text-muted-foreground" />
              </div>
              <MetricsCard
                title="Critical Tasks"
                value={metrics?.criticalTasks ?? 0}
                icon={<AlertCircle className="text-rose-600" size={24} />}
                colorClass="bg-rose-100 text-rose-600"
                trend={{ value: 2, isPositive: false }}
              />
            </div>
          </div>

          <div key="chart-distribution" className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden group">
            <div className="h-full flex flex-col p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="drag-handle p-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripHorizontal size={16} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Task Distribution</h3>
                </div>
                <select className="text-sm border-border rounded-lg p-2 bg-secondary/50">
                  <option>This Week</option>
                  <option>This Month</option>
                </select>
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                    <Tooltip 
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={50}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div key="recent-activity" className="bg-secondary/20 rounded-2xl border border-border shadow-sm overflow-hidden group">
            <div className="h-full flex flex-col p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="drag-handle p-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripHorizontal size={16} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Recent Activities</h3>
              </div>
              <div className="flex-1 overflow-auto space-y-4 pr-2">
                {tasks?.slice(0, 8).map((task) => (
                  <div key={task.id} className="bg-white p-4 rounded-xl border border-border/50 shadow-sm hover:border-primary/30 transition-colors">
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
                    <h4 className="font-semibold text-foreground mb-1 line-clamp-1">{task.taskName}</h4>
                    <div className="w-full bg-secondary h-2 rounded-full mt-2 overflow-hidden">
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
        </ResponsiveGridLayout>
      </div>
    </Layout>
  );
}

