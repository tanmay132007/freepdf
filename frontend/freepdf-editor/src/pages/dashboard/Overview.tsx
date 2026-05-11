
import React, { useEffect, useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { 
  Zap, Files, HardDrive, CreditCard, ArrowUpRight, 
  Clock, Download, ArrowRight, Sparkles 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { tools, iconMap } from '../../lib/tools';
import { motion } from 'motion/react';

export default function Overview() {
  const { profile, plan } = useUser();
  const [stats, setStats] = useState({
    opsToday: 0,
    opsLimit: 20,
    filesStored: 0,
    storageUsed: 0,
  });

  useEffect(() => {
    // Simulated fetch from API
    setStats({
      opsToday: 12,
      opsLimit: plan?.name === 'Pro' ? 200 : (plan?.name === 'Business' ? 1000 : 20),
      filesStored: 8,
      storageUsed: 45.2,
    });
  }, [plan]);

  const progress = (stats.opsToday / stats.opsLimit) * 100;
  const isHighUsage = progress > 80;

  const quickTools = tools.slice(0, 6);

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-syne">
            Welcome back, <span className="text-emerald-700">{profile?.full_name?.split(' ')[0] || 'User'}</span>!
          </h1>
          <p className="text-slate-500 font-medium">Here's what's happening with your PDF tools today.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm self-start">
          <div className={`h-2 w-2 rounded-full ${plan?.name ? 'bg-emerald-600 animate-pulse' : 'bg-slate-300'}`}></div>
          <span className="text-xs font-black uppercase tracking-widest text-slate-700">
            {plan?.name || 'Free Plan'}
          </span>
          {(!plan || plan.name === 'Free') && (
            <Link to="/pricing" className="ml-2 text-[10px] font-black uppercase tracking-widest text-emerald-700 hover:underline">
              Upgrade
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Operations Today', value: `${stats.opsToday} / ${stats.opsLimit}`, icon: Zap, color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Files Stored', value: stats.filesStored, icon: Files, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Storage Used', value: `${stats.storageUsed} MB`, icon: HardDrive, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Current Plan', value: plan?.name || 'Free', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`h-10 w-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Usage Progress */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Daily Usage Limit</h3>
            <p className="text-xs text-slate-400 font-medium">You have used {stats.opsToday} out of your {stats.opsLimit} daily operations.</p>
          </div>
          {(!plan || plan.name === 'Free') && (
            <Link to="/pricing" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-100">
              Upgrade for Unlimited <ArrowUpRight size={14} />
            </Link>
          )}
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full transition-all ${isHighUsage ? 'bg-emerald-600' : 'bg-emerald-700'}`}
          ></motion.div>
        </div>
        {isHighUsage && (
          <p className="mt-3 text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
            <Sparkles size={10} /> Running low on daily operations! Consider upgrading.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Recent Operations</h3>
            <Link to="/dashboard/history" className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
              View History <ArrowRight size={14} />
            </Link>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Tool</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { tool: 'Merge PDF', status: 'completed', date: '2 mins ago' },
                  { tool: 'AI Summarizer', status: 'completed', date: '1 hour ago' },
                  { tool: 'Compress PDF', status: 'failed', date: 'Yesterday' },
                  { tool: 'PDF to Word', status: 'completed', date: 'Mar 12' },
                  { tool: 'Protect PDF', status: 'completed', date: 'Mar 10' },
                ].map((op, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-all">
                          <Files size={14} />
                        </div>
                        <span className="text-sm font-bold text-slate-900">{op.tool}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        op.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {op.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-400">{op.date}</td>
                    <td className="px-6 py-4 text-right">
                      {op.status === 'completed' && (
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-700 transition-all">
                          <Download size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Quick Tools</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickTools.map((tool) => {
              const Icon = iconMap[tool.icon];
              return (
                <Link 
                  key={tool.slug}
                  to={`/tools/${tool.slug}`}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all group text-center space-y-3"
                >
                  <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mx-auto group-hover:bg-emerald-700 group-hover:text-white transition-all transform group-hover:scale-110">
                    <Icon size={18} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-900 truncate">
                    {tool.name}
                  </p>
                </Link>
              );
            })}
          </div>
          <Link 
            to="/" 
            className="block w-full text-center py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg"
          >
            Explore 29+ More Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
