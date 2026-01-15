import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Footer = () => {
  const [time, setTime] = useState('');
  const footerRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setTime(timeString);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const { scrollYProgress } = useScroll({
    target: footerRef,
    // Offset disesuaikan agar animasi selesai tepat saat bagian bawah footer menyentuh bawah layar
    offset: ["start end", "end end"]
  });

  // Penyesuaian: Blur dan Opacity selesai lebih awal (di angka 0.9) 
  // untuk memastikan teks tajam sempurna di berbagai ukuran layar.
  const yParallax = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const blurEffect = useTransform(scrollYProgress, [0, 0.8, 0.9], ["blur(12px)", "blur(4px)", "blur(0px)"]);
  const opacityEffect = useTransform(scrollYProgress, [0, 0.7, 0.9], [0, 0.5, 1]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      ref={footerRef}
      className="relative h-screen w-screen overflow-hidden flex flex-col bg-[var(--bg-main)]"
    >
      {/* Background Cloud */}
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 0]) }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="/images/bgcloude.jpg" 
          alt="Cloud Background" 
          className="w-full h-[110%] object-cover"
          style={{ filter: 'var(--cloud-brightness)' }}
        />
      </motion.div>

      <div className="flex-grow" />

      {/* Kontainer Teks Utama */}
      <motion.div 
        style={{ 
          y: yParallax, 
          filter: blurEffect, 
          opacity: opacityEffect 
        }}
        className="relative z-10 w-full max-w-[95vw] md:max-w-[85vw] mx-auto mb-12"
      >
        {/* Nama Utama */}
        <div className="w-full mb-6 md:mb-2 text-center">
          <h2 
            className="text-[10vw] md:text-[11.5vw] font-bold leading-none tracking-[-0.04em] uppercase select-none"
            style={{ 
              fontFamily: 'var(--font-logo)',
              color: 'var(--text-bold)',
            }}
          >
            Fatah Abdilah
          </h2>
        </div>

        {/* Baris Bawah - Rata Tengah di Mobile */}
        <div 
          className="w-full flex flex-col md:flex-row justify-between items-center md:items-end gap-6 md:gap-0 text-[11px] md:text-[14px] font-medium uppercase tracking-[0.1em] md:tracking-[0.2em]"
          style={{ 
            color: 'var(--text-bold)',
          }}
        >
          {/* Lokasi & Waktu - Order 2 di Mobile */}
          <div className="flex-1 text-center md:text-left whitespace-nowrap uppercase order-2 md:order-1">
            JAKARTA — {time}
          </div>

          {/* Role - Order 1 di Mobile agar paling atas */}
          <div className="flex-1 text-center opacity-70 order-1 md:order-2">
            Fullstack Web Developer
          </div>

          {/* Back to Top - Order 3 di Mobile */}
          <div className="flex-1 text-center md:text-right order-3">
            <button 
              onClick={scrollToTop}
              className="hover:italic transition-all duration-300 cursor-pointer"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;