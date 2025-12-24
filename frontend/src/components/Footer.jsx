import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-12 mt-auto border-t transition-colors duration-500" 
            style={{ 
              backgroundColor: 'var(--footer-bg)', 
              borderColor: 'var(--footer-border)' 
            }}>
      <div className="max-w-5xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold tracking-tight text-[var(--text-main)]">Fatah Abdilah</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Fullstack Developer & UI Enthusiast.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex gap-8">
               <a href="#" className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em]">Github</a>
               <a href="#" className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em]">Linkedin</a>
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-300 dark:text-slate-700 font-bold mt-2">
              &copy; {currentYear} — Handcrafted with Care
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;