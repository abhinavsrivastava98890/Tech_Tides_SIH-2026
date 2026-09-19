import { Search, Menu, Bell, User, MapPin, Wifi, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function Topbar({ onMenuClick }) {
  const { t, i18n } = useTranslation();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
  };
  return (
    <header className="h-16 bg-navy text-white border-b border-white/10 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-md">
      
      {/* Search Bar & Mobile Menu */}
      <div className="flex-1 flex items-center">
        <button 
          onClick={onMenuClick}
          className="md:hidden mr-3 p-2 -ml-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="relative w-full max-w-[12rem] sm:max-w-[16rem] md:max-w-[24rem]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder={t('search_placeholder')}
            className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-md leading-5 bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-aqua focus:border-aqua text-sm transition-colors"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3 sm:space-x-6">
        
        {/* Location Selector */}
        <div className="hidden lg:flex items-center text-sm text-slate-300 hover:text-white cursor-pointer transition-colors">
          <MapPin className="h-4 w-4 mr-1 text-slate-400" />
          <span>{t('location_all_sites')}</span>
        </div>

        {/* Connection Status */}
        <div className="flex items-center text-sm text-green-400">
          <Wifi className="h-4 w-4 sm:mr-1" />
          <span className="font-medium hidden md:inline-block">{t('system_online')}</span>
        </div>

        <div className="w-px h-6 bg-white/10 hidden md:block"></div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative text-slate-300 hover:text-white transition-colors focus:outline-none"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-navy"></span>
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden transform origin-top-right transition-all">
              <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-semibold text-slate-800">Notifications</h3>
                <span className="text-xs text-blue-600 cursor-pointer hover:underline font-medium">Mark all read</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                <div className="px-4 py-3 border-b border-slate-100 bg-red-50/50 hover:bg-red-50 transition-colors cursor-pointer">
                  <p className="text-sm font-semibold text-red-700 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                    High Turbidity Detected
                  </p>
                  <p className="text-xs text-slate-600 mt-1 ml-4">Unit JR-001 has reported Turbidity &gt; 500 NTU.</p>
                  <p className="text-[10px] text-slate-400 mt-1 ml-4">2 mins ago</p>
                </div>
                <div className="px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                  <p className="text-sm font-semibold text-slate-800 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                    pH Level Warning
                  </p>
                  <p className="text-xs text-slate-500 mt-1 ml-4">Unit JR-045 is reporting acidic water (pH 5.2).</p>
                  <p className="text-[10px] text-slate-400 mt-1 ml-4">1 hr ago</p>
                </div>
                <div className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                  <p className="text-sm font-semibold text-slate-800 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                    System Maintenance
                  </p>
                  <p className="text-xs text-slate-500 mt-1 ml-4">Scheduled maintenance for East Zone complete.</p>
                  <p className="text-[10px] text-slate-400 mt-1 ml-4">Yesterday</p>
                </div>
              </div>
              <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-center">
                <span className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">View all alerts</span>
              </div>
            </div>
          )}
        </div>

        {/* Language Switcher */}
        <button 
          onClick={toggleLanguage}
          className="flex items-center text-sm text-slate-300 hover:text-white transition-colors"
          title={t('change_language')}
        >
          <Globe className="h-4 w-4 sm:mr-1 text-slate-400" />
          <span className="font-medium hidden sm:inline-block">EN / हिं</span>
        </button>

        {/* User Profile */}
        <button className="flex items-center text-sm focus:outline-none">
          <div className="h-8 w-8 rounded-full bg-aqua flex items-center justify-center text-white font-semibold shadow-sm">
            SA
          </div>
          <span className="ml-2 font-medium text-slate-200 hidden md:inline-block">{t('super_admin')}</span>
        </button>

      </div>
    </header>
  );
}
