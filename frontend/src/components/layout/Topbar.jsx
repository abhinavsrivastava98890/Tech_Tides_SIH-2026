import { Search, MapPin, Wifi, Bell, Globe, User, Menu } from 'lucide-react';

export default function Topbar({ onMenuClick }) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0">
      
      {/* Search Bar & Mobile Menu */}
      <div className="flex-1 flex items-center">
        <button 
          onClick={onMenuClick}
          className="md:hidden mr-3 p-2 -ml-2 text-muted hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="relative w-full max-w-[24rem]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-card placeholder-slate-400 focus:outline-none focus:bg-card focus:ring-1 focus:ring-accent focus:border-accent text-sm transition-colors"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-6">
        
        {/* Location Selector */}
        <div className="hidden md:flex items-center text-sm text-muted hover:text-text cursor-pointer transition-colors">
          <MapPin className="h-4 w-4 mr-1 text-slate-400" />
          <span>Jharkhand (All Sites)</span>
        </div>

        {/* Connection Status */}
        <div className="flex items-center text-sm text-success">
          <Wifi className="h-4 w-4 mr-1" />
          <span className="font-medium hidden md:inline-block">System Online</span>
        </div>

        <div className="w-px h-6 bg-slate-200 hidden md:block"></div>

        {/* Notifications */}
        <button className="relative text-slate-400 hover:text-muted transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-danger ring-2 ring-white"></span>
        </button>

        {/* Language Switcher */}
        <button className="flex items-center text-sm text-muted hover:text-text transition-colors">
          <Globe className="h-4 w-4 mr-1 text-slate-400" />
          <span className="font-medium">EN / हिं</span>
        </button>

        {/* User Profile */}
        <button className="flex items-center text-sm focus:outline-none">
          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-white font-semibold">
            SA
          </div>
          <span className="ml-2 font-medium text-slate-700 hidden md:inline-block">Super Admin</span>
        </button>

      </div>
    </header>
  );
}
