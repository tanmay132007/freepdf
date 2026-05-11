
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Files, Chrome, AlertCircle, Loader2, Check } from 'lucide-react';
import { motion } from 'motion/react';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };

  const strengthColor = ['bg-slate-200', 'bg-emerald-600', 'bg-yellow-500', 'bg-green-500'];
  const strengthText = ['', 'Weak', 'Good', 'Strong'];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 text-center space-y-6"
        >
          <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <Check size={40} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 font-syne">Check your email</h1>
          <p className="text-slate-500 font-medium">
            We've sent a confirmation link to <span className="text-slate-900 font-bold">{email}</span>. 
            Please click the link to activate your account.
          </p>
          <Link to="/login" className="block w-full bg-slate-900 text-white font-bold py-4 rounded-2xl">
            Back to Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-slate-900 font-syne tracking-tight">Create account</h1>
            <p className="text-slate-500 font-medium text-sm">Join SavePDF today and start editing</p>
          </div>

          {error && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-2xl flex items-start gap-3 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-emerald-700 focus:ring-4 focus:ring-emerald-50 py-3.5 px-4 rounded-2xl outline-none transition-all font-medium text-slate-900 border"
                required
              />
            </div>

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
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-emerald-700 focus:ring-4 focus:ring-emerald-50 py-3.5 px-4 rounded-2xl outline-none transition-all font-medium text-slate-900 border"
                required
              />
              <div className="flex gap-1 mt-2">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className={`h-1 flex-1 rounded-full ${i <= getPasswordStrength() ? strengthColor[getPasswordStrength()] : strengthColor[0]}`}
                  />
                ))}
              </div>
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1 pl-1">
                Strength: <span className={strengthText[getPasswordStrength()] === 'Strong' ? 'text-green-500' : ''}>{strengthText[getPasswordStrength()]}</span>
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-emerald-700 focus:ring-4 focus:ring-emerald-50 py-3.5 px-4 rounded-2xl outline-none transition-all font-medium text-slate-900 border"
                required
              />
            </div>

            <button
              id="signup-btn"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-2 mt-6 active:scale-95"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Create Account'}
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
            onClick={handleGoogleSignup}
            className="w-full bg-white border border-slate-200 hover:border-slate-300 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-slate-50 font-bold text-slate-700 active:scale-95"
          >
            <Chrome size={20} />
            Google
          </button>

          <p className="text-center text-sm font-medium text-slate-500 pt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-700 font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
