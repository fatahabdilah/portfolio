import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

const Header = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'auto');

  useEffect(() => {
    const root = window.document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const applyTheme = (t) => {
      if (t === 'dark' || (t === 'auto' && systemDark)) {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
    };
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (e) => {
    const modes = ['light', 'dark', 'auto'];
    const nextTheme = modes[(modes.indexOf(theme) + 1) % modes.length];

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    document.documentElement.style.setProperty('--x', `${x}px`);
    document.documentElement.style.setProperty('--y', `${y}px`);

    document.startViewTransition(() => {
      setTheme(nextTheme);
    });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-6 pointer-events-none">
      <header className="w-full max-w-5xl flex justify-between items-center px-8 py-4 rounded-3xl border border-white/20 backdrop-blur-xl shadow-xl pointer-events-auto transition-all duration-300"
              style={{ backgroundColor: 'var(--nav-bg)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="text-xl font-bold tracking-tighter dark:text-white transition-colors">
            Fatah<span className="text-blue-600">.Dev</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-10">
          {['Home', 'Projects', 'Blog'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">
              {item}
            </a>
          ))}
        </nav>

        <button 
          onClick={toggleTheme}
          className="p-3 bg-slate-100 dark:bg-zinc-900 text-slate-800 dark:text-white rounded-2xl hover:scale-110 active:scale-95 transition-all border border-slate-200 dark:border-zinc-800 cursor-pointer"
        >
          {theme === 'light' ? <Sun size={20} /> : theme === 'dark' ? <Moon size={20} /> : <Monitor size={20} />}
        </button>
      </header>
    </div>
  );
};

export default Header;