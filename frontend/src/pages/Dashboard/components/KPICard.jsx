export default function KPICard({ title, value, subtitle, icon: Icon, colorClass }) {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-3 sm:p-5 flex items-center">
      <div className={`p-2 sm:p-3 rounded-full ${colorClass} bg-opacity-10 mr-3 sm:mr-4`}>
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <h3 className="text-xs sm:text-sm font-medium text-muted leading-tight">{title}</h3>
        <div className="flex items-baseline mt-1">
          <p className="text-xl sm:text-2xl font-semibold text-text">{value}</p>
          {subtitle && <p className="ml-1 sm:ml-2 text-xs sm:text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
