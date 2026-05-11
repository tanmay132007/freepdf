
import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, RefreshCw, Clock, 
  FileText, User, Zap, Mail, 
  ChevronLeft, ChevronRight, AlertCircle,
  HelpCircle, MoreHorizontal
} from 'lucide-react';
import { motion } from 'motion/react';

interface Job {
  id: string;
  tool: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  user: string;
  size: string;
  time: number;
  created: string;
  error?: string;
}

const mockJobs: Job[] = [
  { id: 'JOB-94821', tool: 'Merge PDF', status: 'completed', user: 'tanmay@test.com', size: '12.4 MB', time: 145, created: '2024-05-03 14:35:12' },
  { id: 'JOB-94820', tool: 'Compress', status: 'completed', user: 'guest_421', size: '4.2 MB', time: 82, created: '2024-05-03 14:34:55' },
  { id: 'JOB-94819', tool: 'PDF to Word', status: 'failed', user: 'sarah.j@gmail.com', size: '1.8 MB', time: 1202, created: '2024-05-03 14:34:20', error: 'OCR engine timeout after 1200ms' },
  { id: 'JOB-94818', tool: 'Protect', status: 'processing', user: 'pro_alex', size: '45.1 MB', time: 0, created: '2024-05-03 14:34:10' },
  { id: 'JOB-94817', tool: 'Merge PDF', status: 'completed', user: 'tanmay@test.com', size: '8.1 MB', time: 95, created: '2024-05-03 14:33:50' },
];

export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live updates
      setRefreshing(true);
      setTimeout(() => setRefreshing(false), 500);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredJobs = jobs.filter(job => filterStatus === 'All' || job.status === filterStatus.toLowerCase());

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 font-syne tracking-tight">Active Job Stream</h1>
          <p className="text-sm font-medium text-slate-400">Monitor real-time task processing and infrastructure health.</p>
        </div>
        <div className="flex bg-white rounded-xl p-1 border border-slate-100 shadow-sm">
          <button 
            onClick={() => setRefreshing(true)}
            className="p-2 text-slate-400 hover:text-emerald-700 transition-colors"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total JobsToday', value: '1,429', icon: Zap, color: 'text-blue-500' },
          { label: 'Success Rate', value: '98.2%', icon: Clock, color: 'text-green-500' },
          { label: 'Avg Process', value: '112ms', icon: FileText, color: 'text-amber-500' },
          { label: 'Failed Jobs', value: '26', icon: AlertCircle, color: 'text-emerald-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className={`h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 font-syne">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Toolbar */}
      <div className="flex items-center gap-4 py-2 px-6 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
        <Filter size={16} className="text-slate-300 shrink-0" />
        <div className="flex gap-2">
          {['All', 'Processing', 'Completed', 'Failed', 'Pending'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filterStatus === status ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="h-6 w-px bg-slate-100 mx-2 shrink-0"></div>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input 
            type="text" 
            placeholder="Search by Job ID or User..."
            className="w-full bg-transparent pl-10 pr-4 py-2 text-xs font-bold text-slate-900 outline-none"
          />
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Tool</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">User Email</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Size</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Process Time</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Created At</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap text-right">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredJobs.map((job) => (
                <motion.tr 
                  layout
                  key={job.id} 
                  className="group hover:bg-slate-50 transition-colors"
                >
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className="text-xs font-black font-mono text-slate-400 group-hover:text-emerald-700 transition-colors">{job.id}</span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                        <Zap size={14} />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{job.tool}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Mail size={12} className="text-slate-300" />
                      <span className="text-xs font-medium">{job.user}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-xs font-bold text-slate-400">
                    {job.size}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className="text-xs font-black text-slate-900">{job.time > 0 ? `${job.time}ms` : '—'}</span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-[10px] font-bold text-slate-400 uppercase">
                    {job.created}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit ${
                      job.status === 'completed' ? 'bg-green-100 text-green-700' :
                      job.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                      job.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-800 shadow-sm shadow-emerald-200'
                    }`}>
                      {job.status === 'completed' && <div className="h-1 w-1 bg-current rounded-full" />}
                      {job.status === 'processing' && <RefreshCw size={10} className="animate-spin" />}
                      {job.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right whitespace-nowrap">
                    {job.error ? (
                      <div className="inline-flex items-center gap-2 text-emerald-600 group/tooltip relative">
                        <HelpCircle size={14} />
                        <div className="absolute right-0 bottom-full mb-2 w-48 p-3 bg-slate-900 text-white text-[10px] font-medium rounded-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-10 text-center shadow-2xl">
                          {job.error}
                          <div className="absolute top-full right-4 border-8 border-transparent border-t-slate-900"></div>
                        </div>
                      </div>
                    ) : (
                      <MoreHorizontal size={14} className="text-slate-200" />
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 border-t border-slate-50 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400">Auto-refreshing every 15 seconds...</p>
          <div className="flex gap-2">
            <button className="px-6 py-2.5 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Load Earlier Jobs</button>
          </div>
        </div>
      </div>
    </div>
  );
}
