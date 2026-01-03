import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // --- PARALLAX INTENSITY (Tetap Kuat) ---
  const yV1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const yV2 = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const yV3 = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);
  const yV4 = useTransform(scrollYProgress, [0, 1], ["0%", "-150%"]);
  const yV5 = useTransform(scrollYProgress, [0, 1], ["0%", "-220%"]);

  // Profile Image Logic
  const { scrollYProgress: imageScroll } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"]
  });
  const grayscaleValue = useTransform(imageScroll, [0.3, 0.45, 0.55, 0.7], [100, 0, 0, 100]);
  const rotateValue = useTransform(imageScroll, [0.3, 0.5, 0.7], [-5, 0, 5]);
  const filterStyle = useTransform(grayscaleValue, (v) => `grayscale(${v}%)`);

  // Floating Animation
  const smoothFloat = (d) => ({
    animate: { y: [0, 15, 0], rotate: [-2, 2, -2] },
    transition: { duration: d, repeat: Infinity, ease: "easeInOut" }
  });

  const gpuStyle = { willChange: "transform", translateZ: 0 };

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen transition-colors duration-700 bg-[var(--bg-main)] overflow-hidden">
      <Header />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative h-[100vh] flex items-center justify-center px-8 overflow-hidden">
          
          <div className="absolute inset-0 pointer-events-none select-none">
            {/* --- SCULPTURES (Sesuai ingatan: w-[36vw]) --- */}
            <motion.img 
              style={{ ...gpuStyle, y: yV3 }} 
              src="/images/collage/sculpture1.png" 
              className="absolute left-[-5%] top-[15%] w-[36vw] z-10" 
            />
            <motion.img 
              style={{ ...gpuStyle, y: yV4 }} 
              src="/images/collage/sculpture2.png" 
              className="absolute right-[-3%] top-[0%] w-[36vw] z-10" 
            />

            {/* --- FLOWERS (Unit vw untuk sinkronisasi zoom) --- */}
            <motion.div style={{ ...gpuStyle, y: yV1 }} className="absolute left-[18%] top-[5%] w-[10vw] blur-[2px]">
              <motion.img {...smoothFloat(12)} src="/images/collage/flower1.png" className="w-full" />
            </motion.div>

            <motion.div style={{ ...gpuStyle, y: yV2 }} className="absolute left-[25%] bottom-[4%] w-[12vw] blur-[2px]">
              <motion.img {...smoothFloat(14)} src="/images/collage/flower3.png" className="w-full" />
            </motion.div>

            <motion.div style={{ ...gpuStyle, y: yV3 }} className="absolute left-[12%] bottom-[8%] w-[18vw] z-20">
              <motion.img {...smoothFloat(10)} src="/images/collage/flower2.png" className="w-full" />
            </motion.div>

            <motion.div style={{ ...gpuStyle, y: yV3 }} className="absolute right-[7%] bottom-[15%] w-[20vw] z-20">
              <motion.img {...smoothFloat(13)} src="/images/collage/flower1.png" className="w-full" />
            </motion.div>

            <motion.div style={{ ...gpuStyle, y: yV4 }} className="absolute right-[25%] top-[10%] w-[12vw] z-20">
              <motion.img {...smoothFloat(11)} src="/images/collage/flower3.png" className="w-full" />
            </motion.div>

            <motion.div style={{ ...gpuStyle, y: yV4 }} className="absolute left-[22%] top-[5%] w-[15vw] z-30">
              <motion.img {...smoothFloat(9)} src="/images/collage/flower3.png" className="w-full" />
            </motion.div>

            <motion.div style={{ ...gpuStyle, y: yV5 }} className="absolute right-[20%] bottom-[2%] w-[14vw] z-30 blur-[1px]">
              <motion.img {...smoothFloat(12)} src="/images/collage/flower1.png" className="w-full" />
            </motion.div>
            
            <motion.div style={{ ...gpuStyle, y: yV5 }} className="absolute right-[23%] top-[60%] w-[10vw] z-30">
              <motion.img {...smoothFloat(8)} src="/images/collage/flower2.png" className="w-full" />
            </motion.div>
          </div>

          {/* Hero Text (Size Reduced to 6vw) */}
          <motion.div className="relative z-40 text-center">
            <h1 className="text-5xl md:text-[6vw] font-medium tracking-tight leading-[1.1] mb-8" style={{ fontFamily: 'var(--font-logo)', color: 'var(--text-bold)' }}>
              Building <br /> 
              <span className="opacity-40 italic" style={{ color: 'var(--text-main)' }}>Digital Experiences.</span>
            </h1>
            <p className="max-w-xl mx-auto text-base md:text-lg leading-relaxed font-light px-4" style={{ color: 'var(--text-main)' }}>
              Crafting aesthetic and functional digital solutions with a focus on high performance and exceptional user experience.
            </p>
          </motion.div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="relative z-50 py-32 px-8 w-full max-w-5xl mx-auto scroll-mt-32">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-16 md:gap-28">
            <div ref={imageRef} className="shrink-0 relative">
              <motion.div style={{ filter: filterStyle, rotate: rotateValue, ...gpuStyle }} className="w-[20vw] min-w-[250px] aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-100 dark:bg-zinc-900">
                <img src="/images/Fatah Abdilah.png" alt="Fatah Abdilah" className="w-full h-full object-cover scale-110" loading="lazy" />
              </motion.div>
            </div>
            <div className="flex flex-col justify-center pt-10">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 opacity-40" style={{ color: 'var(--text-bold)' }}>Profile — 01</span>
              <div className="flex flex-col gap-8 text-lg md:text-xl leading-[1.8] font-light tracking-tight" style={{ color: 'var(--text-main)', fontFamily: 'var(--font-sans)' }}>
                <p>I am a Computer Science student focused on Web and Android development, building end-to-end digital solutions with a strong technical foundation.</p>
                <p>I thrive in collaborative environments, working effectively within teams to deliver high-quality results.</p>
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