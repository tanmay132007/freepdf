
import React from 'react';
import { useUser } from '../../hooks/useUser';
import { 
  CreditCard, Check, Shield, Zap, Sparkles, 
  ArrowUpRight, Clock, HelpCircle, AlertCircle 
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Billing() {
  const { profile, plan } = useUser();

  const plans = [
    { name: 'Free', price: '0', description: 'Perfect for quick, casual PDF tasks.', features: ['20 daily operations', 'Up to 50MB file size', 'Standard processing', 'No storage'] },
    { name: 'Pro', price: '12', description: 'Advanced tools for professionals.', features: ['Unlimited daily operations', 'Up to 500MB file size', 'Priority processing', '30 days file storage', 'AI Tools included'] },
    { name: 'Business', price: '49', description: 'For teams requiring maximum scale.', features: ['All Pro features', 'Unlimited storage', 'Dedicated support', 'API Access', 'Custom branding'] },
  ];

  const currentPlanIndex = plans.findIndex(p => p.name === (plan?.name || 'Free'));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-syne">Billing & Plan</h1>
        <p className="text-slate-500 font-medium">Manage your subscription and billing information.</p>
      </div>

      {/* Current Plan Overview */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Current Plan
            </div>
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-slate-900">{plan?.name || 'Free Plan'}</h2>
              <p className="text-slate-500 font-medium">
                {plan?.name ? `Your next billing date is ${new Date().toLocaleDateString()}` : 'You are currently on the Free tier.'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-slate-50 text-slate-900 font-bold py-3 px-8 rounded-2xl border border-slate-200 hover:bg-white transition-all active:scale-95 flex items-center justify-center gap-2">
              View Invoices
            </button>
            <button className="bg-slate-900 text-white font-bold py-3 px-8 rounded-2xl shadow-xl transition-all hover:bg-slate-800 active:scale-95 flex items-center justify-center gap-2">
              <CreditCard size={18} /> Manage Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Available Plans</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((p, i) => {
            const isCurrent = i === currentPlanIndex;
            const isHigher = i > currentPlanIndex;
            
            return (
              <motion.div 
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white rounded-3xl p-8 border hover:shadow-xl transition-all flex flex-col ${
                  isCurrent ? 'ring-4 ring-emerald-50 border-emerald-200 shadow-lg' : 'border-slate-100 shadow-sm'
                }`}
              >
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-black text-slate-900 font-syne">{p.name}</h4>
                    {isCurrent && (
                      <span className="bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900 font-syne">${p.price}</span>
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">/ month</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{p.description}</p>
                </div>

                <ul className="space-y-4 flex-1 mb-8">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-xs font-medium text-slate-600">
                      <div className="h-5 w-5 bg-green-50 text-green-600 rounded-lg flex items-center justify-center shrink-0">
                        <Check size={12} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <button 
                  disabled={isCurrent}
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 ${
                    isCurrent 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : isHigher 
                        ? 'bg-emerald-700 text-white shadow-xl shadow-emerald-100 hover:bg-emerald-800' 
                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : isHigher ? 'Upgrade Now' : 'Downgrade'}
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* FAQ / Info Section */}
      <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden">
        <Sparkles className="absolute top-10 right-10 text-white/10" size={120} />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl">
              <HelpCircle size={24} />
            </div>
            <h3 className="text-xl font-bold font-syne">Have questions about billing?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-2">
              <p className="font-bold text-emerald-500">Can I cancel anytime?</p>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">Yes, you can cancel your subscription at any time from your billing settings. You'll keep access until the end of your billing period.</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-emerald-500">Do you offer educational discounts?</p>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">Absolutely! Contact our support team with your institutional email to receive 50% off our Pro plan.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
