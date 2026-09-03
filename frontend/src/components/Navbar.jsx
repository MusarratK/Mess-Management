import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, LogOut, Search, QrCode, MessageSquare, UserCheck } from 'lucide-react';

const Navbar = ({ onToggleSidebar, onOpenQrScanner, onSearchCustomer }) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearchCustomer) {
      onSearchCustomer(searchQuery.trim());
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Quick Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer by name, mobile, or scan RegNo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </form>
      </div>

      {/* Right: Quick Action Controls & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick QR Counter Scanner Button */}
        <button
          onClick={onOpenQrScanner}
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition active:scale-95"
          title="Open Live Counter Barcode/QR Scanner"
        >
          <QrCode className="w-4 h-4" />
          <span className="hidden sm:inline">Counter Check-In</span>
        </button>

        {/* Admin Profile & Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-white leading-tight">{user?.name || 'Administrator'}</div>
            <div className="text-[10px] text-slate-400 uppercase font-medium">{user?.role || 'ADMIN'}</div>
          </div>
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded-xl transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
