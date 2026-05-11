
import React, { useEffect } from 'react';
import { setMetadata } from '../lib/metadata';
import { 
  Zap, Shield, Users, Files, Check, 
  ArrowRight, Sparkles, Globe, Heart, User
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function About() {
  useEffect(() => {
    setMetadata('About SavePDF — Free Online PDF Tools', 'Learn about our mission to make document editing accessible and free for everyone.');
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto text-center space-y-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700/20 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-600/20"
          >
            <Heart size={14} className="fill-current" /> Made for the web
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black font-syne tracking-tight leading-[0.9]"
          >
            We believe PDF tools should be <br className="hidden lg:block" />
            <span className="text-emerald-700">free for everyone</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto font-medium"
          >
            Built by engineers who were tired of paywalls and cluttered interfaces.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-50 rounded-[4rem] p-12 md:p-24 flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 space-y-8">
              <div className="h-16 w-16 bg-emerald-700 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-200">
                <Globe size={32} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 font-syne tracking-tight leading-[1.1]">
                Our mission is to simplify documentation.
              </h2>
              <div className="space-y-6 text-lg text-slate-600 font-medium leading-relaxed">
                <p>
                  SavePDF was started in 2024 as a side project to help small businesses and students handle PDF files without expensive enterprise software.
                </p>
                <p>
                  We believe that privacy and accessibility shouldn't be luxury features. That's why 20+ of our core tools will always remain free, processing your files securely with industry-standard encryption.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 pt-6">
                {['No Hidden Fees', 'No Credit Card Required', 'No Mandatory Sign-up'].map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-xs font-bold text-slate-900 shadow-sm border border-slate-100">
                    <Check size={14} className="text-green-500" /> {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/3 grid grid-cols-1 gap-6">
              {[
                { label: 'Tools Built', value: '29+', icon: Zap, color: 'text-emerald-700' },
                { label: 'Active Users', value: '50K+', icon: Users, color: 'text-blue-600' },
                { label: 'Files Processed', value: '1M+', icon: Files, color: 'text-purple-600' },
                { label: 'Success Rate', value: '99.9%', icon: Sparkles, color: 'text-amber-600' },
              ].map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex items-center gap-6 group hover:translate-x-4 transition-transform"
                >
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center bg-slate-50 group-hover:scale-110 transition-transform ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-4xl font-black text-slate-900 font-syne">{stat.value}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-32 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">
              <Shield size={14} /> Security First
            </div>
            <h2 className="text-4xl md:text-6xl font-black font-syne tracking-tight leading-[1.1]">
              Your data is <span className="text-emerald-600">yours</span>. Period.
            </h2>
            <div className="space-y-8">
              {[
                { title: 'End-to-End Encryption', desc: 'Secure HTTPS transfer protects your data from interception during upload and download.' },
                { title: 'Auto-Delete Feature', desc: 'All files are automatically wiped from our secure cloud servers exactly 60 minutes after processing.' },
                { title: 'No Data Tracking', desc: 'We do not read your content or sell metadata. Your documents are processed blindly by our core engine.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="h-10 w-10 flex-shrink-0 bg-emerald-700 rounded-xl flex items-center justify-center text-white font-bold">
                    {i + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold font-syne">{item.title}</h4>
                    <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-emerald-700 to-emerald-950 rounded-[4rem] flex items-center justify-center rotate-3 shadow-2xl">
              <Shield size={200} className="text-white/20 absolute" />
              <div className="bg-white/10 backdrop-blur-2xl p-12 rounded-[3rem] border border-white/20 space-y-6 text-center transform -rotate-6">
                <h3 className="text-2xl font-black font-syne">100% Privacy</h3>
                <p className="text-sm font-medium text-slate-300">We never store your passwords or session data without explicit permission.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-700">The Dream Team</h2>
            <p className="text-4xl md:text-5xl font-black text-slate-900 font-syne">People behind the tech</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: 'Marcus Chen', role: 'Founder & Architect', bio: 'Former senior engineer at TechFlow. Loves clean code and dark coffee.' },
              { name: 'Sarah Miller', role: 'Head of Product', bio: 'Expert in UX design and document automation systems.' },
              { name: 'Alex Rivera', role: 'Security Lead', bio: 'Specializes in distributed systems and encryption protocols.' },
            ].map((member, i) => (
              <div key={i} className="space-y-6 text-center group">
                <div className="h-48 w-48 mx-auto bg-slate-50 rounded-full border-4 border-white shadow-xl shadow-slate-200 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all">
                  <div className="absolute inset-0 bg-emerald-700/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <User className="h-full w-full p-10 text-slate-200" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-slate-900 font-syne tracking-tight">{member.name}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">{member.role}</p>
                  <p className="text-sm text-slate-400 font-medium max-w-[240px] mx-auto leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto bg-slate-50 rounded-[4rem] p-12 md:p-24 text-center space-y-10">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 font-syne tracking-tight">Stop paying for PDF subscriptions</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/" className="w-full sm:w-auto bg-emerald-700 text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-800 transition-all shadow-2xl shadow-emerald-200 active:scale-95 flex items-center justify-center gap-3">
              Get Started Now <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="w-full sm:w-auto bg-white text-slate-900 px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-xs border border-slate-200 hover:bg-slate-50 transition-all active:scale-95">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
