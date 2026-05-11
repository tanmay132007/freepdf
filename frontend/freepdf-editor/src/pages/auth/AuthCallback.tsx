
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    // Check session explicitly
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      } else {
        // Wait a bit to give onAuthStateChange a chance to fire
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) navigate('/login?error=auth');
          });
        }, 2000);
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 size={40} className="animate-spin text-emerald-700 mx-auto" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Authenticating...</p>
      </div>
    </div>
  );
}
