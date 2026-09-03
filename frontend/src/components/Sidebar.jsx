import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  UtensilsCrossed, 
  UserCheck, 
  ClipboardCheck, 
  CreditCard, 
  Receipt, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  X,
  ShieldCheck
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Mess Plans', path: '/plans', icon: CalendarDays },
    { name: 'Subscriptions', path: '/subscriptions', icon: UtensilsCrossed },
    { name: 'Walk-in Guests', path: '/guests', icon: UserCheck },
    { name: 'Attendance Register', path: '/attendance', icon: ClipboardCheck },
    { name: 'Payments & Ledger', path: '/ledger', icon: CreditCard },
    { name: 'Expense Tracker', path: '/expenses', icon: Receipt },
    { name: 'Reports Hub', path: '/reports', icon: BarChart3 },
    { name: 'WhatsApp Center', path: '/whatsapp', icon: MessageSquare },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-slate-900/95 backdrop-blur-md border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-none tracking-tight">Mess<span className="text-indigo-400">Master</span></h1>
              <span className="text-[10px] uppercase font-semibold text-emerald-400 tracking-wider">Canteen OS</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'}
                `}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

          <div className="pt-6 px-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/20">
              <div className="flex items-center gap-2 text-indigo-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-semibold">WhatsApp Gateway</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Live Meta API integrated for OTPs & Payment Reminders.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
