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

    // Jika browser tidak mendukung API baru, langsung ganti tema
    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    // Ambil koordinat klik untuk animasi CSS
    const x = e.clientX;
    const y = e.clientY;
    document.documentElement.style.setProperty('--x', `${x}px`);
    document.documentElement.style.setProperty('--y', `${y}px`);

    // Mulai View Transition
    document.startViewTransition(() => {
      setTheme(nextTheme);
    });
  };

  const Icon = () => {
    if (theme === 'light') return <Sun size={20} />;
    if (theme === 'dark') return <Moon size={20} />;
    return <Monitor size={20} />;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
      <header className="w-full max-w-5xl flex justify-between items-center px-8 py-4 rounded-3xl border border-white/20 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="text-xl font-bold tracking-tighter dark:text-white transition-colors">
            Fatah<span className="text-blue-600">.Dev</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-10">
          <a href="/" className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-blue-600">Home</a>
          <a href="#projects" className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-blue-600">Projects</a>
          <a href="#blogs" className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-blue-600">Blog</a>
        </nav>

        <button 
          onClick={toggleTheme}
          className="p-3 bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-white rounded-2xl hover:scale-110 active:scale-95 transition-all border border-black/5 dark:border-white/10 cursor-pointer"
        >
          <Icon />
        </button>
      </header>
    </div>
  );
};

export default Header;