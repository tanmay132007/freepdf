
import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, MoreVertical, Edit2, 
  Trash2, UserPlus, Shield, CheckCircle,
  XCircle, ChevronLeft, ChevronRight, X,
  Loader2, AlertTriangle, UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  plan: 'Free' | 'Pro' | 'Business';
  role: 'user' | 'admin';
  opsCount: number;
  joined: string;
  status: 'active' | 'suspended';
}

const mockUsers: AdminUser[] = [
  { id: '1', email: 'tanmay@pdf.fast', name: 'Tanmay Rajput', plan: 'Pro', role: 'admin', opsCount: 1240, joined: '2024-01-15', status: 'active' },
  { id: '2', email: 'sarah.j@gmail.com', name: 'Sarah Jenkins', plan: 'Free', role: 'user', opsCount: 45, joined: '2024-03-12', status: 'active' },
  { id: '3', email: 'corp@business.com', name: 'Business Org', plan: 'Business', role: 'user', opsCount: 8902, joined: '2024-02-20', status: 'active' },
  { id: '4', email: 'hacker@void.net', name: 'Unknown User', plan: 'Free', role: 'user', opsCount: 12, joined: '2024-04-01', status: 'suspended' },
  { id: '5', email: 'design@studio.io', name: 'Alex Rivera', plan: 'Pro', role: 'user', opsCount: 340, joined: '2024-03-25', status: 'active' },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'All' || user.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  const handleEditClick = (user: AdminUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleting(true);
  };

  const deleteUser = () => {
    if (!selectedUser) return;
    setUsers(users.filter(u => u.id !== selectedUser.id));
    setIsDeleting(false);
    setSelectedUser(null);
  };

  const updateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 font-syne tracking-tight">User Management</h1>
          <p className="text-sm font-medium text-slate-400">Manage memberships, roles, and platform access.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-800 transition-all active:scale-95 shadow-xl shadow-emerald-200">
          <UserPlus size={16} /> New User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-6 p-2 bg-white rounded-3xl border border-slate-100 shadow-sm items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none py-5 pl-16 pr-6 rounded-2xl outline-none font-bold text-slate-900 placeholder:text-slate-300"
          />
        </div>
        <div className="flex items-center gap-4 px-6 border-l border-slate-50 w-full md:w-auto">
          <Filter size={18} className="text-slate-300" />
          <select 
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="bg-transparent border-none font-black uppercase tracking-widest text-xs text-slate-500 outline-none cursor-pointer py-5"
          >
            <option>All Plans</option>
            <option>Free</option>
            <option>Pro</option>
            <option>Business</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">User Details</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Plan & Role</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Activity</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                        <UserCircle size={20} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-black text-slate-900">{user.name}</p>
                        <p className="text-xs font-medium text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        user.plan === 'Pro' ? 'bg-emerald-100 text-emerald-700' : 
                        user.plan === 'Business' ? 'bg-purple-100 text-purple-600' : 
                        'bg-slate-100 text-slate-400'
                      }`}>
                        {user.plan}
                      </span>
                      {user.role === 'admin' && (
                        <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-amber-500">
                          <Shield size={10} /> Admin
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-900">{user.opsCount}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Operations</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-medium text-slate-500">
                    {user.joined}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                      user.status === 'active' ? 'text-green-500' : 'text-slate-300'
                    }`}>
                      {user.status === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(user)}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:bg-white hover:text-emerald-700 hover:shadow-lg transition-all rounded-xl border border-transparent hover:border-emerald-100"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(user)}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:bg-emerald-700 hover:text-white hover:shadow-lg transition-all rounded-xl"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-8 border-t border-slate-50 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400">Showing 1 - {filteredUsers.length} of {users.length} users</p>
          <div className="flex gap-2">
            <button className="p-2 border border-slate-100 rounded-lg text-slate-300 cursor-not-allowed">
              <ChevronLeft size={16} />
            </button>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:border-emerald-700 hover:text-emerald-700 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900 font-syne">Edit User Membership</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-900"><X size={20} /></button>
                </div>

                <form onSubmit={updateUser} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Plan</label>
                    <select 
                      value={selectedUser.plan}
                      onChange={(e) => setSelectedUser({...selectedUser, plan: e.target.value as any})}
                      className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-700 py-4 px-6 rounded-2xl outline-none font-bold text-slate-700 cursor-pointer"
                    >
                      <option value="Free">Free Tier</option>
                      <option value="Pro">Pro Membership</option>
                      <option value="Business">Enterprise Business</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authority Level</label>
                    <select 
                      value={selectedUser.role}
                      onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value as any})}
                      className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-700 py-4 px-6 rounded-2xl outline-none font-bold text-slate-700 cursor-pointer"
                    >
                      <option value="user">Standard User</option>
                      <option value="admin">Platform Administrator</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Access Status</label>
                    <div className="flex gap-4">
                      {['active', 'suspended'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setSelectedUser({...selectedUser, status: status as any})}
                          className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            selectedUser.status === status 
                              ? (status === 'active' ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'bg-emerald-700 text-white shadow-lg shadow-emerald-200')
                              : 'bg-slate-50 text-slate-400'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                    Apply Changes
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {isDeleting && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleting(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 text-center space-y-8"
            >
              <div className="h-20 w-20 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto">
                <AlertTriangle size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 font-syne">Delete Account?</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Are you sure you want to delete <span className="text-slate-900 font-black">{selectedUser.email}</span>? This action is permanent and will wipe all associated documents.
                </p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsDeleting(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={deleteUser}
                  className="flex-1 py-4 bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-200"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
