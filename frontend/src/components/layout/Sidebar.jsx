import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  { path: '/supervisor/dashboard', icon: LayoutDashboard, labelKey: 'nav_dashboard' },
  { path: '/supervisor/live', icon: Activity, labelKey: 'nav_live_monitoring' },
  { path: '/supervisor/sites', icon: MapPin, labelKey: 'nav_sites_sources' },
  { path: '/supervisor/quality', icon: Droplet, labelKey: 'nav_water_quality' },
  { path: '/supervisor/modules', icon: Settings2, labelKey: 'nav_treatment_modules' },
  { path: '/supervisor/alerts', icon: Bell, labelKey: 'nav_alerts_incidents' },
  { path: '/supervisor/maintenance', icon: Wrench, labelKey: 'nav_maintenance' },
  { path: '/supervisor/analytics', icon: BarChart3, labelKey: 'nav_analytics_reports' },
  { path: '/supervisor/admin', icon: ShieldCheck, labelKey: 'nav_administration' },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-navy shrink-0">
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
                    {t(item.labelKey)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-white/10 shrink-0">
          <div className="space-y-2 mb-4">
            <Link 
              to="/"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-aqua/10 text-aqua hover:bg-aqua/20 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4 mr-3 shrink-0 text-aqua" />
              {t('public_home_page_sidebar')}
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors text-left"
            >
              <LogOut className="w-4 h-4 mr-3 shrink-0 text-red-400" />
              {t('lock_session')}
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
