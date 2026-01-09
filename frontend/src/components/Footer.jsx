import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Footer = () => {
  const [time, setTime] = useState('');
  const footerRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Menggunakan format toLocaleTimeString untuk presisi detik yang lebih terjamin
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
    offset: ["start end", "end end"]
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const blurEffect = useTransform(scrollYProgress, [0.7, 1], ["blur(10px)", "blur(0px)"]);
  const opacityEffect = useTransform(scrollYProgress, [0.7, 1], [0, 1]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      ref={footerRef}
      className="relative h-screen w-screen overflow-hidden flex flex-col bg-[var(--bg-main)]"
    >
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

      <motion.div 
        style={{ 
          y: yParallax, 
          filter: blurEffect, 
          opacity: opacityEffect 
        }}
        className="relative z-10 w-full max-w-[95vw] md:max-w-[85vw] mx-auto mb-12"
      >
        <div className="w-full mb-2 text-center">
          <h2 
            className="text-[10vw] md:text-[11.5vw] font-bold leading-none tracking-[-0.04em] uppercase select-none"
            style={{ 
              fontFamily: 'var(--font-logo)',
              color: 'var(--bg-main)',
              mixBlendMode: 'difference'
            }}
          >
            Fatah Abdilah
          </h2>
        </div>

        <div 
          className="w-full flex flex-row justify-between items-end text-[10px] md:text-[14px] font-medium uppercase tracking-[0.1em] md:tracking-[0.2em]"
          style={{ 
            color: 'var(--bg-main)',
            mixBlendMode: 'difference'
          }}
        >
          <div className="flex-1 text-left whitespace-nowrap uppercase">
            JAKARTA — {time}
          </div>

          <div className="flex-1 text-center opacity-70 hidden md:block">
            Fullstack Web Developer
          </div>

          <div className="flex-1 text-right">
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