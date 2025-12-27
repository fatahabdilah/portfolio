import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const imageRef = useRef(null);

  // 1. Scroll Progress Umum untuk Hero
  const { scrollYProgress: pageScroll } = useScroll();
  const yHero = useTransform(pageScroll, [0, 0.2], [0, -100]);
  const opacityHero = useTransform(pageScroll, [0, 0.15], [1, 0]);

  // 2. Scroll Progress KHUSUS untuk Foto About
  const { scrollYProgress: imageScroll } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"]
  });

  // Warna: BW (100) -> Berwarna (0) -> BW (100)
  const grayscaleRaw = useTransform(
    imageScroll,
    [0.3, 0.5, 0.7],
    [100, 0, 100]
  );

  // Rotasi Halus Searah Jarum Jam: 
  // Miring kiri sedikit (-2deg) -> Lurus (0deg) -> Miring kanan sedikit (2deg)
  const rotateRaw = useTransform(
    imageScroll,
    [0.2, 0.5, 0.8],
    [-2, 0, 2]
  );

  const smoothGrayscale = useSpring(grayscaleRaw, { stiffness: 100, damping: 30 });
  const smoothRotate = useSpring(rotateRaw, { stiffness: 80, damping: 25 });

  const filterStyle = useTransform(smoothGrayscale, (v) => `grayscale(${v}%)`);

  return (
    <div className="flex flex-col min-h-screen selection:bg-blue-500 selection:text-white">
      <Header />
      
      <main className="flex-grow pt-56 pb-24 px-8 w-full max-w-5xl mx-auto">
        
        {/* Hero Section */}
        <motion.section 
          style={{ y: yHero, opacity: opacityHero }}
          className="flex flex-col items-center text-center mb-64 relative"
        >
          {/* Latar Belakang Biru Bergerak Pelan */}
          <motion.div 
            animate={{ 
              y: [0, 40, 0],
              x: [0, 25, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" 
          />

          <motion.h1 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-medium tracking-tight leading-[1.1] mb-12" 
            style={{ fontFamily: 'var(--font-logo)', color: 'var(--text-bold)' }}
          >
            Building <br /> 
            Digital <span className="opacity-40 italic ml-3">Experiences.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl text-lg md:text-xl leading-relaxed opacity-60 font-light" 
            style={{ color: 'var(--text-main)' }}
          >
            Crafting aesthetic and functional digital solutions with a focus on high performance and exceptional user experience.
          </motion.p>

          {/* GARIS VERTIKAL (Dibuat Lebih Tebal) */}
          <div className="mt-16 h-20 flex flex-col items-center">
            <motion.div 
              animate={{ y: [0, 24, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-[2px] h-full bg-gradient-to-b from-blue-500 to-transparent opacity-40" 
            />
          </div>
        </motion.section>

        {/* About Section */}
        <section id="about" className="relative z-10 pb-64">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-16 md:gap-28">
            
            {/* Profile Image with Refined Animation */}
            <div ref={imageRef} className="shrink-0 relative">
              <motion.div 
                style={{ 
                  filter: filterStyle,
                  rotate: smoothRotate,
                  perspective: 1000
                }}
                className="w-64 h-80 md:w-80 md:h-[450px] rounded-[3rem] overflow-hidden shadow-2xl bg-slate-200 dark:bg-white/5 border border-slate-200 dark:border-white/10"
              >
                <img 
                  src="/images/Fatah Abdilah.png" 
                  alt="Fatah Abdilah" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            {/* Content Area */}
            <div className="flex flex-col justify-center pt-10">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 opacity-40">
                Profile — 01
              </span>

              <div className="flex flex-col gap-10 text-lg md:text-xl leading-[1.8]" style={{ color: 'var(--text-main)', fontFamily: 'var(--font-sans)' }}>
                <p>
                  I am a Computer Science student focused on Web and Android development, building end-to-end digital solutions with a strong technical foundation[cite: 4, 5].
                </p>
                <p className="opacity-80">
                  I thrive in collaborative environments, working effectively within teams to deliver high-quality results. Committed to solving complex problems and creating impactful software experiences.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ThemeToggle />
    </div>
  );
}

export default App;