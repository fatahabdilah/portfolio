import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import axios from 'axios';
import { useNavigate, useLocation, useMatch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import BlogDetailOverlay from './pages/BlogDetail.jsx';
import { X, ExternalLink } from 'lucide-react';

// DATA PENGALAMAN
const experiencesData = [
  { title: "Full-stack Web Developer", company: "Educourse.id", year: "2025", detail: "Developed full-stack web applications like LMS and CMS platforms using React, Express, and Next.js with RESTful API integration." },
  { title: "Front-end Android Developer", company: "PT Lingga Cipta Insania", year: "2025", detail: "Translated Figma designs into 20+ functional XML and Java layouts for B2B transactions using Agile/Scrum methodology." },
  { title: "Web Administrator", company: "Faculty of Computer Science, Pamulang University", year: "2024 - 2025", detail: "Managed 7 websites (OJS & WordPress) and optimized On-Page SEO, increasing organic traffic by 25-30%." },
  { title: "Front-end Web Developer", company: "UP SMK Negeri 1 Tengaran", year: "2020", detail: "Implemented school profile interfaces using HTML, CSS, JS, and Bootstrap, improving site loading speed by 40-50%." }
];

// --- KOMPONEN PROJECT CARD ---
const ProjectCard = ({ proj, onClick }) => {
  return (
    <div 
      onClick={() => onClick(proj)}
      // Class 'group' wajib ada di parent agar hover terdeteksi
      className="group shrink-0 h-[22vh] md:h-[30vh] aspect-[3/2] relative overflow-hidden rounded-2xl md:rounded-3xl border border-[var(--border-nav)] cursor-pointer bg-zinc-900 z-10 isolate"
    >
      {/* Menggunakan class manual 'smooth-zoom-image' */}
      <img 
        src={proj.imageUrl} 
        className="absolute inset-0 w-full h-full object-cover smooth-zoom-image" 
        alt={proj.title} 
      />
      
      {/* Overlay Gradient: opacity transition */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" 
      />
      
      {/* Teks Judul */}
      <div 
        className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 translate-y-4 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100" 
      >
        <h4 className="text-white text-base md:text-xl font-medium tracking-tight">{proj.title}</h4>
      </div>
    </div>
  );
};

function App() {
  const navigate = useNavigate();
  const blogMatch = useMatch('/blog/:id');
  const blogId = blogMatch?.params?.id;

  const [isDirectAccess, setIsDirectAccess] = useState(!!blogId);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const greetings = ["Halo", "مرحباً", "안녕", "Hi", "Holla"];
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const zoomRef = useRef(null);
  const projectSectionRef = useRef(null);
  const blogSectionRef = useRef(null);
  const contactSectionRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const [movementDistance, setMovementDistance] = useState(500);

  const handleBlogClick = (id) => {
    setIsDirectAccess(false);
    navigate(`/blog/${id}`);
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsLoading(true);
    navigate('/');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!blogId) setIsDirectAccess(false);
  }, [blogId]);

  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        setGreetingIndex((prev) => (prev + 1) % greetings.length);
      }, 2500); 
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!API_URL) return;
      try {
        const [projRes, blogRes] = await Promise.all([
          axios.get(`${API_URL}/projects?limit=50`),
          axios.get(`${API_URL}/blogs?limit=50`)
        ]);
        setProjects(projRes.data.data || []);
        const fetchedBlogs = (blogRes.data.data || []).map(b => ({
          id: b._id,
          title: b.title,
          date: new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          category: "Insight",
          image: b.thumbnailUrl
        }));
        setBlogs(fetchedBlogs);
      } catch (err) {
        console.error("Gagal sinkronisasi data API:", err);
      }
    };
    fetchPortfolioData();
  }, [API_URL]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setMovementDistance(mobile ? 350 : 500);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (selectedProject || blogId) ? 'hidden' : 'unset';
  }, [selectedProject, blogId]);

  const blogsPerPage = isMobile ? 2 : 3;
  const currentBlogs = blogs.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  // Scroll Animations
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const yV1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const yV2 = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const yV3 = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);
  const yV4 = useTransform(scrollYProgress, [0, 1], ["0%", "-150%"]);
  const yV5 = useTransform(scrollYProgress, [0, 1], ["0%", "-220%"]);

  const { scrollYProgress: aboutScroll } = useScroll({ target: imageRef, offset: ["start end", "end start"] });
  const filterStyle = useTransform(aboutScroll, [0.3, 0.45, 0.55, 0.7], ["grayscale(100%)", "grayscale(0%)", "grayscale(0%)", "grayscale(100%)"]);
  const rotateValue = useTransform(aboutScroll, [0.3, 0.5, 0.7], [-5, 0, 5]);
  const yAboutBg = useTransform(aboutScroll, [0, 1], ["-10%", "10%"]);

  const { scrollYProgress: zoomScroll } = useScroll({ target: zoomRef, offset: ["start start", "end start"] });
  const frameScale = useTransform(zoomScroll, [0, 0.5], [1, 10]);
  const bgScale = useTransform(zoomScroll, [0, 0.2, 0.5], [0.4, 1.8, 2.1]); 
  const brightnessStyle = useTransform(useTransform(zoomScroll, [0.2, 0.9], [0.8, 0.4]), (v) => `brightness(${v})`);

  const opacityExperience = useTransform(zoomScroll, [0.3, 0.45], [0, 1]);
  const blurExperience = useTransform(zoomScroll, [0.3, 0.4, 0.85, 0.95], ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"]);
  const yExperienceContent = useTransform(zoomScroll, [0.3, 0.9], [150, -800]); 
  const pointerEvents = useTransform(zoomScroll, [0.4, 0.41], ["none", "auto"]);

  const { scrollYProgress: projectScroll } = useScroll({ target: projectSectionRef, offset: ["start end", "end start"] });
  const yProjectTitle = useTransform(projectScroll, [0, 0.2], [50, 0]);
  const opacityProjectTitle = useTransform(projectScroll, [0, 0.2], [0, 1]);
  const xProjectsRow1 = useTransform(projectScroll, [0, 1], [-movementDistance * 3, movementDistance * 2.5]);
  const xProjectsRow2 = useTransform(projectScroll, [0, 1], [movementDistance * 3, -movementDistance * 2.5]);
  const projectsRow1 = projects.slice(0, Math.ceil(projects.length / 2));
  const projectsRow2 = projects.slice(Math.ceil(projects.length / 2));

  const { scrollYProgress: blogScroll } = useScroll({ target: blogSectionRef, offset: ["start end", "end start"] });
  const blogTitleY = useTransform(blogScroll, [0, 1], [0, -100]);
  const blurBlogTitle = useTransform(blogScroll, [0, 0.3, 0.7, 1], ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"]);
  const blogContentY = useTransform(blogScroll, [0.4, 1], [isMobile ? 50 : 0, -250]); 
  const yBlogBg = useTransform(blogScroll, [0, 1], ["-10%", "10%"]);

  const { scrollYProgress: contactScroll } = useScroll({ target: contactSectionRef, offset: ["start end", "end start"] });
  // PERBAIKAN ANIMASI SCROLL UNTUK KONTAK (Karena jarak spacer dihapus, animasi disesuaikan)
  // Mulai dari bawah (300px), bergerak ke atas (-500px) saat scroll
  const yContactListScroll = useTransform(contactScroll, [0.1, 0.9], [300, -500]);
  const blurContact = useTransform(contactScroll, [0, 0.2, 0.8, 1], ["blur(18px)", "blur(0px)", "blur(0px)", "blur(18px)"]);
  const yContactImageSticky = useTransform(contactScroll, [0, 1], [40, -40]); 
  const opacityContact = useTransform(contactScroll, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const smoothFloat = (d) => ({
    animate: { y: [0, 15, 0], rotate: [-2, 2, -2] },
    transition: { duration: d, repeat: Infinity, ease: "easeInOut" }
  });
  const gpuStyle = { willChange: "transform, filter", translateZ: 0, backfaceVisibility: "hidden" };

  return (
    <>
      {/* --- INJEKSI CSS MANUAL (PASTI BISA) --- */}
      <style>{`
        /* Definisi animasi zoom manual dengan durasi 0.6s (Lebih Cepat Sedikit) */
        .smooth-zoom-image {
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
          transform: scale(1);
          will-change: transform;
        }
        
        /* Saat parent (.group) di hover, trigger zoom pada class ini */
        .group:hover .smooth-zoom-image {
          transform: scale(1.1);
        }
      `}</style>

      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loader" onFinished={() => setIsLoading(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {blogId && <BlogDetailOverlay key="blog-overlay" id={blogId} isDirectAccess={isDirectAccess} />}
      </AnimatePresence>

      <Header onHomeClick={scrollToTop} onLogoClick={handleLogoClick} />
      
      <div className="main-content" onMouseMove={handleMouseMove}>
        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProject(null)} className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm cursor-pointer" />
              <motion.div initial={{ y: "100%" }} animate={{ y: "5vh" }} exit={{ y: "100%" }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} className="fixed inset-x-0 bottom-0 h-[90vh] z-[10001] bg-[var(--bg-main)] rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-y-auto border-t border-white/10">
                <button onClick={() => setSelectedProject(null)} className="fixed top-6 right-8 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors z-[10002] backdrop-blur-md cursor-pointer"><X size={24} color="var(--text-bold)" /></button>
                <div className="max-w-3xl mx-auto px-8 py-16 flex flex-col items-center">
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="w-full aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden border border-white/5 shadow-2xl mb-10"><img src={selectedProject.imageUrl} className="w-full h-full object-cover" alt={selectedProject.title} /></motion.div>
                  <div className="w-full flex flex-col gap-4 text-left">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }} className="flex flex-wrap items-center justify-between gap-4 w-full">
                        <h2 className="flex-1 text-3xl md:text-5xl font-bold tracking-tight text-left" style={{ fontFamily: 'var(--font-logo)', color: 'var(--text-bold)' }}>{selectedProject.title}</h2>
                        {selectedProject.demoUrl && (
                            <a href={selectedProject.demoUrl.startsWith('http') ? selectedProject.demoUrl : `https://${selectedProject.demoUrl}`} target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--text-bold)] text-[var(--bg-main)] font-bold text-[10px] md:text-xs uppercase tracking-widest hover:opacity-80 transition-all shadow-lg whitespace-nowrap">
                                Visit Website <ExternalLink size={14} />
                            </a>
                        )}
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-4" />
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="text-base md:text-lg font-light leading-relaxed opacity-60 text-justify" style={{ color: 'var(--text-bold)' }}>{selectedProject.content}</motion.p>
                    <div className="mt-8 flex flex-wrap gap-3 justify-start">
                      {selectedProject.technologies?.map((tech, idx) => (
                        <span key={tech._id || idx} className="px-4 py-1 rounded-full border border-white/10 text-[10px] uppercase tracking-widest text-white/40">{tech.name}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div ref={containerRef} className="flex flex-col min-h-screen bg-[var(--bg-main)]">
          <main className="flex-grow">
            {/* HERO SECTION */}
            <section id="home" className="relative h-screen flex items-center justify-center px-8 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none select-none">
                    <motion.div style={{ ...gpuStyle, y: yV1 }} className="absolute left-[5%] lg:left-[22%] top-[15%] lg:top-[12%] w-[30vw] lg:w-[12vw] z-20"><motion.img {...smoothFloat(11)} src="/images/collage/flower1.png" className="w-full" /></motion.div>
                    <motion.img style={{ ...gpuStyle, y: yV3 }} src="/images/collage/sculpture1.png" className="absolute left-[-20%] lg:left-[-10%] top-[60%] lg:top-[15%] w-[90vw] lg:w-[36vw] z-10" />
                    <motion.img style={{ ...gpuStyle, y: yV4 }} src="/images/collage/sculpture2.png" className="absolute right-[-17%] lg:right-[-5%] top-[3%] lg:top-[0%] w-[75vw] lg:w-[36vw] z-10" />
                    <motion.div style={{ ...gpuStyle, y: yV1 }} className="absolute left-[18%] top-[7%] lg:top-[5%] w-[20vw] lg:w-[10vw] blur-[2px]"><motion.img {...smoothFloat(12)} src="/images/collage/flower1.png" className="w-full" /></motion.div>
                    <motion.div style={{ ...gpuStyle, y: yV2 }} className="absolute left-[25%] bottom-[5%] lg:bottom-[4%] w-[22vw] lg:w-[12vw] blur-[2px]"><motion.img {...smoothFloat(14)} src="/images/collage/flower3.png" className="w-full" /></motion.div>
                    <motion.div style={{ ...gpuStyle, y: yV3 }} className="absolute left-[30%] lg:left-[13%] bottom-[0%] lg:bottom-[8%] w-[30vw] lg:w-[17vw] z-20"><motion.img {...smoothFloat(10)} src="/images/collage/flower2.png" className="w-full" /></motion.div>
                    <motion.div style={{ ...gpuStyle, y: yV3 }} className="absolute right-[-4%] lg:right-[8%] bottom-[16%] lg:bottom-[15%] w-[32vw] lg:w-[18vw] z-20"><motion.img {...smoothFloat(13)} src="/images/collage/flower1.png" className="w-full" /></motion.div>
                    <motion.div style={{ ...gpuStyle, y: yV4 }} className="absolute right-[50%] lg:right-[25%] top-[13%] lg:top-[10%] w-[25vw] lg:w-[12vw] z-20"><motion.img {...smoothFloat(11)} src="/images/collage/flower3.png" className="w-full" /></motion.div>
                    <motion.div style={{ ...gpuStyle, y: yV5 }} className="absolute right-[15%] lg:right-[20%] bottom-[10%] lg:bottom-[2%] w-[28vw] lg:w-[14vw] blur-[1px]"><motion.img {...smoothFloat(12)} src="/images/collage/flower1.png" className="w-full" /></motion.div>
                    <motion.div style={{ ...gpuStyle, y: yV5 }} className="absolute right-[20%] top-[70%] lg:top-[60%] w-[20vw] lg:w-[10vw] z-30"><motion.img {...smoothFloat(8)} src="/images/collage/flower2.png" className="w-full" /></motion.div>
                </div>
                <motion.div className="relative z-40 text-center flex flex-col items-center gap-2">
                    <div className="text-2xl md:text-3xl font-light tracking-wider" style={{ color: 'var(--text-main)', fontFamily: 'var(--font-sans)' }}>
                    <AnimatePresence mode="wait">
                        <motion.span key={greetingIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="inline-block">{greetings[greetingIndex]},</motion.span>
                    </AnimatePresence>
                    </div>
                    <h1 className="text-4xl md:text-[6vw] mb-2 font-bold leading-none tracking-tight whitespace-nowrap" style={{ fontFamily: 'var(--font-logo)', color: 'var(--text-bold)' }}>I'm Fatah Abdilah</h1>
                    <p className="max-w-xl mx-auto text-xs md:text-lg uppercase tracking-[0.3em] opacity-60 font-light" style={{ color: 'var(--text-main)' }}>Fullstack Web Developer</p>
                </motion.div>
            </section>

            {/* ABOUT SECTION */}
            <section id="about" className="relative w-full h-screen overflow-hidden flex items-center justify-center px-6 md:px-8">
              <motion.div style={{ y: yAboutBg }} className="absolute inset-0 z-0 pointer-events-none"><img src="/images/bgcloude.jpg" alt="Cloud Background" className="w-full h-[120%] object-cover transition-all duration-700" style={{ filter: 'var(--cloud-brightness)' }} /></motion.div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 max-w-5xl mx-auto w-full">
                <div ref={imageRef} className="shrink-0 relative">
                  <motion.div style={{ filter: filterStyle, rotate: rotateValue }} className="relative w-[180px] md:w-[250px] aspect-[3/4] flex items-center justify-center overflow-hidden">
                    <div className="w-[60%] h-[60%] overflow-hidden rounded-full bg-zinc-800 transform translate-y-1"><video src="/images/profile-video.mp4" className="w-full h-full object-cover" autoPlay loop muted playsInline /></div>
                    <img src="/images/frame-oval.png" alt="Frame" className="absolute w-full h-full object-contain pointer-events-none z-10" />
                  </motion.div>
                </div>
                <div className="flex flex-col justify-center text-center md:text-left">
                  <div className="mb-4 md:mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-2 md:mb-4 block opacity-40" style={{ color: 'var(--text-bold)' }}>About — I</span>
                    <h2 className="text-4xl md:text-6xl font-bold opacity-80" style={{ fontFamily: 'var(--font-logo)', color: 'var(--text-bold)' }}>About Me</h2>
                  </div>
                  <div className="flex flex-col gap-3 md:gap-4 text-base md:text-xl leading-relaxed md:leading-[1.8] font-light tracking-tight" style={{ color: 'var(--text-bold)' }}><p>I am a Computer Science student focused on Web and Android development, building end-to-end digital solutions.</p><p>Passionate about creating fluid animations and minimal interfaces that bridge the gap between design and technology.</p></div>
                </div>
              </div>
            </section>

            {/* EXPERIENCE SECTION */}
            <div className="relative overflow-visible">
              <div id="experience" className="absolute top-[240vh] md:top-[300vh] left-0 w-full h-1 pointer-events-none z-[100]" />
              <section ref={zoomRef} className="relative h-[500vh] md:h-[600vh] w-full z-20 bg-[var(--bg-main)] shadow-[0_40px_60px_-20px_rgba(0,0,0,0.3)]">
                <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-start overflow-hidden bg-[var(--bg-main)]">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div style={{ scale: bgScale, filter: brightnessStyle, ...gpuStyle, zIndex: 5 }} className="absolute w-[150vw] aspect-[4/3] md:w-[75vw] overflow-hidden"><img src="/images/bg-landscape.jpeg" alt="Landscape" className="w-full h-full object-cover" /></motion.div>
                    <motion.div style={{ scale: frameScale, ...gpuStyle, zIndex: 10 }} className="absolute w-[90vw] md:w-[50vw] aspect-[4/3]"><img src="/images/frame-landscape.png" alt="Frame" className="absolute w-full h-full object-contain scale-[1.15]" /></motion.div>
                  </div>
                  <motion.div style={{ opacity: opacityExperience, y: yExperienceContent, pointerEvents: pointerEvents, filter: blurExperience }} className="relative z-20 w-full max-w-5xl px-8 pt-[30vh] md:pt-[40vh] pb-[25vh]">
                    <div className="text-center mb-14 md:mb-24">
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 block opacity-80" style={{ color: 'var(--text-bold)' }}>Experience — II</span>
                      <h2 className="text-5xl md:text-8xl font-bold" style={{ fontFamily: 'var(--font-logo)', color: 'var(--text-bold)' }}>The Journey</h2>
                    </div>
                    <div className="relative flex flex-col gap-12 before:absolute before:left-4 md:before:left-1/2 before:top-0 before:h-full before:w-[1px] before:bg-[var(--text-bold)] before:opacity-20 before:z-0">
                      {experiencesData.map((exp, index) => (
                        <div key={index} className={`flex flex-col md:flex-row items-start md:items-center justify-between w-full relative z-10 group ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                          <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] border-4 border-[var(--text-bold)]/30 group-hover:scale-150 transition-all duration-300 z-20" style={{ backgroundColor: 'var(--text-bold)' }} />
                          <div className={`w-full md:w-[45%] pl-12 md:pl-0 text-left ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                            <div className={`flex flex-col mb-2 ${index % 2 === 0 ? 'items-start md:items-start' : 'items-start md:items-end'}`}>
                              <span className="text-[12px] font-bold tracking-widest block opacity-80 mb-1" style={{ color: 'var(--text-bold)' }}>{exp.year}</span>
                              <h3 className="text-2xl md:text-4xl font-medium mb-1 transition-all duration-500" style={{ color: 'var(--text-bold)' }}>{exp.title}</h3>
                            </div>
                            <p className={`text-sm opacity-80 max-w-sm ml-0 mr-auto ${index % 2 === 0 ? 'md:ml-0 md:mr-auto' : 'md:ml-auto md:mr-0'}`} style={{ color: 'var(--text-bold)' }}>{exp.detail}</p>
                          </div>
                          <div className={`hidden md:block w-[45%] text-xl font-bold opacity-80 uppercase tracking-tighter ${index % 2 === 0 ? 'text-right' : 'text-left'}`} style={{ color: 'var(--text-bold)' }}>{exp.company}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* PROJECT SECTION */}
              <div id="projects" className="absolute left-0 w-full h-1 pointer-events-none z-[100]" />
              <section ref={projectSectionRef} className="relative h-[500vh] bg-[var(--bg-main)] z-10 -mt-[100vh]">
                <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
                  <motion.div style={{ y: yProjectTitle, opacity: opacityProjectTitle }} className="w-full text-center pt-[15vh] md:pt-[24vh] mb-[4vh]">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-2 block opacity-40" style={{ color: 'var(--text-bold)' }}>Project — III</span>
                    <h2 className="text-4xl md:text-7xl font-medium tracking-tighter whitespace-nowrap" style={{ fontFamily: 'var(--font-logo)', color: 'var(--text-bold)' }}>Curated <span className="opacity-40 italic">Portfolio.</span></h2>
                  </motion.div>
                  <div className="flex flex-col gap-[2vh] md:gap-[4vh] w-full flex-grow justify-center items-center pb-[8vh]">
                    <div className="w-full flex justify-center overflow-visible">
                        <motion.div style={{ x: xProjectsRow1 }} className="flex gap-[2vh] md:gap-[4vh] px-8 w-max">
                            {projectsRow1.length > 0 ? projectsRow1.map((proj, i) => (
                                <ProjectCard key={`row1-${proj._id || i}`} proj={proj} onClick={setSelectedProject} />
                            )) : [1,2,3].map(n => <div key={n} className="shrink-0 h-[22vh] md:h-[30vh] aspect-[3/2] bg-zinc-900 animate-pulse rounded-2xl" />)}
                        </motion.div>
                    </div>
                    <div className="w-full flex justify-center overflow-visible">
                        <motion.div style={{ x: xProjectsRow2 }} className="flex gap-[2vh] md:gap-[4vh] px-8 w-max">
                            {projectsRow2.length > 0 ? projectsRow2.map((proj, i) => (
                                <ProjectCard key={`row2-${proj._id || i}`} proj={proj} onClick={setSelectedProject} />
                            )) : [1,2,3].map(n => <div key={n} className="shrink-0 h-[22vh] md:h-[30vh] aspect-[3/2] bg-zinc-900 animate-pulse rounded-2xl" />)}
                        </motion.div>
                    </div>
                  </div>
                </div>
              </section>

              {/* BLOG SECTION */}
              <section ref={blogSectionRef} className="relative z-30 min-h-screen overflow-hidden flex flex-col justify-center">
                <motion.div style={{ y: yBlogBg }} className="absolute inset-0 z-0 pointer-events-none"><img src="/images/bgcloude.jpg" alt="Cloud Background" className="w-full h-[120%] object-cover transition-all duration-500" style={{ filter: 'var(--cloud-brightness)' }} /></motion.div>
                {/* PERUBAHAN: max-w-5xl (dikecilkan dari max-w-7xl) agar blog lebih ramping */}
                <div className="max-w-5xl mx-auto relative w-full flex flex-col items-center z-10 px-6">
                  <div id="blog" className="absolute left-0 w-full h-1 pointer-events-none" />
                  <motion.div style={{ y: blogTitleY, filter: blurBlogTitle }} className="text-center mb-0 z-[5] pointer-events-none sticky top-32 md:top-40">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] block opacity-40" style={{ color: 'var(--text-bold)' }}>Blog — IV</span>
                    <h2 className="text-5xl md:text-[10vw] font-bold leading-none" style={{ fontFamily: 'var(--font-logo)', color: 'var(--text-bold)' }}>Insights.</h2>
                  </motion.div>
                  <motion.div style={{ y: blogContentY }} className="gap-4 w-full flex flex-col items-center pt-20 md:pt-32 relative z-[10]">
                    <div className={`relative w-full flex ${currentBlogs.length < 3 ? 'justify-center' : ''}`}>
                      <div className={`grid gap-8 items-stretch w-full ${currentBlogs.length === 1 ? 'max-w-md grid-cols-1' : currentBlogs.length === 2 ? 'max-w-4xl grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
                        <AnimatePresence mode="wait">
                          <motion.div key={currentPage} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="contents">
                            {currentBlogs.length > 0 ? currentBlogs.map((blog, idx) => (
                              <div key={`blog-${idx}`} className="group flex flex-col gap-4 cursor-pointer" onClick={() => handleBlogClick(blog.id)}>
                                <div className="relative aspect-[3/2] overflow-hidden rounded-3xl border border-[var(--border-nav)] bg-zinc-900/5 shadow-xl">
                                  {/* --- GAMBAR BLOG DENGAN CSS MANUAL 'smooth-zoom-image' --- */}
                                  <img 
                                    src={blog.image} 
                                    className="w-full h-full object-cover smooth-zoom-image" 
                                    alt={blog.title} 
                                  />
                                  {isMobile && ( <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6"><span className="text-[10px] font-medium uppercase tracking-widest text-white/70 mb-1">{blog.date}</span><h3 className="text-xl font-medium leading-tight text-white">{blog.title}</h3></div> )}
                                </div>
                                {!isMobile && ( <div className="flex flex-col gap-1 px-2"><span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: 'var(--text-main)', opacity: 0.6 }}>{blog.date}</span><h3 className="text-xl font-medium leading-tight group-hover:italic transition-all duration-300" style={{ color: 'var(--text-bold)' }}>{blog.title}</h3></div> )}
                              </div>
                            )) : [1,2,3].map(n => <div key={n} className="aspect-[3/2] bg-zinc-900 animate-pulse rounded-3xl" />)}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                    {/* Pagination */}
                    <div className="relative z-30 flex justify-center items-center gap-2 w-full mt-2">
                      <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-full border border-[var(--border-nav)] flex items-center justify-center text-[var(--text-bold)] disabled:opacity-10 cursor-pointer">&lt;</button>
                      <div className="flex gap-2 mx-2">
                        {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(n => (
                          <button key={`page-${n}`} onClick={() => setCurrentPage(n)} className={`w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold transition-all cursor-pointer ${currentPage === n ? 'bg-[var(--text-bold)] text-[#0a0a0c]' : 'border border-[var(--border-nav)] text-[var(--text-bold)]'}`}>{n}</button>
                        ))}
                      </div>
                      <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages || 1))} disabled={currentPage === (totalPages || 1)} className="w-8 h-8 rounded-full border border-[var(--border-nav)] flex items-center justify-center text-[var(--text-bold)] disabled:opacity-10 cursor-pointer">&gt;</button>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* CONTACT SECTION */}
              <section ref={contactSectionRef} id="contact" className="relative z-40 bg-[var(--bg-main)] overflow-visible h-[200vh] md:h-[300vh]">
                <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                  <div className="max-w-5xl w-full px-8 mx-auto flex flex-col h-full relative">
                    <div className="absolute inset-0 flex items-center justify-center md:justify-start md:pl-10 z-0 pointer-events-none"><motion.div style={{ y: yContactImageSticky, opacity: opacityContact }} className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden"><img src="/images/collage/sculpture1.png" className="w-full h-full object-cover" alt="Contact Visual" /></motion.div></div>
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"><motion.div style={{ y: yContactListScroll, opacity: opacityContact, filter: blurContact }} className="-translate-y-90 md:-translate-y-80"><h2 className="text-6xl md:text-[clamp(4rem,8vw,10rem)] font-bold tracking-tighter leading-none text-center" style={{ fontFamily: 'var(--font-logo)', color: 'var(--text-bold)' }}>Contact — V</h2></motion.div></div>
                    <div className="relative w-full h-full flex items-center justify-center md:justify-end z-20">
                      {/* PERUBAHAN: Jarak Konsisten (mt-[400px] atau nilai lain) - HAPUS Spacer vh */}
                      <motion.div style={{ y: yContactListScroll, opacity: opacityContact, filter: blurContact }} className="flex flex-col gap-10 md:gap-10 w-full max-w-xl md:-ml-20 mt-[50px] md:mt-[350px]">
                        <div className="flex flex-row gap-6 items-start"><span className="text-xl italic opacity-50 shrink-0 w-24 md:w-32" style={{ fontFamily: 'var(--font-logo)', color: 'var(--text-bold)' }}>Services</span><div className="flex flex-col gap-2">{['Custom Web Apps', 'Portfolio Design', 'Landingpage', 'UI UX'].map((item) => (<span key={item} className="text-3xl md:text-5xl font-medium tracking-tight" style={{ color: 'var(--text-bold)' }}>{item}</span>))}</div></div>
                        <div className="flex flex-row gap-6 items-start"><span className="text-xl italic opacity-50 shrink-0 w-24 md:w-32" style={{ fontFamily: 'var(--font-logo)', color: 'var(--text-bold)' }}>Connect</span><div className="flex flex-col gap-2"><a href="mailto:fatahabdilahh@gmail.com" className="text-3xl md:text-5xl font-medium tracking-tight hover:italic transition-all duration-300" style={{ color: 'var(--text-bold)' }}>fatahabdilahh@gmail.com</a><a href="https://www.linkedin.com/in/fataabdilah/" target="_blank" rel="noopener noreferrer" className="text-3xl md:text-5xl font-medium tracking-tight hover:italic transition-all duration-300" style={{ color: 'var(--text-bold)' }}>LinkedIn</a><a href="https://github.com/fatahabdilah" target="_blank" rel="noopener noreferrer" className="text-3xl md:text-5xl font-medium tracking-tight hover:italic transition-all duration-300" style={{ color: 'var(--text-bold)' }}>Github</a><a href="https://www.instagram.com/fatahhhhhhhhhhhhhh" target="_blank" rel="noopener noreferrer" className="text-3xl md:text-5xl font-medium tracking-tight hover:italic transition-all duration-300" style={{ color: 'var(--text-bold)' }}>Instagram</a></div></div>
                        <div className="flex flex-row gap-6 items-start"><span className="text-xl italic opacity-50 shrink-0 w-24 md:w-32" style={{ fontFamily: 'var(--font-logo)', color: 'var(--text-bold)' }}>Location</span><div className="flex flex-col gap-2"><span className="text-3xl md:text-5xl font-medium tracking-tight" style={{ color: 'var(--text-bold)' }}>Tangerang City, Indonesia</span><span className="text-3xl md:text-5xl font-medium tracking-tight opacity-40" style={{ color: 'var(--text-bold)' }}>Available Worldwide</span></div></div>
                      </motion.div>
                    </div>
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