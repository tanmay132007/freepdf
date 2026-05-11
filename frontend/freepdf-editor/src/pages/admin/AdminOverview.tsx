
import React, { useEffect, useState } from 'react';
import { 
  Users, Zap, CreditCard, DollarSign, 
  ArrowUpRight, ArrowDownRight, RefreshCw,
  Clock, CheckCircle, AlertCircle, ArrowRight
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar,
  Cell, AreaChart, Area
} from 'recharts';
import { motion } from 'motion/react';

const statsData = [
  { label: 'Total Users', value: '48,291', trend: '+12.5%', isUp: true, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Ops Today', value: '12,842', trend: '+4.2%', isUp: true, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { label: 'Pro Subs', value: '3,492', trend: '-1.2%', isUp: false, icon: CreditCard, color: 'text-green-500', bg: 'bg-green-500/10' },
  { label: 'Daily Rev', value: '$2,840', trend: '+18.1%', isUp: true, icon: DollarSign, color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

const chartData = [
  { name: 'Mon', ops: 4000, success: 3800 },
  { name: 'Tue', ops: 3000, success: 2900 },
  { name: 'Wed', ops: 2000, success: 1950 },
  { name: 'Thu', ops: 2780, success: 2700 },
  { name: 'Fri', ops: 1890, success: 1800 },
  { name: 'Sat', ops: 2390, success: 2300 },
  { name: 'Sun', ops: 3490, success: 3400 },
];

const toolUsageData = [
  { name: 'Merge PDF', value: 4500 },
  { name: 'Compress', value: 3800 },
  { name: 'PDF to Word', value: 3200 },
  { name: 'Protect', value: 2800 },
  { name: 'Edit PDF', value: 2400 },
  { name: 'Fill & Sign', value: 2100 },
  { name: 'Unlock', value: 1800 },
  { name: 'Watermark', value: 1500 },
  { name: 'Rotate', value: 1200 },
  { name: 'Split', value: 900 },
];

const recentJobs = [
  { id: 'job_2841', tool: 'Merge PDF', status: 'completed', user: 'admin@free.com', time: '14:20', duration: '120ms' },
  { id: 'job_2840', tool: 'Compress', status: 'processing', user: 'tanmay@test.com', time: '14:19', duration: '—' },
  { id: 'job_2839', tool: 'PDF to Doc', status: 'failed', user: 'guest_921', time: '14:15', duration: '450ms' },
  { id: 'job_2838', tool: 'Protect', status: 'completed', user: 'pro_user_44', time: '14:12', duration: '85ms' },
  { id: 'job_2837', tool: 'Merge PDF', status: 'completed', user: 'dev@test.io', time: '14:10', duration: '105ms' },
];

export default function AdminOverview() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 font-syne tracking-tight">Dashboard Overview</h1>
          <p className="text-sm font-medium text-slate-400">Real-time platform statistics and activity metrics.</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:shadow-lg hover:shadow-slate-200/50 transition-all active:scale-95"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className={`h-12 w-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 font-black text-[10px] uppercase tracking-widest ${stat.isUp ? 'text-green-500' : 'text-emerald-600'}`}>
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 font-syne">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Operations Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 font-syne tracking-tight">System Operations</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-emerald-700 rounded-full"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Successful</span>
              </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F8A64" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0F8A64" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  itemStyle={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="ops" stroke="#0F8A64" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="success" stroke="#22c55e" strokeWidth={3} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tool Usage Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
          <h3 className="text-xl font-black text-slate-900 font-syne tracking-tight">Top Used Tools</h3>
          <div className="h-80 w-full py-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={toolUsageData}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 800, fill: '#475569', textAnchor: 'start' }} 
                  width={100}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                  {toolUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#0F8A64' : '#f1f5f9'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        {/* Recent Jobs Table */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden auto-refresh-indicator relative">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 font-syne tracking-tight">Live Job Stream</h3>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Updating</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Job ID</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Tool</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Time</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentJobs.map((job) => (
                  <tr key={job.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5">
                      <span className="text-xs font-black font-mono text-slate-400 group-hover:text-emerald-700 transition-colors">{job.id}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-slate-900 group-hover:translate-x-1 transition-transform inline-block">{job.tool}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-medium text-slate-500">{job.user}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{job.time}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 ${
                        job.status === 'completed' ? 'bg-green-100 text-green-700' :
                        job.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {job.status === 'completed' && <CheckCircle size={10} />}
                        {job.status === 'processing' && <RefreshCw size={10} className="animate-spin" />}
                        {job.status === 'failed' && <AlertCircle size={10} />}
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Signups */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
          <h3 className="text-xl font-black text-slate-900 font-syne tracking-tight">New Members</h3>
          <div className="space-y-6">
            {[
              { email: 'alex@design.com', plan: 'Pro', time: '12m ago', color: 'bg-emerald-700' },
              { email: 'sarah.j@gmail.com', plan: 'Free', time: '45m ago', color: 'bg-blue-600' },
              { email: 'tech_ninja@hub.io', plan: 'Business', time: '1h ago', color: 'bg-purple-600' },
              { email: 'mike_99@dev.com', plan: 'Free', time: '3h ago', color: 'bg-slate-900' },
              { email: 'k.walsh@corp.net', plan: 'Pro', time: '5h ago', color: 'bg-amber-600' },
            ].map((user, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 ${user.color} rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform`}>
                    {user.email[0].toUpperCase()}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{user.email}</p>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        user.plan === 'Pro' ? 'text-emerald-700' : 
                        user.plan === 'Business' ? 'text-purple-600' : 
                        'text-slate-400'
                      }`}>{user.plan}</span>
                      <span className="text-[10px] font-medium text-slate-300">• {user.time}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-200 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
          <button className="w-full py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all active:scale-95">
            View All Users
          </button>
        </div>
      </div>
    </div>
  );
}
