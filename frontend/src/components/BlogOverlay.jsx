import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Kita terima ID dari props App.jsx
const BlogOverlay = ({ id }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  // Cek apakah datang dari Home untuk tombol Back
  const isFromHome = location.state?.fromHome;

  useEffect(() => {
    // Kunci scroll body saat overlay terbuka
    document.body.style.overflow = 'hidden';

    const fetchBlogDetail = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_URL}/blogs/${id}`);
        setBlog(res.data.data || res.data);
      } catch (err) {
        console.error("Gagal:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogDetail();

    return () => {
      // Kembalikan scroll saat overlay ditutup
      document.body.style.overflow = 'unset';
    };
  }, [id, API_URL]);

  const handleClose = () => {
    navigate('/'); // Kembali ke URL root, App.jsx akan menutup overlay ini
  };

  // Loading Teks Sederhana (Hanya muncul sebentar saat fetch data)
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[50] bg-[var(--bg-main)] flex items-center justify-center text-white/50 animate-pulse">
        Loading Article...
      </div>
    );
  }

  if (!blog) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      // Fixed position menutup seluruh layar
      className="fixed inset-0 z-[50] bg-[var(--bg-main)] overflow-y-auto"
    >
       <main className="pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto min-h-screen">
          {/* Tombol Back hanya muncul jika isFromHome === true */}
          {isFromHome ? (
            <button 
              onClick={handleClose} 
              className="group flex items-center gap-2 text-xs md:text-sm uppercase tracking-widest mb-10 opacity-60 hover:opacity-100 transition-opacity cursor-pointer text-[var(--text-bold)]"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Insights
            </button>
          ) : (
            <div className="mb-10 h-6" /> // Spacer
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--text-bold)] mb-8 leading-tight" style={{ fontFamily: 'var(--font-logo)' }}>
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-[10px] md:text-xs uppercase tracking-widest opacity-60 mb-10 border-y border-white/10 py-6 text-[var(--text-main)]">
                <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
                <span className="flex items-center gap-2"><User size={14} /> Admin</span>
                <span className="flex items-center gap-2"><Clock size={14} /> 5 Min Read</span>
            </div>

            <div className="aspect-video w-full rounded-3xl overflow-hidden border border-[var(--border-nav)] mb-12 shadow-2xl relative group">
              <img src={blog.thumbnailUrl} alt={blog.title} className="w-full h-full object-cover" />
            </div>

            <article className="prose prose-invert prose-lg max-w-none prose-headings:text-[var(--text-bold)] prose-p:text-[var(--text-main)]">
               <div className="whitespace-pre-wrap font-light text-base md:text-xl leading-8 md:leading-9 text-justify text-[var(--text-main)]">
                 {blog.content}
               </div>
            </article>
          </motion.div>
       </main>
    </motion.div>
  );
};

export default BlogOverlay;