
import React from 'react';
import { 
  DollarSign, TrendingUp, Users, 
  CreditCard, ArrowUpRight, ArrowDownRight,
  PieChart as PieChartIcon, 
  Download, Filter, Calendar
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion } from 'motion/react';

const revenueStats = [
  { label: 'Monthly Recurring (MRR)', value: '$124,802', trend: '+14.2%', isUp: true, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Total Revenue (LTV)', value: '$1.2M', trend: '+8.1%', isUp: true, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Active Subscriptions', value: '3,492', trend: '+2.4%', isUp: true, icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Churn Rate (Monthly)', value: '1.2%', trend: '-0.4%', isUp: false, icon: Users, color: 'text-emerald-700', bg: 'bg-emerald-50' },
];

const revenueData = [
  { day: '01', rev: 3200 }, { day: '05', rev: 4100 }, { day: '10', rev: 3800 },
  { day: '15', rev: 5200 }, { day: '20', rev: 4800 }, { day: '25', rev: 6100 },
  { day: '30', rev: 5900 },
];

const planDistribution = [
  { name: 'Free', value: 45000, color: '#94a3b8' },
  { name: 'Pro', value: 3100, color: '#0F8A64' },
  { name: 'Business', value: 392, color: '#7c3aed' },
];

const recentPayments = [
  { user: 'alex@design.com', amount: '$12.00', plan: 'Pro', date: '2024-05-03', status: 'Success' },
  { user: 'corp@studio.io', amount: '$49.00', plan: 'Business', date: '2024-05-03', status: 'Success' },
  { user: 'mike_99@dev.com', amount: '$12.00', plan: 'Pro', date: '2024-05-02', status: 'Success' },
  { user: 'j.walsh@corp.net', amount: '$49.00', plan: 'Business', date: '2024-05-02', status: 'Pending' },
  { user: 'sarah.j@gmail.com', amount: '$12.00', plan: 'Pro', date: '2024-05-01', status: 'Failed' },
];

export default function AdminRevenue() {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 font-syne tracking-tight">Revenue Analytics</h1>
          <p className="text-sm font-medium text-slate-400">Track subscriptions, churn, and financial growth metrics.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:shadow-lg transition-all active:scale-95">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueStats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className={`h-12 w-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-sm`}>
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
        {/* Revenue Growth Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 font-syne tracking-tight">Revenue Trajectory (30d)</h3>
            <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl">
              <button className="px-4 py-2 bg-white text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">Daily</button>
              <button className="px-4 py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">Monthly</button>
            </div>
          </div>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F8A64" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#0F8A64" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
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
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '20px' }}
                  itemStyle={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="rev" stroke="#0F8A64" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10">
          <h3 className="text-2xl font-black text-slate-900 font-syne tracking-tight">Plan Breakdown</h3>
          <div className="h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-9">
              <div className="text-center">
                <p className="text-3xl font-black text-slate-900 font-syne">48K+</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Users</p>
              </div>
            </div>
          </div>
          <div className="space-y-4 pt-4">
            {planDistribution.map((plan) => (
              <div key={plan.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: plan.color }}></div>
                  <span className="text-sm font-bold text-slate-700">{plan.name} Users</span>
                </div>
                <span className="text-sm font-black text-slate-900">{((plan.value / 48492) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden pb-10">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900 font-syne tracking-tight">Recent Transactions</h3>
          <Calendar size={18} className="text-slate-300" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Plan</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentPayments.map((pay, i) => (
                <tr key={i} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5">
                    <span className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">{pay.user}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      pay.plan === 'Pro' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-600'
                    }`}>
                      {pay.plan}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-400">
                    {pay.date}
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-slate-900">
                    {pay.amount}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      pay.status === 'Success' ? 'bg-green-100 text-green-700' :
                      pay.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-800 shadow-sm'
                    }`}>
                      {pay.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
