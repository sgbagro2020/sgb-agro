import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BlogItem, getAllBlogs, slugify } from '../lib/blogStore';
import { Calendar, Clock, ArrowLeft, BookOpen, AlertCircle, Loader2 } from 'lucide-react';

interface BlogReaderPageProps {
  slug: string;
}

export const BlogReaderPage: React.FC<BlogReaderPageProps> = ({ slug }) => {
  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const allBlogs = await getAllBlogs();
        const cleanTarget = slug.toLowerCase().trim();
        const found = allBlogs.find(
          (b) =>
            b.id === cleanTarget ||
            (b.slug && b.slug.toLowerCase() === cleanTarget) ||
            slugify(b.title) === cleanTarget
        );
        setBlog(found || null);
      } catch (err) {
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const handleBackToWebsite = () => {
    // Attempt to close the current tab
    window.close();
    // Fallback if browser prevents closing (e.g. if not opened via window.open)
    setTimeout(() => {
      window.location.href = '/#blog';
    }, 150);
  };

  const calculateReadingTime = (htmlContent: string): string => {
    const text = htmlContent.replace(/<[^>]*>/g, '');
    const wordCount = text.trim().split(/\s+/).length;
    const time = Math.max(1, Math.ceil(wordCount / 220));
    return `${time} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6" id="blog-reader-loading">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <span className="text-slate-600 text-sm font-semibold tracking-wide">Loading article details...</span>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center" id="blog-reader-not-found">
        <div className="max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-800">Article Not Found</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              We couldn't find the blog article you're looking for. It may have been unpublished or removed by the administrator.
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-200 transition-colors cursor-pointer"
          >
            Go to SGB AGRO Website
          </button>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(blog.content);

  return (
    <div className="min-h-screen bg-slate-50" id="blog-reader-view">
      {/* Top Header Row containing only Back Button */}
      <header className="max-w-4xl mx-auto px-4 pt-6 sm:px-6 lg:px-8">
        <button
          onClick={handleBackToWebsite}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-extrabold shadow-sm border border-slate-200 transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>← Back to Website</span>
        </button>
      </header>

      {/* Main Blog Core Layout */}
      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <article className="bg-white rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden">
          {/* Header Metadata Section */}
          <div className="p-8 sm:p-12 bg-gradient-to-b from-[#064e3b] to-[#043e2e] text-white relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
            
            <div className="relative space-y-4">
              <span className="px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-400/30 inline-block">
                SGB AGRO publication
              </span>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight max-w-3xl">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-emerald-200/90 font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>
                    {new Date(blog.uploadDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>{readingTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image display */}
          {blog.featuredImage && (
            <div className="w-full max-h-[460px] overflow-hidden bg-slate-900 border-b border-slate-100">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Blog HTML Content sandbox */}
          <div className="p-8 sm:p-12 lg:p-16">
            <div
              className="blog-content-body max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-6"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>
      </main>

      {/* Styled sandbox wrapper that formats full HTML inside the article elegantly */}
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
        }
        .blog-content-body ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1.25rem;
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
  );
};
