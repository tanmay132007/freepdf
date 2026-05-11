
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getBlogPost, readBlogPosts, BlogPost } from '../../lib/blog';
import { setMetadata } from '../../lib/metadata';
import { 
  ArrowLeft, Clock, User, Calendar, Share2, 
  ChevronRight, ArrowRight, Home, Sparkles 
} from 'lucide-react';
import { motion } from 'motion/react';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (!slug) return;
    const currentPost = getBlogPost(slug);
    
    if (!currentPost) {
      navigate('/blog');
      return;
    }

    setPost(currentPost);
    setMetadata(`${currentPost.title} — SavePDF Blog`, currentPost.description);

    // Get related posts (same category, excluding current)
    const allPosts = readBlogPosts();
    const related = allPosts
      .filter(p => p.category === currentPost.category && p.slug !== currentPost.slug)
      .slice(0, 3);
    setRelatedPosts(related);
  }, [slug, navigate]);

  if (!post) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className="bg-slate-50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link to="/" className="hover:text-emerald-700 flex items-center gap-1 transition-colors">
            <Home size={12} /> Home
          </Link>
          <ChevronRight size={10} />
          <Link to="/blog" className="hover:text-emerald-700 transition-colors">Blog</Link>
          <ChevronRight size={10} />
          <span className="text-slate-900 truncate max-w-[200px]">{post.title}</span>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-20 pb-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <span className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200">
              {post.category}
            </span>
            <div className="h-px bg-slate-200 flex-1"></div>
            <div className="flex gap-2">
              <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-700 hover:border-emerald-100 transition-all shadow-sm">
                <Share2 size={16} />
              </button>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-900 font-syne tracking-tight leading-[1.1]"
          >
            {post.title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-8 pt-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400">
                <User size={18} />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">{post.author}</p>
                <p className="text-[10px] font-bold text-slate-400">Lead Product Editor</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-emerald-700" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-emerald-700" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{post.readingTime}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Content */}
      <article className="py-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-16">
          <div className="flex-1 min-w-0">
            <div className="markdown-body prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:font-syne prose-headings:font-black prose-a:text-emerald-700 prose-a:font-bold prose-blockquote:border-emerald-700 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:rounded-3xl prose-strong:text-slate-900 prose-img:rounded-3xl">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {/* Post CTA */}
            <div className="mt-20 p-12 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-white/5 transform group-hover:scale-125 transition-transform duration-700">
                <Sparkles size={160} />
              </div>
              <div className="relative z-10 space-y-6">
                <h3 className="text-3xl font-black font-syne">Ready to try it out?</h3>
                <p className="text-slate-400 text-lg font-medium">Use our professional PDF tools today for free. No registration required.</p>
                <Link 
                  to="/" 
                  className="inline-flex items-center gap-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black uppercase tracking-widest text-xs px-8 py-5 rounded-2xl transition-all shadow-xl shadow-emerald-900/50 active:scale-95"
                >
                  Get Started Now <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>

          <aside className="lg:w-80 shrink-0 space-y-12">
            <div className="sticky top-24 space-y-12">
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Related Articles</h4>
                <div className="space-y-8">
                  {relatedPosts.map((r) => (
                    <Link key={r.slug} to={`/blog/${r.slug}`} className="group block space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">{r.category}</p>
                      <h5 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                        {r.title}
                      </h5>
                      <p className="text-xs text-slate-400 font-medium">10 Min Read</p>
                    </Link>
                  ))}
                  {relatedPosts.length === 0 && (
                    <p className="text-sm italic text-slate-400">No related articles found yet.</p>
                  )}
                </div>
              </div>

              <div className="p-8 bg-emerald-700 rounded-[2rem] text-white space-y-6">
                <h4 className="text-xl font-black font-syne">Pro Sidebar</h4>
                <p className="text-sm font-medium leading-relaxed opacity-90">
                  Join our Pro tier for 256-bit encryption and unlimited cloud storage.
                </p>
                <Link to="/pricing" className="block text-center py-4 bg-white text-emerald-700 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-900/20 active:scale-95">
                  View Pro Plans
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {/* Footer Navigation */}
      <footer className="py-20 px-6 border-t border-slate-100 mb-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/blog" className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-all font-black uppercase tracking-widest text-xs">
            <ArrowLeft size={18} /> Back to Blog
          </Link>
          <div className="flex items-center gap-10">
            <Link to="/about" className="text-slate-400 hover:text-slate-900 transition-all font-black uppercase tracking-widest text-[10px]">About Us</Link>
            <Link to="/contact" className="text-slate-400 hover:text-slate-900 transition-all font-black uppercase tracking-widest text-[10px]">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
