import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Layers, Scissors, Minimize2, Table, Image, FileImage, 
  FileType, Lock, Unlock, Droplets, RotateCw, ScanText, Sparkles, 
  Languages, GitCompare, PenLine, EyeOff, Crop, LayoutGrid, Hash, 
  Globe, Archive, Wrench, Scan, Sheet, Presentation, Monitor, Edit3,
  CheckCircle, Zap, Shield, Star, Menu, X, ArrowRight, ChevronRight,
  Download, Settings, Upload
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// --- DATA ---

const tools = [
  { slug: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDFs into one', icon: Layers, category: 'Edit' },
  { slug: 'split-pdf', name: 'Split PDF', description: 'Split PDF into multiple files', icon: Scissors, category: 'Edit' },
  { slug: 'compress-pdf', name: 'Compress PDF', description: 'Reduce PDF file size', icon: Minimize2, category: 'Compress' },
  { slug: 'pdf-to-word', name: 'PDF to Word', description: 'Convert PDF to editable Word doc', icon: FileText, category: 'Convert' },
  { slug: 'pdf-to-excel', name: 'PDF to Excel', description: 'Extract tables to Excel', icon: Table, category: 'Convert' },
  { slug: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert PDF pages to images', icon: Image, category: 'Convert' },
  { slug: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert images to PDF', icon: FileImage, category: 'Convert' },
  { slug: 'word-to-pdf', name: 'Word to PDF', description: 'Convert Word docs to PDF', icon: FileType, category: 'Convert' },
  { slug: 'protect-pdf', name: 'Protect PDF', description: 'Add password to your PDF', icon: Lock, category: 'Security' },
  { slug: 'unlock-pdf', name: 'Unlock PDF', description: 'Remove PDF password', icon: Unlock, category: 'Security' },
  { slug: 'watermark-pdf', name: 'Watermark PDF', description: 'Add watermark to PDF', icon: Droplets, category: 'Edit' },
  { slug: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate PDF pages', icon: RotateCw, category: 'Edit' },
  { slug: 'ocr-pdf', name: 'OCR PDF', description: 'Make scanned PDFs searchable', icon: ScanText, category: 'AI Tools' },
  { slug: 'ai-summarizer', name: 'AI Summarizer', description: 'Summarize PDF with AI', icon: Sparkles, category: 'AI Tools' },
  { slug: 'translate-pdf', name: 'Translate PDF', description: 'Translate PDF to any language', icon: Languages, category: 'AI Tools' },
  { slug: 'compare-pdf', name: 'Compare PDF', description: 'Compare two PDF documents', icon: GitCompare, category: 'AI Tools' },
  { slug: 'sign-pdf', name: 'Sign PDF', description: 'Add signature to PDF', icon: PenLine, category: 'Edit' },
  { slug: 'redact-pdf', name: 'Redact PDF', description: 'Hide sensitive information', icon: EyeOff, category: 'Edit' },
  { slug: 'crop-pdf', name: 'Crop PDF', description: 'Crop PDF pages', icon: Crop, category: 'Edit' },
  { slug: 'organize-pdf', name: 'Organize PDF', description: 'Reorder PDF pages', icon: LayoutGrid, category: 'Edit' },
  { slug: 'page-numbers', name: 'Page Numbers', description: 'Add page numbers to PDF', icon: Hash, category: 'Edit' },
  { slug: 'html-to-pdf', name: 'HTML to PDF', description: 'Convert webpage to PDF', icon: Globe, category: 'Convert' },
  { slug: 'pdf-to-pdfa', name: 'PDF to PDF/A', description: 'Convert to archival format', icon: Archive, category: 'Security' },
  { slug: 'repair-pdf', name: 'Repair PDF', description: 'Fix corrupted PDF files', icon: Wrench, category: 'Security' },
  { slug: 'scan-to-pdf', name: 'Scan to PDF', description: 'Convert scans to PDF', icon: Scan, category: 'AI Tools' },
  { slug: 'excel-to-pdf', name: 'Excel to PDF', description: 'Convert Excel to PDF', icon: Sheet, category: 'Convert' },
  { slug: 'ppt-to-pdf', name: 'PPT to PDF', description: 'Convert PowerPoint to PDF', icon: Presentation, category: 'Convert' },
  { slug: 'pdf-to-ppt', name: 'PDF to PPT', description: 'Convert PDF to PowerPoint', icon: Monitor, category: 'Convert' },
  { slug: 'edit-pdf', name: 'Edit PDF', description: 'Edit text and images in PDF', icon: Edit3, category: 'Edit' },
];

const categories = ['All', 'Convert', 'Edit', 'Compress', 'Security', 'AI Tools'];

// --- COMPONENTS ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4 border-b border-slate-100' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg transition-transform group-hover:scale-110">
            <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-syne font-extrabold text-2xl tracking-tighter text-navy text-slate-800">SavePDF</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          {['Tools', 'Pricing', 'Blog'].map((item) => (
            <Link key={item} to={`/${item.toLowerCase()}`} className="text-slate-600 hover:text-primary text-sm font-semibold transition-colors">
              {item}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="px-6 py-2.5 text-sm font-bold border border-slate-200 text-slate-800 rounded-xl hover:bg-slate-50 transition-all">
            Sign In
          </button>
          <button className="px-7 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all">
            Get Started
          </button>
        </div>

        <button className="md:hidden text-slate-800" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-3/4 max-w-sm bg-white z-[70] p-8 shadow-2xl"
            >
              <div className="flex justify-end mb-10">
                <button onClick={() => setMobileMenuOpen(false)}><X className="w-6 h-6 text-slate-800" /></button>
              </div>
              <div className="flex flex-col gap-8">
                {['Tools', 'Pricing', 'Blog'].map((item) => (
                  <Link key={item} to={`/${item.toLowerCase()}`} className="text-2xl font-syne font-black text-navy" onClick={() => setMobileMenuOpen(false)}>
                    {item}
                  </Link>
                ))}
                <hr className="border-slate-100" />
                <button className="w-full py-4 border border-slate-200 text-slate-800 font-bold rounded-2xl">Sign In</button>
                <button className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20">Get Started</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => (
  <section className="pt-40 pb-24 px-6 md:px-10 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-radial-sleek -z-10 translate-x-1/4 -translate-y-1/2 blur-3xl opacity-60" />
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
      <div className="md:w-1/2 text-left">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-syne text-5xl md:text-7xl font-black text-[#1A1A2E] leading-[1.05] mb-8"
        >
          Edit, Convert & <span className="text-primary">Compress</span> PDFs
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-500 leading-relaxed max-w-lg mb-12"
        >
          29 powerful PDF tools. No installation. No signup required. Files deleted after 1 hour.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center gap-5 mb-16"
        >
          <button className="w-full sm:w-auto px-10 py-5 bg-primary text-white text-lg font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30">
            Start for Free
          </button>
          <button className="w-full sm:w-auto px-10 py-5 text-slate-600 font-bold border-2 border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all">
            See all 29 tools
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-y-6 max-w-sm border-t border-slate-100 pt-10"
        >
          <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="text-sm">🔒</span> 256-bit secure
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="text-sm">⏱</span> 1-hour delete
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="text-sm">⚡</span> Under 3 sec
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="text-sm">⭐</span> 50K+ users
          </div>
        </motion.div>
      </div>

      <div className="hidden md:block md:w-1/2">
        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full aspect-square bg-slate-50 rounded-3xl border border-slate-100 p-8 shadow-inner overflow-hidden flex items-center justify-center"
          >
             {/* Mock visual placeholder */}
             <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-12 text-center bg-white shadow-sm">
                <div className="w-20 h-20 bg-emerald-50 text-primary rounded-2xl flex items-center justify-center mb-6">
                   <Upload className="w-10 h-10" />
                </div>
                <h3 className="font-bold text-xl mb-2">Drop PDF here</h3>
                <p className="text-slate-400 text-sm">or click to choose files from device</p>
             </div>
          </motion.div>
          {/* Floating elements */}
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-6 -right-6 px-6 py-4 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center"><CheckCircle className="w-5 h-5" /></div>
             <div className="text-left">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Status</div>
                <div className="text-sm font-bold">PDF Optimized</div>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

const ToolGrid = () => {
  const [activeTab, setActiveTab] = useState('All');
  const filteredTools = activeTab === 'All' ? tools : tools.filter(t => t.category === activeTab);
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 md:px-10 max-w-7xl mx-auto" id="tools">
      <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-8">
        <div className="max-w-xl">
          <h2 className="font-syne text-4xl font-black text-[#1A1A2E] mb-4">Popular Tools</h2>
          <p className="text-slate-500 text-lg">Professional PDF processing made simple. Accessible from any device, anywhere.</p>
        </div>
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        <AnimatePresence mode='popLayout'>
          {filteredTools.map((tool, idx) => (
            <motion.div
              layout
              key={tool.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => navigate(`/tools/${tool.slug}`)}
              className="group bg-white rounded-3xl border border-slate-100 p-7 hover:shadow-2xl hover:shadow-slate-200/50 hover:border-primary transition-all cursor-pointer flex flex-col items-start gap-5 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-800 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                <tool.icon className="w-6 h-6" />
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">{tool.description}</p>
              </div>
              <ChevronRight className="absolute bottom-7 right-7 w-5 h-5 text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { icon: Upload, title: 'Upload your PDF', desc: 'Securely upload your document', color: 'bg-emerald-50 text-primary' },
    { icon: Settings, title: 'Choose your tool', desc: 'Select from 29 efficient tasks', color: 'bg-blue-50 text-blue-600' },
    { icon: Download, title: 'Download instantly', desc: 'Get your processed file in seconds', color: 'bg-green-50 text-green-600' }
  ];

  return (
    <section className="py-32 bg-slate-50 border-y border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-24">
        <h2 className="font-syne text-4xl font-black text-[#1A1A2E] mb-4">Workflow that works</h2>
        <p className="text-slate-500 text-lg">Simple 3-step process to get your PDF tasks done in seconds.</p>
      </div>
      
      <div className="max-w-5xl mx-auto px-6 relative">
        <div className="grid md:grid-cols-3 gap-20">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-center group text-center">
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-[44px] left-[calc(50%+60px)] w-[calc(100%-120px)] h-0.5 border-t-2 border-dashed border-slate-200" />
              )}
              <div className={`w-24 h-24 ${step.color} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all shadow-xl shadow-white/50 border border-white`}>
                <step.icon className="w-10 h-10" />
              </div>
              <h4 className="font-syne text-xl font-black text-[#1A1A2E] mb-4">{step.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed max-w-[200px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingTeaser = () => (
  <section className="py-24 px-4 max-w-7xl mx-auto text-center" id="pricing">
    <h2 className="font-syne text-4xl font-bold text-navy mb-4">Choose Your Plan</h2>
    <p className="text-navy/50 mb-16">Unlock more power for your PDF workflow</p>
    
    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
      <div className="p-8 border border-navy/10 rounded-3xl text-left bg-white transition-transform hover:-translate-y-2">
        <h3 className="font-bold text-xl mb-2">Free</h3>
        <div className="text-4xl font-syne font-extrabold mb-6">$0</div>
        <ul className="space-y-4 mb-8">
          {['29 basic tools', '10 files per day', 'Secure storage'].map(f => (
            <li key={f} className="flex items-center gap-2 text-navy/60 text-sm"><CheckCircle className="w-4 h-4 text-green-500" /> {f}</li>
          ))}
        </ul>
        <button className="w-full py-3 rounded-xl border-2 border-navy text-navy font-bold hover:bg-navy hover:text-white transition-all">Current Plan</button>
      </div>

      <div className="p-8 border-2 border-primary rounded-3xl text-left bg-white relative transition-transform hover:-translate-y-2 shadow-2xl shadow-primary/10">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold font-syne uppercase tracking-wider">Most Popular</div>
        <h3 className="font-bold text-xl mb-2">Pro</h3>
        <div className="text-4xl font-syne font-extrabold mb-6">$9<span className="text-lg text-navy/40 font-normal">/mo</span></div>
        <ul className="space-y-4 mb-8">
          {['Batch processing', 'Unlimited files', 'Priority AI support'].map(f => (
            <li key={f} className="flex items-center gap-2 text-navy/60 text-sm"><CheckCircle className="w-4 h-4 text-primary" /> {f}</li>
          ))}
        </ul>
        <button className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:shadow-lg hover:shadow-primary/30 transition-all">Get Started</button>
      </div>

      <div className="p-8 border border-navy/10 rounded-3xl text-left bg-white transition-transform hover:-translate-y-2">
        <h3 className="font-bold text-xl mb-2">Business</h3>
        <div className="text-4xl font-syne font-extrabold mb-6">$29<span className="text-lg text-navy/40 font-normal">/mo</span></div>
        <ul className="space-y-4 mb-8">
          {['Team collaboration', 'Custom workflows', 'API Access'].map(f => (
            <li key={f} className="flex items-center gap-2 text-navy/60 text-sm"><CheckCircle className="w-4 h-4 text-navy" /> {f}</li>
          ))}
        </ul>
        <button className="w-full py-3 rounded-xl border-2 border-navy text-navy font-bold hover:bg-navy hover:text-white transition-all">Contact Sales</button>
      </div>
    </div>
    
    <Link to="/pricing" className="text-primary font-bold hover:underline flex items-center justify-center gap-2">
      See full pricing & features <ArrowRight className="w-4 h-4" />
    </Link>
  </section>
);

const Footer = () => (
  <footer className="pt-24 pb-12 bg-white">
    <div className="max-w-7xl mx-auto px-6 md:px-10">
      <div className="grid md:grid-cols-4 gap-16 mb-20">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="bg-primary p-1.5 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-syne font-black text-2xl text-[#1A1A2E]">SavePDF</span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed">
            Revolutionizing document management with AI-first tools. 100% free, forever secure.
          </p>
        </div>
        <div>
          <h5 className="font-black text-[#1A1A2E] mb-8 uppercase tracking-widest text-xs">Popular Tools</h5>
          <ul className="space-y-4 text-sm font-semibold text-slate-500">
            {['Merge PDF', 'PDF to Word', 'Compress PDF', 'Protect PDF'].map(t => (
              <li key={t}><Link to="#" className="hover:text-primary transition-colors">{t}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="font-black text-[#1A1A2E] mb-8 uppercase tracking-widest text-xs">Resources</h5>
          <ul className="space-y-4 text-sm font-semibold text-slate-500">
            {['API Docs', 'Security', 'User Guide', 'Help Center'].map(t => (
              <li key={t}><Link to="#" className="hover:text-primary transition-colors">{t}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="font-black text-[#1A1A2E] mb-8 uppercase tracking-widest text-xs">Legal</h5>
          <ul className="space-y-4 text-sm font-semibold text-slate-500">
            {['Privacy Policy', 'Terms of Use', 'DPA', 'Contact'].map(t => (
              <li key={t}><Link to="#" className="hover:text-primary transition-colors">{t}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
          © 2026 SavePDF Editor. Built for the speed of web.
        </div>
        <div className="flex items-center gap-5 bg-slate-50 px-5 py-2.5 rounded-full border border-slate-100 shadow-sm">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
          </div>
          <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">All Systems Operational</span>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <ToolGrid />
        <HowItWorks />
        <PricingTeaser />
      </main>
      <Footer />
    </div>
  );
}
