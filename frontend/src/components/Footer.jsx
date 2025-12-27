import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full max-w-5xl mx-auto px-8 py-20 mt-20 border-t border-slate-200 dark:border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        <div className="flex flex-col">
          <span className="text-4xl mb-6 select-none" 
                style={{ 
                  color: 'var(--text-bold)', 
                  fontFamily: 'var(--font-logo)',
                  fontWeight: 600
                }}>
            FA.
          </span>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 leading-relaxed" style={{ color: 'var(--text-main)' }}>
            © 2025 Fatah Abdilah. <br /> All rights reserved.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-20">
          <div className="flex flex-col gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="opacity-30">Socials</span>
            {['Github', 'LinkedIn', 'Instagram'].map((s) => (
              <a key={s} href="#" className="opacity-70 hover:opacity-100 transition-opacity" style={{ color: 'var(--text-bold)' }}>{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;