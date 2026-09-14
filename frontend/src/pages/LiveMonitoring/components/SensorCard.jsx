import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function SensorCard({ title, value, unit, normalRange, status, time, trend }) {
  let statusColor = 'text-success';
  let bgColor = 'bg-green-50 border-green-200';
  
  if (status === 'warning') {
    statusColor = 'text-warning';
    bgColor = 'bg-yellow-50 border-yellow-200';
  } else if (status === 'critical') {
    statusColor = 'text-danger';
    bgColor = 'bg-red-50 border-red-200';
  } else if (status === 'offline') {
    statusColor = 'text-status-offline';
    bgColor = 'bg-card border-border';
  }

  let TrendIcon = Minus;
  let trendColor = 'text-slate-400';
  if (trend === 'up') {
    TrendIcon = ArrowUpRight;
    trendColor = 'text-danger'; // Assuming up is bad for things like turbidity/tds
  } else if (trend === 'down') {
    TrendIcon = ArrowDownRight;
    trendColor = 'text-success';
  }

  return (
    <div className={`rounded-lg border p-3 sm:p-4 shadow-sm ${bgColor}`}>
      <div className="flex justify-between items-start mb-1 sm:mb-2">
        <h3 className="text-xs sm:text-sm font-medium text-slate-700 leading-tight pr-1">{title}</h3>
        <TrendIcon className={`w-3 h-3 sm:w-4 sm:h-4 shrink-0 ${trendColor}`} />
      </div>
      <div className="flex items-baseline mb-1">
        <span className={`text-2xl sm:text-3xl font-bold ${statusColor}`}>{value}</span>
        <span className="ml-1 text-xs sm:text-sm font-medium text-muted">{unit}</span>
      </div>
      <div className="flex justify-between flex-wrap text-[10px] sm:text-xs text-muted mt-2 sm:mt-3 gap-1">
        <span>Range: {normalRange}</span>
        <span>{time}</span>
      </div>
    </div>
  );
}
