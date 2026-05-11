
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, 
  DollarSign, Settings, LogOut, ChevronLeft,
  Menu, X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Briefcase, label: 'Jobs', path: '/admin/jobs' },
  { icon: DollarSign, label: 'Revenue', path: '/admin/revenue' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-xl shadow-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 256 : 80 }}
        className={`fixed left-0 top-0 h-screen bg-slate-950 text-slate-400 z-50 border-r border-white/5 transition-all duration-300 ${!isOpen && 'items-center'}`}
      >
        <div className="h-full flex flex-col p-4">
          {/* Logo */}
          <div className={`p-4 mb-8 flex items-center ${isOpen ? 'gap-3' : 'justify-center'}`}>
            <div className="h-10 w-10 bg-emerald-700 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/20">
              <span className="text-white font-black text-xl font-syne">F</span>
            </div>
            {isOpen && (
              <div className="animate-fade-in">
                <p className="text-white font-black font-syne tracking-tighter">SavePDF</p>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600">Admin Panel</p>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all group ${
                    isActive 
                      ? 'bg-emerald-700/10 text-emerald-600 border border-emerald-600/10 shadow-lg shadow-emerald-900/5' 
                      : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon size={20} className={isActive ? 'text-emerald-600' : 'group-hover:text-white transition-colors'} />
                  {isOpen && (
                    <span className="text-sm font-bold tracking-tight animate-fade-in">{item.label}</span>
                  )}
                  {isActive && isOpen && (
                    <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 bg-emerald-700 rounded-full" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="mt-auto space-y-4 pt-4 border-t border-white/5">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 hover:text-white transition-all group"
            >
              <ChevronLeft size={20} className={`transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`} />
              {isOpen && <span className="text-sm font-bold animate-fade-in whitespace-nowrap">Collapse</span>}
            </button>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-3 rounded-xl text-slate-500 hover:bg-emerald-950/20 hover:text-emerald-600 transition-all group"
            >
              <LogOut size={20} />
              {isOpen && <span className="text-sm font-bold animate-fade-in">Logout</span>}
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
