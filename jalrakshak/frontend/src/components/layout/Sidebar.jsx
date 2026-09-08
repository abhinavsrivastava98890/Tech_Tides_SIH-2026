import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  MapPin, 
  Droplet, 
  Settings2, 
  Bell, 
  Wrench, 
  BarChart3, 
  ShieldCheck,
  X
} from 'lucide-react';

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/live', icon: Activity, label: 'Live Monitoring' },
  { path: '/sites', icon: MapPin, label: 'Sites & Sources' },
  { path: '/quality', icon: Droplet, label: 'Water Quality' },
  { path: '/modules', icon: Settings2, label: 'Treatment Modules' },
  { path: '/alerts', icon: Bell, label: 'Alerts & Incidents' },
  { path: '/maintenance', icon: Wrench, label: 'Maintenance' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics & Reports' },
  { path: '/admin', icon: ShieldCheck, label: 'Administration' },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9998] bg-slate-900/80 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`
        fixed inset-y-0 left-0 z-[9999] w-64 bg-brand-navy text-slate-300 flex flex-col h-full border-r border-slate-800 transition-transform duration-300 ease-in-out
        md:static md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900 shrink-0">
          <div className="flex items-center">
            <Droplet className="text-brand-teal w-6 h-6 mr-2 shrink-0" />
            <span className="text-xl font-bold text-white">JalRakshak</span>
          </div>
          <button 
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-brand-blue text-white' 
                        : 'hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 shrink-0 ${isActive ? 'text-brand-teal' : 'text-slate-400'}`} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 shrink-0">
          <p>JalRakshak Platform</p>
          <p>v1.0.0 (Production)</p>
        </div>
      </aside>
    </>
  );
}
