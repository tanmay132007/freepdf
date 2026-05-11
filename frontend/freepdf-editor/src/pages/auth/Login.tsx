
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Files, Chrome, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback',
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
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
            <h1 className="text-3xl font-bold text-slate-900 font-syne tracking-tight">Welcome back</h1>
            <p className="text-slate-500 font-medium text-sm">Enter your credentials to access your account</p>
          </div>

          {error && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-2xl flex items-start gap-3 text-sm animate-shake">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
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
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between pl-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" className="text-xs font-bold text-emerald-700 hover:underline">Forgot password?</Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-emerald-700 focus:ring-4 focus:ring-emerald-50 py-3.5 px-4 rounded-2xl outline-none transition-all font-medium text-slate-900 border"
                required
              />
            </div>

            <button
              id="login-btn"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-2 mt-6 active:scale-95"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="bg-white px-4 text-slate-400">or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-slate-200 hover:border-slate-300 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-slate-50 font-bold text-slate-700 active:scale-95"
          >
            <Chrome size={20} />
            Google
          </button>

          <p className="text-center text-sm font-medium text-slate-500 pt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-emerald-700 font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
