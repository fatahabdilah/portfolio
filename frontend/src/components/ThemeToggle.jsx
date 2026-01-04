import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ isLoading }) => {
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

  const toggleTheme = () => {
    // Transisi sekarang hanya mengandalkan CSS transition di index.css
    // Ini 100% aman dari bug scroll meloncat
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button 
      onClick={toggleTheme}
      className={`fixed bottom-10 right-10 z-[10000] p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-500 group flex items-center justify-center cursor-pointer ${
        isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors duration-300" />
      ) : (
        <Sun size={20} className="text-slate-400 group-hover:text-yellow-400 transition-colors duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;