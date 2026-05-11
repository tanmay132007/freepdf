
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { readBlogPosts, BlogPost } from '../../lib/blog';
import { setMetadata } from '../../lib/metadata';
import { 
  Search, Calendar, Clock, User, ArrowRight, 
  ChevronRight, Sparkles 
} from 'lucide-react';
import { motion } from 'motion/react';

const categories = ['All', 'Tutorial', 'Guide', 'Security', 'Comparison'];

const categoryColors: Record<string, string> = {
  Tutorial: 'bg-blue-100 text-blue-700',
  Guide: 'bg-purple-100 text-purple-700',
  Security: 'bg-green-100 text-green-700',
  Comparison: 'bg-amber-100 text-amber-700',
};

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setMetadata('Blog — PDF Tips, Guides & Tutorials', 'The latest PDF editing tips, security guides, and conversion tutorials from the SavePDF team.');
    setPosts(readBlogPosts());
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-slate-50 py-24 px-6 border-b border-slate-100">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700/10 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest"
          >
            <Sparkles size={14} /> Our Journal
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-slate-900 font-syne tracking-tight"
          >
            PDF Tips & <span className="text-emerald-700">Tutorials</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto font-medium"
          >
            Master the art of document management with our expert guides and technical updates.
          </motion.p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex bg-slate-50 p-1 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-white text-emerald-700 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-700 focus:ring-4 focus:ring-emerald-50 py-3 pl-12 pr-4 rounded-2xl outline-none transition-all font-medium text-slate-900"
            />
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Search size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-bold font-syne">No articles found matching your criteria.</p>
            <button onClick={() => {setSearchTerm(''); setActiveCategory('All');}} className="mt-4 text-emerald-700 font-bold hover:underline">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map((post, i) => (
              <motion.article 
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden hover:translate-y-[-8px] transition-all duration-300 border border-transparent hover:border-emerald-100 hover:shadow-2xl hover:shadow-emerald-500/10"
              >
                <Link to={`/blog/${post.slug}`} className="block relative h-64 overflow-hidden bg-slate-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-700/5 to-slate-200"></div>
                  <div className="absolute top-6 left-6">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${categoryColors[post.category] || 'bg-slate-200 text-slate-700 shadow-sm'}`}>
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-700/20 backdrop-blur-[2px]">
                    <div className="bg-white text-emerald-700 p-4 rounded-full shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500">
                      <ArrowRight size={24} />
                    </div>
                  </div>
                </Link>

                <div className="flex-1 p-8 flex flex-col space-y-4">
                  <div className="space-y-3">
                    <Link to={`/blog/${post.slug}`}>
                      <h2 className="text-2xl font-bold text-slate-900 font-syne tracking-tight group-hover:text-emerald-700 transition-colors leading-tight">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-slate-500 font-medium line-clamp-2 text-sm">
                      {post.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <User size={14} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">{post.author}</p>
                        <p className="text-[9px] font-bold text-slate-400">{post.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{post.readingTime}</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter / CTA */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto bg-slate-900 rounded-[3rem] p-12 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-white font-syne tracking-tight">Stay smart with PDFs</h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              Join 50,000+ subscribers and get the latest document security and productivity tips delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-white/10 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-slate-500 font-medium outline-none focus:bg-white/20 transition-all"
              />
              <button 
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-black uppercase tracking-widest text-xs px-10 py-5 rounded-2xl transition-all shadow-xl shadow-emerald-900/20 active:scale-95"
              >
                Join Now
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
