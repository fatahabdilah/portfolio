import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 3;

  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const zoomRef = useRef(null);
  const projectSectionRef = useRef(null);
  const blogSectionRef = useRef(null);

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsLoading(true);
    window.history.replaceState(null, "", window.location.pathname);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.replaceState(null, "", window.location.pathname);
  };

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yV1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const yV2 = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const yV3 = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);
  const yV4 = useTransform(scrollYProgress, [0, 1], ["0%", "-150%"]);
  const yV5 = useTransform(scrollYProgress, [0, 1], ["0%", "-220%"]);

  // About Scroll Logic
  const { scrollYProgress: aboutScroll } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"]
  });
  const filterStyle = useTransform(aboutScroll, [0.3, 0.45, 0.55, 0.7], ["grayscale(100%)", "grayscale(0%)", "grayscale(0%)", "grayscale(100%)"]);
  const rotateValue = useTransform(aboutScroll, [0.3, 0.5, 0.7], [-5, 0, 5]);
  const yAboutBg = useTransform(aboutScroll, [0, 1], ["-10%", "10%"]);

  const { scrollYProgress: zoomScroll } = useScroll({
    target: zoomRef,
    offset: ["start start", "end start"]
  });

  const frameScale = useTransform(zoomScroll, [0, 0.5], [1.1, 12]);
  const bgScale = useTransform(zoomScroll, [0, 0.17, 0.5], [0.44, 1.4, 1.8]); 
  const bgBrightnessScroll = useTransform(zoomScroll, [0.2, 0.5], [1, 0.6]);
  const brightnessStyle = useTransform(bgBrightnessScroll, (v) => `brightness(${v})`);

  const opacityExperience = useTransform(zoomScroll, [0.3, 0.45], [0, 1]);
  const yExperienceContent = useTransform(zoomScroll, [0.3, 0.9], [150, -800]); 
  const pointerEvents = useTransform(zoomScroll, [0.4, 0.41], ["none", "auto"]);

  const { scrollYProgress: projectScroll } = useScroll({
    target: projectSectionRef,
    offset: ["start end", "end end"]
  });

  const yProjectTitle = useTransform(projectScroll, [0, 0.4], [50, 0]);
  const opacityProjectTitle = useTransform(projectScroll, [0, 0.4], [0, 1]);
  const xProjectsRow1 = useTransform(projectScroll, [0.2, 1], ["0%", "-35%"]);
  const xProjectsRow2 = useTransform(projectScroll, [0.2, 1], ["-35%", "0%"]);

  // Blog Scroll Logic
  const { scrollYProgress: blogScroll } = useScroll({
    target: blogSectionRef,
    offset: ["start end", "end start"]
  });

  const blogTitleY = useTransform(blogScroll, [0, 1], [0, -100]);
  const blogListY = useTransform(blogScroll, [0, 1], [150, -350]); 
  const yBlogBg = useTransform(blogScroll, [0, 1], ["-10%", "10%"]);

  const experiences = [
    { title: "Frontend Developer", company: "Tech Solutions", year: "2024", image: "/images/collage/sculpture1.png", detail: "Developing high-performance web applications using React and Framer Motion." },
    { title: "UI/UX Designer", company: "Creative Agency", year: "2023", image: "/images/collage/flower1.png", detail: "Crafting intuitive user interfaces and aesthetic digital experiences." },
    { title: "Mobile Specialist", company: "App Studio", year: "2023", image: "/images/collage/sculpture2.png", detail: "Building seamless Android solutions with a focus on smooth interactions." },
    { title: "Web Enthusiast", company: "Freelance", year: "2022", image: "/images/collage/flower3.png", detail: "Exploring modern web technologies and building responsive layouts." }
  ];

  const projectsRow1 = [
    { title: "Lumina Dashboard", category: "Web Design", image: "/images/collage/flower1.png" },
    { title: "Aether Mobile", category: "Mobile App", image: "/images/collage/sculpture1.png" },
    { title: "Chronos Portal", category: "E-Commerce", image: "/images/collage/flower2.png" },
    { title: "Nova Identity", category: "Branding", image: "/images/collage/sculpture2.png" },
  ];

  const projectsRow2 = [
    { title: "Zenith App", category: "Utility", image: "/images/collage/flower3.png" },
    { title: "Vortex Web", category: "SaaS", image: "/images/collage/sculpture1.png" },
    { title: "Solaris UI", category: "Design System", image: "/images/collage/flower1.png" },
    { title: "Nebula Core", category: "Backend", image: "/images/collage/sculpture2.png" },
  ];

  const allBlogs = [
    { title: "The Future of Web Animation", date: "Jan 12, 2024", category: "Design", image: "/images/collage/flower1.png" },
    { title: "Mastering Framer Motion", date: "Feb 05, 2024", category: "Tech", image: "/images/collage/sculpture1.png" },
    { title: "Minimalism in UI Design", date: "Mar 20, 2024", category: "Opinion", image: "/images/collage/flower3.png" },
    { title: "React Performance Tips", date: "Apr 15, 2024", category: "Dev", image: "/images/collage/sculpture2.png" },
    { title: "Digital Craftsmanship", date: "May 02, 2024", category: "Aesthetic", image: "/images/collage/flower2.png" },
    { title: "Modern Workflow", date: "Jun 18, 2024", category: "Productivity", image: "/images/collage/flower1.png" },
  ];

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = allBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(allBlogs.length / blogsPerPage);

  const smoothFloat = (d) => ({
    animate: { y: [0, 15, 0], rotate: [-2, 2, -2] },
    transition: { duration: d, repeat: Infinity, ease: "easeInOut" }
  });

  const gpuStyle = { willChange: "transform", translateZ: 0, backfaceVisibility: "hidden" };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loader" onFinished={() => setIsLoading(false)} />}
      </AnimatePresence>

      <Header onHomeClick={scrollToTop} onLogoClick={handleLogoClick} />
      <ThemeToggle isLoading={isLoading} />

      <div className="main-content" onMouseMove={handleMouseMove}>
        <motion.div
          className="fixed pointer-events-none z-[100] w-[280px] h-[350px] overflow-hidden rounded-2xl shadow-2xl border border-[var(--border-main)] backdrop-blur-md"
          style={{
            left: cursorX,
            top: cursorY,
            x: "-50%",
            y: "-50%",
            scale: hoveredIndex !== null ? 1 : 0,
            opacity: hoveredIndex !== null ? 1 : 0,
            background: "rgba(var(--bg-main-rgb, 255, 255, 255), 0.2)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
          }}
        >
          <AnimatePresence mode="wait">
            {hoveredIndex !== null && (
              <motion.img 
                key={experiences[hoveredIndex]?.image || hoveredIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                src={experiences[hoveredIndex]?.image} 
                className="w-full h-full object-contain p-6 relative z-10"
              />
            )}
          </AnimatePresence>
        </motion.div>

        <div ref={containerRef} className="flex flex-col min-h-screen bg-[var(--bg-main)]">
          <main className="flex-grow">
            
            {/* HERO */}
            <section id="home" className="relative h-[100vh] flex items-center justify-center px-8 overflow-hidden">
              {/* Home elements... */}
              <div className="absolute inset-0 pointer-events-none select-none">
                <motion.div style={{ ...gpuStyle, y: yV1 }} className="absolute left-[22%] top-[12%] w-[12vw] z-20">
                  <motion.img {...smoothFloat(11)} src="/images/collage/flower1.png" className="w-full" />
                </motion.div>
                <motion.img style={{ ...gpuStyle, y: yV3 }} src="/images/collage/sculpture1.png" className="absolute left-[-10%] top-[15%] w-[36vw] z-10" />
                <motion.img style={{ ...gpuStyle, y: yV4 }} src="/images/collage/sculpture2.png" className="absolute right-[-3%] top-[0%] w-[36vw] z-10" />
                <motion.div style={{ ...gpuStyle, y: yV1 }} className="absolute left-[18%] top-[5%] w-[10vw] blur-[2px]">
                  <motion.img {...smoothFloat(12)} src="/images/collage/flower1.png" className="w-full" />
                </motion.div>
                <motion.div style={{ ...gpuStyle, y: yV2 }} className="absolute left-[25%] bottom-[4%] w-[12vw] blur-[2px]">
                  <motion.img {...smoothFloat(14)} src="/images/collage/flower3.png" className="w-full" />
                </motion.div>
                <motion.div style={{ ...gpuStyle, y: yV3 }} className="absolute left-[13%] bottom-[8%] w-[17vw] z-20">
                  <motion.img {...smoothFloat(10)} src="/images/collage/flower2.png" className="w-full" />
                </motion.div>
                <motion.div style={{ ...gpuStyle, y: yV3 }} className="absolute right-[8%] bottom-[15%] w-[18vw] z-20">
                  <motion.img {...smoothFloat(13)} src="/images/collage/flower1.png" className="w-full" />
                </motion.div>
                <motion.div style={{ ...gpuStyle, y: yV4 }} className="absolute right-[25%] top-[10%] w-[12vw] z-20">
                  <motion.img {...smoothFloat(11)} src="/images/collage/flower3.png" className="w-full" />
                </motion.div>
                <motion.div style={{ ...gpuStyle, y: yV5 }} className="absolute right-[20%] bottom-[2%] w-[14vw] blur-[1px]">
                  <motion.img {...smoothFloat(12)} src="/images/collage/flower1.png" className="w-full" />
                </motion.div>
                <motion.div style={{ ...gpuStyle, y: yV5 }} className="absolute right-[20%] top-[60%] w-[10vw] z-30">
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

            {/* --- SECTION ABOUT --- */}
            <section id="about" className="relative py-32 px-8 w-full min-h-screen overflow-hidden flex items-center justify-center">
              {/* Gambar Awan - Brightness menggunakan CSS Variable agar responsif terhadap ganti tema */}
              <motion.div 
                style={{ y: yAboutBg }}
                className="absolute inset-0 z-0 pointer-events-none"
              >
                <img 
                  src="/images/bgcloude.jpg" 
                  alt="Cloud Background"
                  className="w-full h-[120%] object-cover transition-all duration-700"
                  style={{ filter: 'var(--cloud-brightness)' }} 
                />
              </motion.div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-16 md:gap-28 max-w-5xl mx-auto">
                <div ref={imageRef} className="shrink-0 relative">
                  <motion.div style={{ filter: filterStyle, rotate: rotateValue }} className="relative w-[20vw] min-w-[280px] aspect-[3/4] flex items-center justify-center overflow-hidden">
                    <div className="w-[58%] h-[58%] overflow-hidden rounded-full bg-zinc-800 transform translate-y-1">
                      <video src="/images/profile-video.mp4" className="w-full h-full object-cover" autoPlay loop muted playsInline />
                    </div>
                    <img src="/images/frame-oval.png" alt="Frame" className="absolute w-full h-full object-contain pointer-events-none z-10" />
                  </motion.div>
                </div>
                <div className="flex flex-col justify-center text-left">
                  <div className="mb-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 block opacity-40" style={{ color: 'var(--text-bold)' }}>About — I</span>
                    <h2 className="text-4xl md:text-6xl font-bold opacity-80" style={{ fontFamily: 'var(--font-logo)', color: 'var(--text-bold)' }}>The Essence.</h2>
                  </div>
                  <div className="flex flex-col gap-8 text-lg md:text-xl leading-[1.8] font-light tracking-tight" style={{ color: 'var(--text-main)' }}>
                    <p>I am a Computer Science student focused on Web and Android development, building end-to-end digital solutions.</p>
                    <p>Passionate about creating fluid animations and minimal interfaces that bridge the gap between design and technology.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* EXPERIENCE */}
            <div className="relative overflow-visible">
              <div id="experience" className="absolute top-[310vh] left-0 w-full h-1 pointer-events-none z-[100]" />
              <section ref={zoomRef} className="relative h-[600vh] w-full z-20 bg-[var(--bg-main)] shadow-[0_40px_60px_-20px_rgba(0,0,0,0.3)]">
                <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-start overflow-hidden bg-[var(--bg-main)]">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div style={{ scale: bgScale, filter: brightnessStyle, ...gpuStyle, zIndex: 5 }} className="absolute w-[85vw] h-[70vh] md:w-[79.4vw] md:h-[123vh] overflow-hidden rounded-3xl">
                      <img src="/images/bg-landscape.jpeg" alt="Landscape" className="w-full h-full object-cover" />
                    </motion.div>
                    <motion.div style={{ scale: frameScale, ...gpuStyle, zIndex: 10 }} className="absolute w-[85vw] h-[70vh] md:w-[69vw] md:h-[80vh]">
                      <img src="/images/frame-landscape.png" alt="Frame" className="absolute w-full h-full object-contain scale-[1.15]" />
                    </motion.div>
                  </div>
                  <motion.div style={{ opacity: opacityExperience, y: yExperienceContent, pointerEvents: pointerEvents }} className="relative z-20 w-full max-w-5xl px-8 pt-[45vh] pb-[25vh]">
                    <div className="text-center mb-16">
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 block opacity-60" style={{ color: 'var(--bg-main)' }}>Experience — II</span>
                      <h2 className="text-5xl md:text-8xl font-bold opacity-80" style={{ fontFamily: 'var(--font-logo)', color: 'var(--bg-main)' }}>The Journey</h2>
                    </div>
                    <div className="flex flex-col border-t border-[var(--bg-main)]/20">
                      {experiences.map((exp, index) => (
                        <div key={index} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} className="group relative flex flex-col md:flex-row items-start md:items-center justify-between py-10 border-b border-[var(--bg-main)]/20 cursor-pointer transition-all duration-300 hover:px-6">
                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-30" style={{ color: 'var(--bg-main)' }}>{exp.year}</span>
                            <h3 className="text-2xl md:text-5xl font-medium transition-all duration-500 group-hover:italic opacity-80" style={{ color: 'var(--bg-main)' }}>{exp.title}</h3>
                          </div>
                          <div className="flex flex-col md:items-end mt-4 md:mt-0 gap-1">
                            <span className="text-xl opacity-60" style={{ color: 'var(--bg-main)' }}>{exp.company}</span>
                            <p className="text-sm max-w-sm md:text-right opacity-30" style={{ color: 'var(--bg-main)' }}>{exp.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="h-[15vh] w-full" />
                  </motion.div>
                </div>
              </section>

              {/* PROJECTS */}
              <div id="projects" className="absolute top-[600vh] left-0 w-full h-1 pointer-events-none z-[100]" />
              <section ref={projectSectionRef} className="relative h-[400vh] bg-[var(--bg-main)] z-10 -mt-[150vh]">
                <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
                  <motion.div style={{ y: yProjectTitle, opacity: opacityProjectTitle }} className="w-full text-center pt-[18vh] mb-[4vh]">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-2 block opacity-40" style={{ color: 'var(--text-bold)' }}>Project — III</span>
                    <h2 className="text-4xl md:text-7xl font-medium tracking-tighter whitespace-nowrap" style={{ fontFamily: 'var(--font-logo)', color: 'var(--text-bold)' }}>Curated <span className="opacity-40 italic">Portfolio.</span></h2>
                  </motion.div>
                  <div className="flex flex-col gap-[3vh] w-full flex-grow justify-center pb-[8vh]">
                    <motion.div style={{ x: xProjectsRow1 }} className="flex gap-[4vh] px-8">
                      {[...projectsRow1, ...projectsRow1].map((proj, i) => (
                        <div key={i} className="shrink-0 h-[28vh] aspect-video group relative overflow-hidden rounded-3xl border border-[var(--border-main)]">
                          <img src={proj.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={proj.title} />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6"><h4 className="text-white text-xl font-medium">{proj.title}</h4></div>
                        </div>
                      ))}
                    </motion.div>
                    <motion.div style={{ x: xProjectsRow2 }} className="flex gap-[4vh] px-8">
                      {[...projectsRow2, ...projectsRow2].map((proj, i) => (
                        <div key={i} className="shrink-0 h-[28vh] aspect-video group relative overflow-hidden rounded-3xl border border-[var(--border-main)]">
                          <img src={proj.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={proj.title} />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6"><h4 className="text-white text-xl font-medium">{proj.title}</h4></div>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* --- SECTION BLOG --- */}
              <section ref={blogSectionRef} className="relative z-30 min-h-screen overflow-hidden flex flex-col justify-center">
                {/* Gambar Awan - Brightness menggunakan CSS Variable */}
                <motion.div 
                  style={{ y: yBlogBg }}
                  className="absolute inset-0 z-0 pointer-events-none"
                >
                  <img 
                    src="/images/bgcloude.jpg" 
                    alt="Cloud Background"
                    className="w-full h-[120%] object-cover transition-all duration-500"
                    style={{ filter: 'var(--cloud-brightness)' }}
                  />
                </motion.div>

                <div className="max-w-7xl mx-auto relative w-full pt-16 flex flex-col items-center z-10">
                  <div id="blog" className="absolute left-0 w-full h-1 pointer-events-none" />
                  
                  <motion.div 
                    style={{ y: blogTitleY }}
                    className="text-center mb-0 z-10 pointer-events-none sticky top-40"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] block opacity-40" style={{ color: 'var(--text-bold)' }}>Blog — IV</span>
                    <h2 className="text-5xl md:text-[10vw] font-bold leading-none" style={{ fontFamily: 'var(--font-logo)', color: 'var(--text-bold)' }}>Insights.</h2>
                  </motion.div>

                  <motion.div 
                    style={{ y: blogListY }}
                    className="relative z-20 mt-50 grid grid-cols-1 md:grid-cols-3 gap-8 mb-4 items-stretch w-full"
                  >
                    <AnimatePresence mode="wait">
                      {currentBlogs.map((blog, i) => (
                        <motion.div key={blog.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="group flex flex-col gap-4">
                          <div className="relative aspect-video overflow-hidden rounded-3xl border border-[var(--border-main)] bg-zinc-900/5 shadow-xl">
                            <img src={blog.image} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" alt={blog.title} />
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white">{blog.category}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 px-2">
                            <span className="text-[10px] font-medium opacity-40 uppercase tracking-widest">{blog.date}</span>
                            <h3 className="text-xl font-medium leading-tight group-hover:italic transition-all duration-300" style={{ color: 'var(--text-bold)' }}>{blog.title}</h3>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  <div className="relative z-30 flex justify-center items-center gap-2 pt-0 -mt-18 w-full">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="w-8 h-8 rounded-full border border-[var(--border-main)] flex items-center justify-center opacity-70 hover:opacity-100 bg-[var(--text-bold)]/5 backdrop-blur-sm transition-all disabled:opacity-10 cursor-pointer text-[var(--text-bold)] text-[10px] font-bold">&lt;&lt;</button>
                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-full border border-[var(--border-main)] flex items-center justify-center opacity-70 hover:opacity-100 bg-[var(--text-bold)]/5 backdrop-blur-sm transition-all disabled:opacity-10 cursor-pointer text-[var(--text-bold)] text-[10px] font-bold">&lt;</button>
                    <div className="flex gap-2 mx-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                        <button key={n} onClick={() => setCurrentPage(n)} className={`w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold transition-all cursor-pointer ${currentPage === n ? 'bg-[var(--text-bold)] text-[var(--bg-main)] shadow-lg' : 'border border-[var(--border-main)] opacity-70 hover:opacity-100 bg-[var(--text-bold)]/5 text-[var(--text-bold)]'}`}>{n}</button>
                      ))}
                    </div>
                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-full border border-[var(--border-main)] flex items-center justify-center opacity-70 hover:opacity-100 bg-[var(--text-bold)]/5 backdrop-blur-sm transition-all disabled:opacity-10 cursor-pointer text-[var(--text-bold)] text-[10px] font-bold">&gt;</button>
                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="w-8 h-8 rounded-full border border border-[var(--border-main)] flex items-center justify-center opacity-70 hover:opacity-100 bg-[var(--text-bold)]/5 backdrop-blur-sm transition-all disabled:opacity-10 cursor-pointer text-[var(--text-bold)] text-[10px] font-bold">&gt;&gt;</button>
                  </div>
                </div>
              </section>

            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;