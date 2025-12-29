import { Layout } from "@/components/Layout";
import { useMetrics, useTasks } from "@/hooks/use-tasks";
import { MetricsCard } from "@/components/MetricsCard";
import { 
  SplitterComponent, 
  PanesDirective, 
  PaneDirective 
} from '@syncfusion/ej2-react-layouts';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layers 
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

  return (
    <Layout>
      <div className="space-y-8 h-full flex flex-col">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Project Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard
            title="Total Projects"
            value={metrics?.totalProjects ?? 0}
            icon={<Layers className="text-blue-600" size={24} />}
            colorClass="bg-blue-100 text-blue-600"
            trend={{ value: 12, isPositive: true }}
          />
          <MetricsCard
            title="In Progress"
            value={metrics?.inProgressTasks ?? 0}
            icon={<Clock className="text-amber-600" size={24} />}
            colorClass="bg-amber-100 text-amber-600"
            trend={{ value: 5, isPositive: true }}
          />
          <MetricsCard
            title="Completed"
            value={metrics?.completedTasks ?? 0}
            icon={<CheckCircle2 className="text-emerald-600" size={24} />}
            colorClass="bg-emerald-100 text-emerald-600"
            trend={{ value: 8, isPositive: true }}
          />
          <MetricsCard
            title="Critical Tasks"
            value={metrics?.criticalTasks ?? 0}
            icon={<AlertCircle className="text-rose-600" size={24} />}
            colorClass="bg-rose-100 text-rose-600"
            trend={{ value: 2, isPositive: false }}
          />
        </div>

        {/* Splitter Layout for Detailed View */}
        <div className="flex-1 bg-white rounded-2xl border border-border shadow-sm overflow-hidden relative min-h-[400px]">
          <SplitterComponent height="100%" width="100%" separatorSize={4}>
            <PanesDirective>
              <PaneDirective size="60%" min="30%" content={() => (
                <div className="h-full p-6 overflow-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-foreground">Task Distribution</h3>
                    <select className="text-sm border-border rounded-lg p-2 bg-secondary/50">
                      <option>This Week</option>
                      <option>This Month</option>
                    </select>
                  </div>
                  <div className="h-[300px] w-full">
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
              )}/>
              
              <PaneDirective size="40%" min="30%" content={() => (
                <div className="h-full bg-secondary/20 p-6 overflow-auto border-l border-border">
                  <h3 className="text-lg font-bold text-foreground mb-6">Recent Activities</h3>
                  <div className="space-y-4">
                    {tasks?.slice(0, 5).map((task) => (
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
              )}/>
            </PanesDirective>
          </SplitterComponent>
        </div>
      </div>
    </Layout>
  );
}
