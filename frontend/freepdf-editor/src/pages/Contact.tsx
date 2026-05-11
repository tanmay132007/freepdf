
import React, { useState, useEffect } from 'react';
import { setMetadata } from '../lib/metadata';
import { 
  Mail, MessageSquare, Send, CheckCircle2, 
  MapPin, Phone, Github, Twitter, Linkedin, 
  Loader2, AlertCircle, Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  useEffect(() => {
    setMetadata('Contact Us — SavePDF Support', 'Get in touch with the SavePDF team for support, business inquiries, or feedback.');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white pt-32 pb-20 px-6 border-b border-slate-100">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700/10 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest"
          >
            <MessageSquare size={14} /> Get in touch
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 font-syne tracking-tight"
          >
            We're here to <span className="text-emerald-700">help</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto font-medium"
          >
            Have a question, feature request, or just want to say hi? Send us a message and our team will get back to you within 24 hours.
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: Mail, label: 'Email', value: 'support@savepdf.tech', sub: 'Technical support & general' },
                { icon: MessageSquare, label: 'Sales', value: 'sales@savepdf.tech', sub: 'Enterprise & API inquiries' },
                { icon: MapPin, label: 'Office', value: 'San Francisco, CA', sub: 'Market St, Suite 1200' },
                { icon: Phone, label: 'Phone', value: '+1 (555) PDF-FAST', sub: 'Weekdays 9am - 5pm EST' },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 group hover:shadow-xl hover:shadow-slate-200/50 transition-all"
                >
                  <div className="h-12 w-12 bg-slate-50 text-slate-400 group-hover:bg-emerald-700 group-hover:text-white rounded-2xl flex items-center justify-center transition-all mb-4">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                    <p className="text-lg font-bold text-slate-900 font-syne">{item.value}</p>
                    <p className="text-xs text-slate-500 font-medium">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
              <Sparkles className="absolute top-10 right-10 text-white/10" size={80} />
              <div className="relative z-10 space-y-6">
                <h3 className="text-2xl font-black font-syne">Follow Our Updates</h3>
                <p className="text-slate-400 font-medium text-sm leading-relaxed">Join our community and stay updated with the latest in document technology and security.</p>
                <div className="flex gap-4">
                  {[Github, Twitter, Linkedin].map((Icon, i) => (
                    <button key={i} className="h-12 w-12 bg-white/10 hover:bg-emerald-700 text-white rounded-2xl flex items-center justify-center transition-all">
                      <Icon size={20} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[3rem] p-10 md:p-16 border border-slate-100 shadow-2xl shadow-slate-200/50"
          >
            {success ? (
              <div className="text-center py-20 space-y-6">
                <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 font-syne">Message Sent!</h3>
                <p className="text-slate-500 font-medium">Thank you for reaching out. A specialist will contact you very soon.</p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all active:scale-95"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Your Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-700 focus:ring-4 focus:ring-emerald-50 py-4 px-6 rounded-2xl outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-700 focus:ring-4 focus:ring-emerald-50 py-4 px-6 rounded-2xl outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Subject</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-700 focus:ring-4 focus:ring-emerald-50 py-4 px-6 rounded-2xl outline-none transition-all font-bold text-slate-700 cursor-pointer"
                  >
                    <option>General Inquiry</option>
                    <option>Support Request</option>
                    <option>Business Partnership</option>
                    <option>Media & Press</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Message</label>
                  <textarea 
                    required
                    rows={6}
                    placeholder="Tell us how we can help..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-700 focus:ring-4 focus:ring-emerald-50 py-4 px-6 rounded-2xl outline-none transition-all font-medium text-slate-900 resize-none"
                  ></textarea>
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white font-black uppercase tracking-widest text-xs px-12 py-5 rounded-2xl transition-all shadow-xl shadow-emerald-200 active:scale-95 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <><Send size={18} /> Send Message</>}
                </button>

                <p className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                  <AlertCircle size={12} /> No marketing spam, ever.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
