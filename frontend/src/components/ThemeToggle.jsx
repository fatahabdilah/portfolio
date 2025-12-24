import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
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
    
    // Fallback jika browser tidak mendukung View Transition API
    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    // Mengambil koordinat klik untuk titik pusat portal lingkaran
    const x = e.clientX;
    const y = e.clientY;
    document.documentElement.style.setProperty('--x', `${x}px`);
    document.documentElement.style.setProperty('--y', `${y}px`);

    // Memulai animasi View Transition
    document.startViewTransition(() => {
      setTheme(nextTheme);
    });
  };

  return (
    <button 
      onClick={toggleTheme}
      className="fixed bottom-10 right-10 z-[999] p-4 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer group flex items-center justify-center"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        /* Ikon Bulan: Menggunakan variabel --toggle-icon dari CSS */
        <Moon 
          size={22} 
          strokeWidth={2.5}
          className="group-hover:text-blue-600 transition-colors duration-300"
          style={{ color: 'var(--toggle-icon)', stroke: 'currentColor', fill: 'none' }}
        />
      ) : (
        /* Ikon Matahari: Menggunakan variabel --toggle-icon dari CSS */
        <Sun 
          size={22} 
          strokeWidth={2.5}
          className="group-hover:text-yellow-400 transition-colors duration-300"
          style={{ color: 'var(--toggle-icon)', stroke: 'currentColor', fill: 'none' }}
        />
      )}
    </button>
  );
};

export default ThemeToggle;