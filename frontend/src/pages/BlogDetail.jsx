import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Terima prop isDirectAccess dari App.jsx
const BlogDetailOverlay = ({ id, isDirectAccess }) => {
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Kunci scroll body saat overlay ini terbuka
    document.body.style.overflow = 'hidden';
    
    const fetchBlogDetail = async () => {
      try {
        const res = await axios.get(`${API_URL}/blogs/${id}`);
        setBlog(res.data.data || res.data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogDetail();

    // Buka kunci scroll saat overlay ditutup
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [id, API_URL]);

  const handleClose = () => {
    navigate('/'); 
  };

  return (
    <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="fixed inset-0 z-[200] bg-[var(--bg-main)] overflow-y-auto"
    >
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans selection:bg-white/20">
        
        <main className="pt-10 pb-20 px-6 md:px-12 max-w-4xl mx-auto min-h-screen">
          {/* LOGIC TOMBOL BACK:
              Jika isDirectAccess = true (akses URL langsung), tombol back HILANG.
              Jika false (dari home), tombol back MUNCUL. 
          */}
          {!isDirectAccess ? (
             <button 
                onClick={handleClose} 
                className="fixed top-8 left-6 md:left-12 z-[210] p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all group"
             >
                <ArrowLeft size={20} className="text-white group-hover:-translate-x-1 transition-transform" />
             </button>
          ) : (
             // Spacer jika tidak ada tombol back agar layout tidak naik
             <div className="h-10" />
          )}

          {loading ? (
             <div className="h-[80vh] flex items-center justify-center text-white/50 animate-pulse">
               Loading Article...
             </div>
          ) : !blog ? (
             <div className="h-[80vh] flex items-center justify-center text-white">
               Blog Not Found
             </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-16"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--text-bold)] mb-8 leading-tight" style={{ fontFamily: 'var(--font-logo)' }}>
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-[10px] md:text-xs uppercase tracking-widest opacity-60 mb-10 border-y border-white/10 py-6">
                  <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
                  <span className="flex items-center gap-2"><User size={14} /> Admin</span>
                  <span className="flex items-center gap-2"><Clock size={14} /> 5 Min Read</span>
              </div>

              <div className="aspect-video w-full rounded-3xl overflow-hidden border border-[var(--border-nav)] mb-12 shadow-2xl relative">
                <img 
                  src={blog.thumbnailUrl} 
                  alt={blog.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-60" />
              </div>

              <article className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:text-[var(--text-bold)] prose-p:text-[var(--text-main)] prose-p:leading-relaxed prose-p:opacity-90 prose-strong:text-white prose-a:text-white prose-blockquote:border-l-white/30">
                 <div className="whitespace-pre-wrap font-light text-base md:text-xl leading-8 md:leading-9 text-justify">
                   {blog.content}
                 </div>
              </article>
            </motion.div>
          )}
        </main>
      </div>
    </motion.div>
  );
};

export default BlogDetailOverlay;