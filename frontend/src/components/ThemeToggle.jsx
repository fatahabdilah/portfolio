import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.removeAttribute('data-theme');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (e) => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';

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
    <button 
      onClick={toggleTheme}
      className="fixed bottom-10 right-10 z-[9999] p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group pointer-events-auto flex items-center justify-center"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon size={20} style={{ color: 'var(--toggle-icon)' }} className="group-hover:text-blue-600 transition-colors duration-300" />
      ) : (
        <Sun size={20} style={{ color: 'var(--toggle-icon)' }} className="group-hover:text-yellow-400 transition-colors duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;