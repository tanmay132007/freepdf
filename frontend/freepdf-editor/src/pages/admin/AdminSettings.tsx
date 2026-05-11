
import React, { useState } from 'react';
import { 
  Globe, Shield, Zap, Mail, 
  Trash2, Save, RefreshCw, AlertCircle,
  FileText, Cpu, UserPlus, Server
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    maintenance: false,
    maxFileSizeFree: 25,
    maxFileSizePro: 500,
    dailyOpsLimitFree: 5,
    enableAI: true,
    enableOCR: true,
    enableSignups: true,
    fromEmail: 'noreply@savepdf.com',
    supportEmail: 'support@savepdf.tech'
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 font-syne tracking-tight">System Settings</h1>
          <p className="text-sm font-medium text-slate-400">Configure global platform behavior and limits.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-800 transition-all active:scale-95 shadow-xl shadow-emerald-200 disabled:bg-emerald-300"
        >
          {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Site Settings */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center">
              <Globe size={24} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 font-syne tracking-tight">Platform Configuration</h3>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="space-y-1">
                <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">Maintenance Mode</p>
                <p className="text-xs text-slate-400 font-medium italic">Redirect all users to a wait page.</p>
              </div>
              <button 
                onClick={() => setSettings({...settings, maintenance: !settings.maintenance})}
                className={`w-14 h-8 rounded-full transition-all relative ${settings.maintenance ? 'bg-emerald-700' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.maintenance ? 'left-7' : 'left-1 shadow-sm'}`} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Max File Size (Free)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={settings.maxFileSizeFree} 
                    onChange={(e) => setSettings({...settings, maxFileSizeFree: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-700 py-4 px-6 rounded-2xl outline-none font-bold text-slate-900" 
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300">MB</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Max File Size (Pro)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={settings.maxFileSizePro} 
                    onChange={(e) => setSettings({...settings, maxFileSizePro: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-700 py-4 px-6 rounded-2xl outline-none font-bold text-slate-900" 
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300">MB</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Daily Operations Limit (Free Tier)</label>
              <input 
                type="number" 
                value={settings.dailyOpsLimitFree} 
                onChange={(e) => setSettings({...settings, dailyOpsLimitFree: parseInt(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-700 py-4 px-6 rounded-2xl outline-none font-bold text-slate-900" 
              />
            </div>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center">
              <Zap size={24} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 font-syne tracking-tight">Feature Flags</h3>
          </div>

          <div className="space-y-6">
            {[
              { id: 'enableAI', label: 'AI Document Summarizer', desc: 'Enable Gemini-powered analysis features.', icon: Cpu },
              { id: 'enableOCR', label: 'OCR Engine (Tesseract)', desc: 'Enable character recognition for scans.', icon: Server },
              { id: 'enableSignups', label: 'Public New Signups', desc: 'Allow visitors to create new accounts.', icon: UserPlus },
            ].map((flag) => (
              <div key={flag.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 bg-slate-50 text-slate-300 group-hover:text-emerald-700 transition-colors rounded-2xl flex items-center justify-center">
                    <flag.icon size={20} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-black text-slate-900">{flag.label}</p>
                    <p className="text-xs text-slate-400 font-medium italic">{flag.desc}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSettings({...settings, [flag.id]: !settings[flag.id as keyof typeof settings]})}
                  className={`w-12 h-6 rounded-full transition-all relative ${settings[flag.id as keyof typeof settings] ? 'bg-emerald-700' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings[flag.id as keyof typeof settings] ? 'left-7' : 'left-1 shadow-sm'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center">
              <Mail size={24} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 font-syne tracking-tight">Email Server</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Sender Email (From)</label>
              <input 
                type="email" 
                value={settings.fromEmail} 
                onChange={(e) => setSettings({...settings, fromEmail: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-700 py-4 px-6 rounded-2xl outline-none font-bold text-slate-900" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Support Channel</label>
              <input 
                type="email" 
                value={settings.supportEmail} 
                onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-700 py-4 px-6 rounded-2xl outline-none font-bold text-slate-900" 
              />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-emerald-50 p-10 rounded-[2.5rem] border border-emerald-100 shadow-sm space-y-10">
          <div className="flex items-center gap-4 text-emerald-700 font-black">
            <AlertCircle size={24} />
            <h3 className="text-2xl font-syne tracking-tight">Danger Zone</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-emerald-100">
              <div className="space-y-1 text-left">
                <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">Purge Processed Files</p>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Immediate irreversible action</p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-800 transition-all active:scale-95 shadow-lg shadow-emerald-200">
                <Trash2 size={14} /> Clear Cache
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
