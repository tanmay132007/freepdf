
import React, { useState, useEffect } from 'react';
import { 
  Search, Download, FileText, Filter, Calendar, 
  ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Clock 
} from 'lucide-react';
import { motion } from 'motion/react';

interface Operation {
  id: string;
  toolName: string;
  status: 'completed' | 'processing' | 'failed';
  date: string;
  fileSize: string;
}

export default function History() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch
    setOperations([
      { id: '1', toolName: 'Merge PDF', status: 'completed', date: '2024-03-12 14:30', fileSize: '4.2 MB' },
      { id: '2', toolName: 'AI Summarizer', status: 'completed', date: '2024-03-12 11:15', fileSize: '1.8 MB' },
      { id: '3', toolName: 'PDF to Excel', status: 'processing', date: '2024-03-12 11:10', fileSize: '0.5 MB' },
      { id: '4', toolName: 'Compress PDF', status: 'failed', date: '2024-03-11 09:45', fileSize: '12.4 MB' },
      { id: '5', toolName: 'PDF to JPG', status: 'completed', date: '2024-03-10 16:20', fileSize: '2.1 MB' },
      { id: '6', toolName: 'Protect PDF', status: 'completed', date: '2024-03-09 20:00', fileSize: '0.3 MB' },
      { id: '7', toolName: 'Merge PDF', status: 'completed', date: '2024-03-08 13:12', fileSize: '5.6 MB' },
      { id: '8', toolName: 'Split PDF', status: 'completed', date: '2024-03-07 10:05', fileSize: '8.2 MB' },
      { id: '9', toolName: 'AI Summarizer', status: 'completed', date: '2024-03-07 09:50', fileSize: '2.4 MB' },
      { id: '10', toolName: 'Compress PDF', status: 'completed', date: '2024-03-05 18:30', fileSize: '1.2 MB' },
    ]);
    setLoading(false);
  }, []);

  const filteredOperations = operations.filter(op => {
    const matchesSearch = op.toolName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || op.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOperations.length / 20);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-syne">Operation History</h1>
        <p className="text-slate-500 font-medium">Keep track of everything you've done on SavePDF.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text"
            placeholder="Search by tool name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-50 py-3 pl-12 pr-4 rounded-2xl outline-none transition-all font-medium text-slate-900 shadow-sm"
          />
        </div>
        
        <div className="flex bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
          {['all', 'completed', 'processing', 'failed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex-1 py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                statusFilter === status 
                  ? 'bg-slate-900 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <button className="h-12 bg-white border border-slate-200 rounded-2xl px-6 flex items-center justify-center gap-3 text-xs font-bold text-slate-600 hover:border-slate-300 transition-all shadow-sm">
          <Calendar size={16} className="text-slate-400" />
          Filter by Date
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Tool Name</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date & Time</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">File Size</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredOperations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-medium font-syne italic">
                  No operations found matching your filters.
                </td>
              </tr>
            ) : filteredOperations.map((op) => (
              <tr key={op.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-all">
                      <FileText size={14} />
                    </div>
                    <span className="text-sm font-bold text-slate-900">{op.toolName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    op.status === 'completed' 
                      ? 'bg-green-50 text-green-600' 
                      : op.status === 'processing'
                        ? 'bg-amber-50 text-amber-600 animate-pulse'
                        : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {op.status === 'completed' && <CheckCircle2 size={10} />}
                    {op.status === 'processing' && <Clock size={10} />}
                    {op.status === 'failed' && <AlertCircle size={10} />}
                    {op.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-400">{op.date}</td>
                <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{op.fileSize}</td>
                <td className="px-6 py-4 text-right">
                  {op.status === 'completed' && (
                    <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-emerald-700 transition-all border border-transparent hover:border-slate-100 shadow-sm hover:shadow">
                      <Download size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Showing 1-10 of {filteredOperations.length} operations
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 disabled:opacity-50 transition-all shadow-sm">
              <ChevronLeft size={16} />
            </button>
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 disabled:opacity-50 transition-all shadow-sm">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
