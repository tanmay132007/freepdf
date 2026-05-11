
import React, { useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { 
  User, Mail, Shield, Trash2, Camera, Check, 
  AlertCircle, Loader2, Key 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';

export default function Settings() {
  const { profile, user } = useUser();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ full_name: fullName })
        .eq('id', user.id);
      
      if (error) throw error;
      setFeedback({ type: 'success', message: 'Profile updated successfully' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    setPasswordLoading(true);
    setFeedback(null);
    
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setFeedback({ type: 'success', message: 'Password updated successfully' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-syne">Account Settings</h1>
        <p className="text-slate-500 font-medium">Manage your personal information and security preferences.</p>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl flex items-start gap-3 text-sm animate-fade-in ${
          feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
        }`}>
          {feedback.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          <p className="font-bold">{feedback.message}</p>
        </div>
      )}

      {/* Profile Section */}
      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-emerald-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Update your name and avatar</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="shrink-0 flex flex-col items-center gap-4">
              <div className="h-24 w-24 bg-slate-100 rounded-3xl border border-slate-200 flex items-center justify-center text-slate-400 relative group cursor-pointer hover:bg-slate-50 transition-all">
                <User size={40} />
                <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={20} className="text-white" />
                </div>
              </div>
              <button type="button" className="text-[10px] font-black uppercase tracking-widest text-emerald-700 hover:underline">Change Photo</button>
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-700 focus:ring-4 focus:ring-emerald-50 py-3 pl-12 pr-4 rounded-2xl outline-none transition-all font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5 opacity-60">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-slate-50 border border-slate-200 py-3 pl-12 pr-4 rounded-2xl font-medium text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              disabled={loading}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white font-bold py-3 px-10 rounded-2xl shadow-xl shadow-emerald-200 transition-all flex items-center gap-2 active:scale-95"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><Check size={18} /> Save Changes</>}
            </button>
          </div>
        </form>
      </section>

      {/* Security Section */}
      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Security</h2>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Update your password</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">New Password</label>
              <div className="relative">
                <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-700 focus:ring-4 focus:ring-emerald-50 py-3 pl-12 pr-4 rounded-2xl outline-none transition-all font-medium text-slate-900"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Confirm New Password</label>
              <div className="relative">
                <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-700 focus:ring-4 focus:ring-emerald-50 py-3 pl-12 pr-4 rounded-2xl outline-none transition-all font-medium text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              disabled={passwordLoading}
              className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white font-bold py-3 px-10 rounded-2xl shadow-xl transition-all flex items-center gap-2 active:scale-95"
            >
              {passwordLoading ? <Loader2 size={18} className="animate-spin" /> : 'Update Password'}
            </button>
          </div>
        </form>
      </section>

      {/* Danger Zone */}
      <section className="bg-emerald-50 rounded-3xl border border-emerald-100 shadow-sm overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
              <AlertCircle size={20} /> Danger Zone
            </h2>
            <p className="text-sm font-medium text-emerald-800">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <button className="shrink-0 bg-white hover:bg-emerald-700 hover:text-white text-emerald-700 font-bold py-3 px-8 rounded-2xl border border-emerald-200 transition-all shadow-sm active:scale-95 flex items-center gap-2">
            <Trash2 size={18} /> Delete Account
          </button>
        </div>
      </section>
    </div>
  );
}
