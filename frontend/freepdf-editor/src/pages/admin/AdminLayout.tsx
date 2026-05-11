
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdminSidebar from './AdminSidebar';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      // Check for admin role in metadata or a users table
      // For this demo, we check user_metadata or assume admin if email matches
      // In production, you'd use a database check
      const isAdminUser = user.user_metadata?.role === 'admin' || user.email === 'tanmayrajput400@gmail.com';
      
      if (!isAdminUser) {
        setIsAdmin(false);
        setLoading(false);
      } else {
        setIsAdmin(true);
        setLoading(false);
      }
    }

    checkAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-700" size={32} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="h-20 w-20 bg-emerald-700/10 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto">
            <ShieldAlert size={40} />
          </div>
          <h1 className="text-3xl font-black text-white font-syne">Access Denied</h1>
          <p className="text-slate-400 font-medium">You do not have the required permissions to access this area. Restricted to administrators only.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-white text-slate-950 rounded-xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main className="flex-1 ml-20 lg:ml-64 p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}
