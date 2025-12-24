import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full max-w-5xl mx-auto px-8 py-12 border-t border-slate-200 dark:border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-xl font-black tracking-tighter mb-2" style={{ color: 'var(--text-bold)' }}>
            F<span className="text-blue-600">A</span>
          </span>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50" style={{ color: 'var(--text-main)' }}>
            © 2024 Fatah Abdilah. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-8">
          {['Github', 'LinkedIn', 'Instagram'].map((social) => (
            <a 
              key={social}
              href={`#${social.toLowerCase()}`}
              className="text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-blue-600 opacity-60 hover:opacity-100"
              style={{ color: 'var(--text-main)' }}
            >
              {social}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;