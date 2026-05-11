
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Files, AlertCircle, Loader2, ArrowLeft, Mail } from 'lucide-react';
import { motion } from 'motion/react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/reset-password',
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden"
      >
        <div className="p-10 space-y-8">
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="h-10 w-10 bg-emerald-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <Files size={24} />
              </div>
              <span className="text-2xl font-bold text-slate-800 tracking-tight font-syne">SavePDF</span>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 font-syne tracking-tight">Reset password</h1>
            <p className="text-slate-500 font-medium text-sm">We'll send you a link to reset your password</p>
          </div>

          {error && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-2xl flex items-start gap-3 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {success ? (
            <div className="bg-green-50 border border-green-100 text-green-700 p-6 rounded-2xl space-y-4 text-center">
              <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <Mail size={24} />
              </div>
              <div className="space-y-1">
                <p className="font-bold">Check your inbox</p>
                <p className="text-sm font-medium">We've sent a password reset link to <br/> <span className="font-bold">{email}</span></p>
              </div>
              <Link to="/login" className="inline-flex items-center gap-2 text-green-700 font-bold text-sm hover:underline pt-2">
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-emerald-700 focus:ring-4 focus:ring-emerald-50 py-3.5 px-4 rounded-2xl outline-none transition-all font-medium text-slate-900 border"
                  required
                />
              </div>

              <button
                id="reset-btn"
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : 'Send Reset Link'}
              </button>

              <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
