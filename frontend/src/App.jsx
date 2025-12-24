import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-blue-500 selection:text-white">
      <Header />
      
      {/* Hero Section */}
      <main className="flex-grow pt-48 pb-24 px-8 w-full max-w-5xl mx-auto">
        <section className="flex flex-col items-center text-center mb-32">
          <div className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold uppercase tracking-[0.3em] border border-blue-600/20 bg-blue-600/5 text-blue-600 rounded-full">
            Available for Freelance
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-10 transition-colors duration-500" style={{ color: 'var(--text-bold)' }}>
            DIGITAL <br /> 
            <span className="text-blue-600 italic">ARCHITECT.</span>
          </h1>
          <p className="max-w-xl text-lg md:text-xl leading-relaxed opacity-80" style={{ color: 'var(--text-main)' }}>
            Saya Fatah Abdilah, seorang Fullstack Developer yang fokus pada pembangunan 
            antarmuka yang estetik dan sistem backend yang tangguh.
          </p>
        </section>

        {/* Bento Grid Layout (Featured Projects) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
          <div className="md:col-span-2 rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-white/[0.02] p-8 flex flex-col justify-end overflow-hidden group relative">
             <div className="absolute top-8 right-8 w-12 h-12 rounded-full border border-blue-600/20 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">↗</div>
             <h3 className="text-2xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-bold)' }}>Project Management App</h3>
             <p className="text-sm opacity-60">Fullstack • MERN Stack</p>
          </div>
          <div className="rounded-[2.5rem] bg-blue-600 p-8 flex flex-col justify-end text-white shadow-2xl shadow-blue-600/20">
             <h3 className="text-2xl font-bold tracking-tight mb-2">Clean Code</h3>
             <p className="text-sm opacity-80">Prioritas utama dalam setiap baris kode.</p>
          </div>
          <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-white/[0.02] p-8 flex flex-col justify-center items-center text-center">
             <span className="text-4xl font-black text-blue-600 mb-2">10+</span>
             <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Projects Completed</p>
          </div>
          <div className="md:col-span-2 rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-white/[0.02] p-8 flex items-center justify-between">
             <div className="max-w-[60%]">
               <h3 className="text-xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-bold)' }}>Latest Blog</h3>
               <p className="text-sm opacity-60">Optimasi Performa Mongoose di Skala Besar.</p>
             </div>
             <button className="px-6 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform">Read More</button>
          </div>
        </div>
      </main>

      <Footer />
      <ThemeToggle />
    </div>
  );
}

export default App;