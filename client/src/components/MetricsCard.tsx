import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass: string;
}

export function MetricsCard({ title, value, icon, trend, colorClass }: MetricsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 group" style={{height: '100%'}}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 text-opacity-100 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend.isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
            {trend.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-display font-bold text-foreground tracking-tight">{value}</h3>
      </div>
    </div>
  );
}
