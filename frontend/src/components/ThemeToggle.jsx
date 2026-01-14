import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle = ({ isLoading }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme');
    setIsDark(theme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    setIsDark(!isDark);
  };

  if (isLoading) return null;

  return (
    <motion.button
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="p-4 rounded-full shadow-2xl transition-all duration-500 group relative overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-nav)', // Mengambil warna nav yang sudah semi-transparan
        border: '1px solid var(--border-nav)',
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        color: 'var(--text-bold)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
      }}
    >
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {isDark ? (
        <Sun size={24} className="relative z-10 transition-transform duration-500 rotate-0 group-hover:rotate-45" />
      ) : (
        <Moon size={24} className="relative z-10 transition-transform duration-500 rotate-0 group-hover:-rotate-12" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;