import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const zoomRef = useRef(null);

  // --- LOGIC SCROLL & PARALLAX HERO ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yV3 = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);
  const yV4 = useTransform(scrollYProgress, [0, 1], ["0%", "-150%"]);
  const yV1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const yV2 = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const yV5 = useTransform(scrollYProgress, [0, 1], ["0%", "-220%"]);

  // Profile Video Logic
  const { scrollYProgress: imageScroll } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"]
  });
  const grayscaleValue = useTransform(imageScroll, [0.3, 0.45, 0.55, 0.7], [100, 0, 0, 100]);
  const rotateValue = useTransform(imageScroll, [0.3, 0.5, 0.7], [-5, 0, 5]);
  const filterStyle = useTransform(grayscaleValue, (v) => `grayscale(${v}%)`);

  // --- LOGIC ZOOM SECTION ---
  const { scrollYProgress: zoomScroll } = useScroll({
    target: zoomRef,
    offset: ["start end", "end start"]
  });

  const frameScale = useTransform(zoomScroll, [0.2, 0.5, 0.85], [1.1, 5, 12]);
  const bgScale = useTransform(zoomScroll, [0.2, 0.5, 0.85], [0.45, 1.4, 1.8]);
  const bgX = useTransform(zoomScroll, [0.2, 0.5], ["-1.5%", "0%"]);

  /**
   * FIX LOGIC PENGGELAPAN:
   * Kita membuat brightness berkurang (menggelap sedikit) seiring zoom.
   * Dari brightness 1 (normal) ke 0.7 (agak gelap).
   */
  const bgBrightness = useTransform(zoomScroll, [0.4, 0.8], [1, 0.7]);
  const brightnessStyle = useTransform(bgBrightness, (v) => `brightness(${v})`);

  const opacityExperience = useTransform(zoomScroll, [0.4, 0.7], [0, 1]);
  const yExperience = useTransform(zoomScroll, [0.4, 0.7], [100, 0]);

  const smoothFloat = (d) => ({
    animate: { y: [0, 15, 0], rotate: [-2, 2, -2] },
    transition: { duration: d, repeat: Infinity, ease: "easeInOut" }
  });

  const gpuStyle = { 
    willChange: "transform", 
    translateZ: 0,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden"
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loader" onFinished={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <Header />
      <ThemeToggle isLoading={isLoading} />

      <div className="main-content">
        <div 
          ref={containerRef} 
          className="flex flex-col min-h-screen bg-[var(--bg-main)]"
        >
          <main className="flex-grow">
            
            {/* HERO SECTION */}
            <section className="relative h-[100vh] flex items-center justify-center px-8 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none select-none">
                <motion.img style={{ ...gpuStyle, y: yV3 }} src="/images/collage/sculpture1.png" className="absolute left-[-10%] top-[15%] w-[36vw] z-10" />
                <motion.img style={{ ...gpuStyle, y: yV4 }} src="/images/collage/sculpture2.png" className="absolute right-[-3%] top-[0%] w-[36vw] z-10" />
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
            <section id="about" className="relative z-50 py-32 px-8 w-full max-w-5xl mx-auto scroll-mt-10">
              <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-28">
                <div ref={imageRef} className="shrink-0 relative">
                  <motion.div style={{ filter: filterStyle, rotate: rotateValue }} className="relative w-[20vw] min-w-[280px] aspect-[3/4] flex items-center justify-center overflow-hidden">
                    <div className="w-[58%] h-[58%] overflow-hidden rounded-full bg-zinc-800 shadow-inner transform translate-y-1">
                      <video src="/images/profile-video.mp4" className="w-full h-full object-cover" autoPlay loop muted playsInline />
                    </div>
                    <img src="/images/frame-oval.png" alt="Frame" className="absolute w-full h-full object-contain pointer-events-none z-10" />
                  </motion.div>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 opacity-40" style={{ color: 'var(--text-bold)' }}>Profile — 01</span>
                  <div className="flex flex-col gap-8 text-lg md:text-xl leading-[1.8] font-light tracking-tight" style={{ color: 'var(--text-main)', fontFamily: 'var(--font-sans)' }}>
                    <p>I am a Computer Science student focused on Web and Android development, building end-to-end digital solutions.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* --- ZOOM SECTION --- */}
            <section ref={zoomRef} className="relative h-[400vh] w-full mt-0">
              <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full flex items-center justify-center" style={{ isolation: 'isolate' }}>
                  
                  {/* Background Foto - Filter Brightness Langsung di Sini */}
                  <motion.div 
                    style={{ scale: bgScale, x: bgX, filter: brightnessStyle, ...gpuStyle }} 
                    className="absolute w-[85vw] h-[70vh] md:w-[79.4vw] md:h-[123vh] overflow-hidden rounded-3xl z-0"
                  >
                    <img src="/images/bg-landscape.jpeg" alt="Landscape" className="w-full h-full object-cover" />
                  </motion.div>

                  {/* Frame Landscape */}
                  <motion.div 
                    style={{ scale: frameScale, x: "-2.2%", ...gpuStyle }} 
                    className="absolute w-[85vw] h-[70vh] md:w-[69vw] md:h-[80vh] z-10 flex items-center justify-center pointer-events-none"
                  >
                    <img src="/images/frame-landscape.png" alt="Frame" className="absolute w-full h-full object-contain scale-[1.15]" />
                  </motion.div>

                  {/* Experience Overlay Content - Blur Dihilangkan */}
                  <motion.div id="experience" style={{ opacity: opacityExperience, y: yExperience }} className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-auto">
                    <div className="text-center text-white p-8 max-w-4xl">
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 block opacity-60">Experience — 02</span>
                      <h2 className="text-5xl md:text-8xl font-bold mb-6" style={{ fontFamily: 'var(--font-logo)' }}>The Journey</h2>
                      <p className="text-lg md:text-xl opacity-80 font-light leading-relaxed">Refining digital craftsmanship through continuous exploration.</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;