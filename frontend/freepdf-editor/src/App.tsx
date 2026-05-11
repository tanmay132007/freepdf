
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { tools, iconMap } from './lib/tools';
import { Files, Zap, Shield, Search, ArrowRight, Loader2 } from 'lucide-react';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy load pages
const ToolPage = lazy(() => import('./pages/ToolPage'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const AuthCallback = lazy(() => import('./pages/auth/AuthCallback'));

const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'));
const Overview = lazy(() => import('./pages/dashboard/Overview'));
const DashboardFiles = lazy(() => import('./pages/dashboard/Files'));
const History = lazy(() => import('./pages/dashboard/History'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));
const Billing = lazy(() => import('./pages/dashboard/Billing'));

const BlogList = lazy(() => import('./pages/blog/BlogList'));
const BlogPost = lazy(() => import('./pages/blog/BlogPost'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminJobs = lazy(() => import('./pages/admin/Jobs'));
const AdminRevenue = lazy(() => import('./pages/admin/Revenue'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

import { DashboardSkeleton, ToolSkeleton } from './components/ui/Skeleton';

const PageLoader = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <Loader2 size={32} className="animate-spin text-emerald-700" />
  </div>
);

function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Mini Nav */}
      <nav className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 bg-emerald-700 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:rotate-6 transition-all">
            <Files size={20} />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">SavePDF</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/tools" className="hover:text-emerald-700 transition-colors">Tools</Link>
          <Link to="/pricing" className="hover:text-emerald-700 transition-colors">Pricing</Link>
          <Link to="/about" className="hover:text-emerald-700 transition-colors">About</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900">Log in</Link>
          <Link to="/pricing" className="px-5 py-2 bg-slate-900 text-white rounded-full text-xs font-semibold hover:bg-slate-800 transition-all">
            Sign Up Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1">
        <section className="bg-white pt-24 pb-24 px-8 border-b border-slate-100">
          <div className="max-w-6xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] animate-fade-in">
              <Zap size={10} fill="currentColor" /> AI Powered Tools Now Live
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tighter max-w-4xl mx-auto leading-[0.95]">
              Every tool you need to <span className="text-emerald-700 italic">master PDFs</span> in one place.
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
              SavePDF is the world's fastest and most secure online PDF editor. 
              No installation. No expensive subscriptions. Just pure productivity.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <div className="relative group w-full sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Search 29+ PDF tools..." 
                  className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-emerald-700 focus:ring-4 focus:ring-emerald-50 py-4 pl-12 pr-6 rounded-2xl outline-none transition-all font-medium text-slate-900 shadow-inner"
                />
              </div>
              <button className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-emerald-200 transition-all transform hover:scale-105">
                Explore Tools
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8">
              <div className="flex flex-col items-center opacity-40">
                <div className="p-2 bg-white rounded-lg border border-slate-200"><Shield size={16} className="text-slate-600" /></div>
                <span className="text-[10px] mt-1 uppercase font-bold text-slate-500 tracking-wider">Secure</span>
              </div>
              <div className="flex flex-col items-center opacity-40">
                <div className="p-2 bg-white rounded-lg border border-slate-200"><Zap size={16} className="text-slate-600" /></div>
                <span className="text-[10px] mt-1 uppercase font-bold text-slate-500 tracking-wider">Fast</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-24 px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Popular Tools</h2>
            <Link to="/tools" className="text-xs font-bold text-emerald-700 hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.slice(0, 12).map((tool) => {
              const Icon = iconMap[tool.icon];
              return (
                <Link 
                  key={tool.slug} 
                  to={`/tools/${tool.slug}`}
                  className="group bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-xl hover:shadow-slate-200 hover:border-emerald-200 transition-all flex flex-col gap-4 text-left"
                >
                  <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-all transform group-hover:-translate-y-1">
                    <Icon size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors flex items-center justify-between">
                      {tool.name}
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 font-medium">{tool.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 pt-20 pb-10 px-8 text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-slate-800">
              <Files size={28} className="text-emerald-700" />
              <span className="text-xl font-bold tracking-tight">SavePDF</span>
            </div>
            <p className="text-xs leading-relaxed font-medium">
              Making PDF editing accessible to everyone. Fast, secure, and incredibly easy. Cloud secure & open source.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-slate-800 font-bold uppercase tracking-[0.2em] text-[10px]">Tools</h4>
            <ul className="text-xs space-y-3 font-medium">
              <li><Link to="/tools/merge-pdf" className="hover:text-emerald-700 transition-colors">Merge PDF</Link></li>
              <li><Link to="/tools/split-pdf" className="hover:text-emerald-700 transition-colors">Split PDF</Link></li>
              <li><Link to="/tools/compress-pdf" className="hover:text-emerald-700 transition-colors">Compress PDF</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-slate-800 font-bold uppercase tracking-[0.2em] text-[10px]">Company</h4>
            <ul className="text-sm space-y-3 font-medium">
              <li><Link to="/pricing" className="text-xs hover:text-emerald-700 transition-colors">Pricing</Link></li>
              <li><Link to="/contact" className="text-xs hover:text-emerald-700 transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="text-xs hover:text-emerald-700 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-slate-800 font-bold uppercase tracking-[0.2em] text-[10px]">Newsletter</h4>
            <div className="flex gap-2">
              <input type="text" placeholder="Email" className="bg-slate-50 border-slate-100 outline-none p-3 rounded-xl flex-1 text-xs text-slate-900" />
              <button className="bg-slate-900 p-3 rounded-xl text-white hover:bg-slate-800">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
          <span>© 2024 SavePDF Editor</span>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const App = () => {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools/:slug" element={
            <Suspense fallback={<ToolSkeleton />}>
              <ToolPage />
            </Suspense>
          } />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <Suspense fallback={<DashboardSkeleton />}>
              <AdminLayout />
            </Suspense>
          }>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="revenue" element={<AdminRevenue />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Suspense fallback={<DashboardSkeleton />}>
                <DashboardLayout />
              </Suspense>
            </ProtectedRoute>
          }>
            <Route index element={<Overview />} />
            <Route path="files" element={<DashboardFiles />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
            <Route path="billing" element={<Billing />} />
          </Route>

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
