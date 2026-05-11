
import React, { useState, useEffect } from 'react';
import { useUser } from '../../hooks/useUser';
import { 
  Search, Grid, List as ListIcon, Download, Trash2, 
  FileText, ArrowUpDown, Filter, MoreVertical, FolderOpen,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SavedFile {
  id: string;
  name: string;
  size: number;
  createdAt: string;
  expiresAt: string;
}

export default function Files() {
  const { plan } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [files, setFiles] = useState<SavedFile[]>([]);
  const [loading, setLoading] = useState(true);

  const isPro = plan?.name === 'Pro' || plan?.name === 'Business';

  useEffect(() => {
    // Simulated fetch
    if (isPro) {
      setFiles([
        { id: '1', name: 'Annual_Report_2023.pdf', size: 2400000, createdAt: '2024-03-10', expiresAt: '2024-04-10' },
        { id: '2', name: 'Invoice_March.pdf', size: 450000, createdAt: '2024-03-11', expiresAt: '2024-04-11' },
        { id: '3', name: 'Project_Proposal_Final.pdf', size: 12000000, createdAt: '2024-03-05', expiresAt: '2024-04-05' },
        { id: '4', name: 'Product_Specs_V2.pdf', size: 850000, createdAt: '2024-02-28', expiresAt: '2024-03-28' },
      ]);
    }
    setLoading(false);
  }, [isPro]);

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === 'largest') return b.size - a.size;
    if (sortBy === 'smallest') return a.size - b.size;
    return 0;
  });

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-syne">My Files</h1>
          <p className="text-slate-500 font-medium">Manage and access your processed PDF documents.</p>
        </div>
        
        {!isPro && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 text-amber-700 px-4 py-2.5 rounded-2xl text-xs font-bold animate-pulse">
            <AlertCircle size={14} />
            Upgrade to Pro to save files permanently.
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text"
            placeholder="Search by filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-50 py-3 pl-12 pr-4 rounded-2xl outline-none transition-all font-medium text-slate-900 shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 lg:flex-none h-12 bg-white border border-slate-200 rounded-2xl px-4 text-xs font-bold text-slate-600 outline-none hover:border-slate-300 transition-all cursor-pointer shadow-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="largest">Largest First</option>
            <option value="smallest">Smallest First</option>
          </select>

          <div className="flex bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900 shadow-inner' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-slate-100 text-slate-900 shadow-inner' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>
      </div>

      {!isPro ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center space-y-6">
          <div className="h-20 w-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto">
            <FolderOpen size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">No saved files yet</h2>
            <p className="text-slate-400 max-w-sm mx-auto text-sm font-medium">
              Processed files are automatically saved for <span className="text-emerald-700 font-bold">Pro</span> and <span className="text-emerald-700 font-bold">Business</span> users. Upgrade to never lose your work.
            </p>
          </div>
          <button className="bg-emerald-700 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-200">
            View Pricing Plans
          </button>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center space-y-4">
          <p className="text-slate-400 font-medium">No files matching your search.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredFiles.map((file) => (
              <motion.div 
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-300 transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors" title={file.name}>
                    {file.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">{formatSize(file.size)}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                    Expires {file.expiresAt}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-700 rounded-lg transition-all">
                      <Download size={16} />
                    </button>
                    <button className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">File Name</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Size</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Created At</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                        <FileText size={14} />
                      </div>
                      <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{file.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{formatSize(file.size)}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400">{file.createdAt}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-emerald-700 transition-all border border-transparent hover:border-slate-100">
                        <Download size={14} />
                      </button>
                      <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-emerald-600 transition-all border border-transparent hover:border-slate-100">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
