import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  X,
  LogOut,
  Home
} from 'lucide-react';

const menuItems = [
  { path: '/supervisor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/supervisor/live', icon: Activity, label: 'Live Monitoring' },
  { path: '/supervisor/sites', icon: MapPin, label: 'Sites & Sources' },
  { path: '/supervisor/quality', icon: Droplet, label: 'Water Quality' },
  { path: '/supervisor/modules', icon: Settings2, label: 'Treatment Modules' },
  { path: '/supervisor/alerts', icon: Bell, label: 'Alerts & Incidents' },
  { path: '/supervisor/maintenance', icon: Wrench, label: 'Maintenance' },
  { path: '/supervisor/analytics', icon: BarChart3, label: 'Analytics & Reports' },
  { path: '/supervisor/admin', icon: ShieldCheck, label: 'Administration' },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('supervisor_auth');
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9998] bg-navy/80 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`
        fixed inset-y-0 left-0 z-[9999] w-64 bg-navy text-slate-100 flex flex-col h-full border-r border-navy transition-transform duration-300 ease-in-out
        md:static md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#1E293B] bg-navy shrink-0">
          <div className="flex items-center">
            <Droplet className="text-aqua w-6 h-6 mr-2 shrink-0" />
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
                        ? 'bg-primary text-white shadow-sm' 
                        : 'hover:bg-white/10 hover:text-white text-slate-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 shrink-0 ${isActive ? 'text-white' : 'text-slate-200'}`} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-[#1E293B] shrink-0">
          <div className="space-y-2 mb-4">
            <Link 
              to="/"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 hover:text-white transition-colors text-slate-100"
            >
              <Home className="w-4 h-4 mr-3 shrink-0 text-slate-200" />
              Public Home Page
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-red-500/20 hover:text-red-100 transition-colors text-left text-slate-100"
            >
              <LogOut className="w-4 h-4 mr-3 shrink-0 text-slate-200" />
              Lock Session
            </button>
          </div>
          <div className="text-xs text-blue-100/70">
            <p>JalRakshak Platform</p>
            <p>v2.0.0 (Production)</p>
          </div>
        </div>
      </aside>
    </>
  );
}
