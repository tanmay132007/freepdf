
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FolderOpen, Clock, Settings, CreditCard, 
  LogOut, Files, User, ChevronRight 
} from 'lucide-react';
import { useUser } from '../../hooks/useUser';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'My Files', icon: FolderOpen, path: '/dashboard/files' },
  { label: 'History', icon: Clock, path: '/dashboard/history' },
  { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
  { label: 'Billing', icon: CreditCard, path: '/dashboard/billing' },
];

export function Sidebar() {
  const location = useLocation();
  const { profile, signOut } = useUser();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 bg-emerald-700 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:rotate-6 transition-all">
            <Files size={20} />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight font-syne">SavePDF</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-700 pl-3' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-900'} />
              {item.label}
              {isActive && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-400">
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{profile?.full_name || 'User'}</p>
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500"></span>
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                  {profile?.plans?.name || 'Free Plan'}
                </span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-white hover:text-emerald-700 hover:border-emerald-100 transition-all"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
