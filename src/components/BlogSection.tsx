import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BlogItem, getAllBlogs, slugify } from '../lib/blogStore';
import { Calendar, ArrowLeft, ArrowRight, BookOpen, Clock, ChevronRight, Inbox } from 'lucide-react';

interface BlogSectionProps {
  refreshTrigger?: number;
  currentBlogId?: string | null;
  onBlogIdChange?: (id: string | null) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ 
  refreshTrigger = 0,
  currentBlogId = null,
  onBlogIdChange
}) => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<BlogItem | null>(null);

  const loadBlogs = async () => {
    setLoading(true);
    const allBlogs = await getAllBlogs();
    // Only display published blogs to visitors
    const published = allBlogs.filter((b) => b.published);
    setBlogs(published);

    if (currentBlogId) {
      const found = published.find((b) => b.id === currentBlogId);
      if (found) {
        setSelectedBlog(found);
      } else {
        const foundAny = allBlogs.find((b) => b.id === currentBlogId);
        setSelectedBlog(foundAny || null);
      }
    } else {
      setSelectedBlog(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBlogs();
  }, [refreshTrigger, currentBlogId]);

  const handleReadMore = (blog: BlogItem) => {
    if (onBlogIdChange) {
      onBlogIdChange(blog.id);
    } else {
      setSelectedBlog(blog);
      const section = document.getElementById('blog');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleBackToList = () => {
    if (onBlogIdChange) {
      onBlogIdChange(null);
    } else {
      setSelectedBlog(null);
      const section = document.getElementById('blog');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handlePrevBlog = () => {
    if (!selectedBlog) return;
    const currentIndex = blogs.findIndex((b) => b.id === selectedBlog.id);
    if (currentIndex > 0) {
      const prevBlog = blogs[currentIndex - 1];
      if (onBlogIdChange) {
        onBlogIdChange(prevBlog.id);
      } else {
        setSelectedBlog(prevBlog);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextBlog = () => {
    if (!selectedBlog) return;
    const currentIndex = blogs.findIndex((b) => b.id === selectedBlog.id);
    if (currentIndex < blogs.length - 1) {
      const nextBlog = blogs[currentIndex + 1];
      if (onBlogIdChange) {
        onBlogIdChange(nextBlog.id);
      } else {
        setSelectedBlog(nextBlog);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentIndex = selectedBlog ? blogs.findIndex((b) => b.id === selectedBlog.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < blogs.length - 1;

  return (
    <section id="blog" className="py-24 bg-slate-50 relative scroll-mt-20 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AnimatePresence mode="wait">
          {!selectedBlog ? (
            /* BLOG LISTING VIEW */
            <motion.div
              key="list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Section Header */}
              <div className="text-center max-w-3xl mx-auto mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-3.5 py-1 bg-green-100 text-[#064e3b] rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-green-200"
                >
                  <span className="flex h-2 w-2 rounded-full bg-[#16a34a]"></span>
                  Updates & Knowledge Base
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-light text-[#064e3b] tracking-tight leading-tight"
                >
                  Agricultural <span className="font-serif italic font-medium text-[#16a34a]">Insights</span> & Blogs
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed"
                >
                  Stay updated with the latest farming technologies, micro-irrigation practices, and machinery operating guides.
                </motion.p>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
                  <span className="text-slate-500 text-sm font-semibold">Loading SGB publications...</span>
                </div>
              ) : blogs.length === 0 ? (
                /* Empty state */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-xl mx-auto text-center py-16 px-6 bg-white rounded-3xl border border-slate-200/60 shadow-xl"
                >
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Inbox className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">No blog articles have been published yet.</h3>
                  <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                    Our technical experts are preparing guidelines and informative articles. Please check back soon!
                  </p>
                </motion.div>
              ) : (
                /* Blog Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogs.map((blog, idx) => (
                    <motion.article
                      key={blog.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col group h-full"
                    >
                      {/* Featured Image */}
                      <a
                        href={`/blog/${blog.slug || slugify(blog.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block aspect-[16/10] overflow-hidden bg-slate-900 relative cursor-pointer"
                      >
                        {blog.featuredImage ? (
                          <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-800 to-[#064e3b] flex flex-col items-center justify-center p-6 text-center text-white relative">
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                            <BookOpen className="w-12 h-12 text-emerald-300 mb-3" />
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">SGB Agri Article</span>
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest bg-emerald-600 text-white rounded-full shadow-md">
                            Farming Tip
                          </span>
                        </div>
                      </a>

                      {/* Card Content */}
                      <div className="p-6 sm:p-7 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-3">
                          <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{new Date(blog.uploadDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>

                        <a
                          href={`/blog/${blog.slug || slugify(blog.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block cursor-pointer"
                        >
                          <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                            {blog.title}
                          </h3>
                        </a>

                        <p className="text-sm text-slate-500 mt-2.5 line-clamp-3 leading-relaxed flex-1">
                          {blog.shortDescription}
                        </p>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <a
                            href={`/blog/${blog.slug || slugify(blog.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-extrabold uppercase tracking-wider text-[#16a34a] hover:text-[#064e3b] flex items-center gap-1 transition-all group/btn cursor-pointer"
                          >
                            <span>Read More</span>
                            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </a>
                          
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <Clock className="w-3.5 h-3.5" />
                            <span>5 min read</span>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            /* BLOG DETAIL ARTICLE VIEW */
             <motion.div
              key="detail-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              {/* Top Professional Navigation Bar for Blog Article */}
              <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-4 mb-8 flex items-center justify-between">
                <button
                  onClick={handleBackToList}
                  className="px-5 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#064e3b] text-xs font-extrabold flex items-center gap-2 transition-all border border-emerald-100"
                >
                  <ArrowLeft className="w-4 h-4 text-[#16a34a]" />
                  <span>← Back to Blogs</span>
                </button>
                <div className="text-xs text-slate-400 font-bold hidden sm:block">
                  SGB AGRO INDUSTRIES • Technical Publications
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold mr-1">
                    Article {currentIndex + 1} of {blogs.length}
                  </span>
                </div>
              </div>

              {/* Complete Article Content */}
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
                {/* Banner / Header */}
                <div className="p-8 sm:p-12 border-b border-slate-100 bg-[#064e3b] text-white relative">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
                  
                  <div className="relative space-y-4">
                    <span className="px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-400/30">
                      Published Article
                    </span>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight max-w-3xl">
                      {selectedBlog.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-emerald-200/90 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4.5 h-4.5 text-emerald-400" />
                        <span>{new Date(selectedBlog.uploadDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4.5 h-4.5 text-emerald-400" />
                        <span>SGB Agri Editorial Team</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Image inside details if present */}
                {selectedBlog.featuredImage && (
                  <div className="w-full max-h-[420px] overflow-hidden border-b border-slate-100 bg-slate-900">
                    <img
                      src={selectedBlog.featuredImage}
                      alt={selectedBlog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Body Content containing HTML */}
                <div className="p-8 sm:p-12 lg:p-16">
                  {/* Styled sandbox wrapper that formats full HTML gracefully */}
                  <div 
                    className="blog-content-body max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-6"
                    dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                  />

                  {/* Injecting local css scope to handle raw elements in dangerouslySetInnerHTML */}
                  <style>{`
                    .blog-content-body h1 {
                      font-size: 1.875rem;
                      font-weight: 800;
                      color: #064e3b;
                      margin-top: 2rem;
                      margin-bottom: 1rem;
                      line-height: 1.25;
                    }
                    .blog-content-body h2 {
                      font-size: 1.5rem;
                      font-weight: 700;
                      color: #064e3b;
                      margin-top: 1.75rem;
                      margin-bottom: 0.75rem;
                    }
                    .blog-content-body h3 {
                      font-size: 1.25rem;
                      font-weight: 700;
                      color: #111827;
                      margin-top: 1.5rem;
                      margin-bottom: 0.5rem;
                    }
                    .blog-content-body p {
                      margin-bottom: 1.25rem;
                      color: #374151;
                      line-height: 1.75;
                    }
                    .blog-content-body ul {
                      list-style-type: disc;
                      padding-left: 1.5rem;
                      margin-bottom: 1.25rem;
                      space-y: 0.5rem;
                    }
                    .blog-content-body ol {
                      list-style-type: decimal;
                      padding-left: 1.5rem;
                      margin-bottom: 1.25rem;
                      space-y: 0.5rem;
                    }
                    .blog-content-body li {
                      margin-bottom: 0.375rem;
                    }
                    .blog-content-body a {
                      color: #16a34a;
                      text-decoration: underline;
                      font-weight: 600;
                    }
                    .blog-content-body img {
                      max-width: 100%;
                      height: auto;
                      border-radius: 1rem;
                      margin: 2rem auto;
                      display: block;
                      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                    }
                    .blog-content-body video {
                      max-width: 100%;
                      height: auto;
                      border-radius: 1rem;
                      margin: 2rem auto;
                      display: block;
                    }
                    .blog-content-body iframe {
                      max-width: 100%;
                      aspect-ratio: 16/9;
                      border-radius: 1rem;
                      margin: 2rem auto;
                      display: block;
                      border: none;
                    }
                    .blog-content-body blockquote {
                      border-left-width: 4px;
                      border-color: #16a34a;
                      background-color: #f0fdf4;
                      padding: 1.5rem;
                      border-radius: 0.75rem;
                      font-style: italic;
                      margin-bottom: 1.5rem;
                    }
                  `}</style>
                </div>

                {/* Bottom Pagination controls */}
                <div className="bg-slate-50 px-8 py-6 sm:px-12 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    onClick={handlePrevBlog}
                    disabled={!hasPrev}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200/80 shadow-sm disabled:opacity-30 disabled:pointer-events-none transition-all w-full sm:w-auto justify-center"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#16a34a]" />
                    <span>Previous Article ←</span>
                  </button>

                  <button
                    onClick={handleBackToList}
                    className="px-5 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#064e3b] text-xs font-extrabold flex items-center justify-center gap-2 transition-all border border-emerald-100 w-full sm:w-auto"
                  >
                    <span>← Back to Blogs</span>
                  </button>

                  <button
                    onClick={handleNextBlog}
                    disabled={!hasNext}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200/80 shadow-sm disabled:opacity-30 disabled:pointer-events-none transition-all w-full sm:w-auto justify-center"
                  >
                    <span>Next Article →</span>
                    <ArrowRight className="w-4 h-4 text-[#16a34a]" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
