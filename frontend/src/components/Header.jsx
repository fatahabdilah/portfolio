import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate, useMatch } from 'react-router-dom';

const Header = ({ onHomeClick, onLogoClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isBlogDetail = useMatch('/blog/:id');

  const handleFaClick = (e) => {
    e.preventDefault();
    if (onLogoClick) onLogoClick();
    setIsOpen(false);
  };

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    
    if (isBlogDetail) {
      // 1. Trigger tutup overlay
      navigate('/');
      
      // 2. Tunggu sampai benar-benar turun (durasi overlay 0.8s + sedikit buffer)
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          // Scroll bawaan browser
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 850); 
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsOpen(false);
  };

  const handleHomeNavigation = (e) => {
    e.preventDefault();
    if (isBlogDetail) {
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 850);
    } else {
      onHomeClick();
    }
    setIsOpen(false);
  };

  const NavLink = ({ href, children, onClick, targetId, mobile }) => (
    <a 
      href={href} 
      onClick={targetId ? (e) => handleScroll(e, targetId) : onClick}
      className={`${
        mobile 
        ? "text-3xl font-bold py-4 w-full text-center" 
        : "flex-1 text-center text-[11px] tracking-[0.25em]"
      } opacity-70 hover:opacity-100 uppercase cursor-pointer transition-all duration-300`}
      style={{ color: 'var(--text-bold)', fontFamily: mobile ? 'var(--font-logo)' : 'inherit' }}
    >
      {children}
    </a>
  );

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[5000] flex justify-center pt-3 md:pt-8 px-6 pointer-events-none">
        <header 
          className="w-full max-w-5xl relative flex items-center justify-between md:justify-center px-6 md:px-8 py-1.5 md:py-2.5 pointer-events-auto"
          style={{ minHeight: 'calc(var(--nav-height-mobile))', height: 'auto' }}
        >
          <div 
            className="absolute inset-0 rounded-full transition-opacity duration-500"
            style={{ 
              backdropFilter: 'blur(30px) saturate(200%)',
              WebkitBackdropFilter: 'blur(30px) saturate(200%)',
              backgroundColor: 'var(--bg-nav)',
              border: '1px solid var(--border-nav)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
              zIndex: -1 
            }}
          />

          <nav className="hidden md:flex items-center w-full h-full relative z-10">
            <div className="flex flex-1 items-center justify-around h-full">
              <NavLink onClick={handleHomeNavigation}>Home</NavLink>
              <NavLink href="#about" targetId="about">About</NavLink>
              <NavLink href="#experience" targetId="experience">Experience</NavLink>
            </div>

            <LogoSection onClick={handleFaClick} />

            <div className="flex flex-1 items-center justify-around h-full">
              <NavLink href="#projects" targetId="projects">Project</NavLink>
              <NavLink href="#blog" targetId="blog">Blog</NavLink>
              <NavLink href="#contact" targetId="contact">Contact</NavLink>
            </div>
          </nav>

          <div className="flex md:hidden items-center justify-between w-full z-10">
            <div onClick={handleFaClick} className="cursor-pointer">
              <span className="text-xl font-bold" style={{ color: 'var(--text-bold)', fontFamily: 'var(--font-logo)' }}>FA</span>
            </div>
            
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 transition-transform active:scale-90"
              style={{ color: 'var(--text-bold)' }}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[4999] flex flex-col items-center justify-center bg-white/30 dark:bg-black/30"
          >
            <motion.nav 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <NavLink mobile onClick={handleHomeNavigation}>Home</NavLink>
              <NavLink mobile href="#about" targetId="about">About</NavLink>
              <NavLink mobile href="#experience" targetId="experience">Experience</NavLink>
              <NavLink mobile href="#projects" targetId="projects">Project</NavLink>
              <NavLink mobile href="#blog" targetId="blog">Blog</NavLink>
              <NavLink mobile href="#contact" targetId="contact">Contact</NavLink>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const LogoSection = ({ onClick }) => (
  <div 
    onClick={onClick}
    className="group relative flex items-center justify-center cursor-pointer shrink-0 mx-10"
  >
    <div className="flex items-center justify-center">
       <span className="text-3xl select-none leading-none pb-1" style={{ color: 'var(--text-bold)', fontFamily: 'var(--font-logo)', fontWeight: 600 }}>F</span>
       <div className="flex flex-col items-center justify-center w-0 overflow-hidden opacity-0 group-hover:w-16 group-hover:opacity-100 transition-all duration-700">
          <span className="text-[9px] font-black uppercase tracking-tight" style={{ color: 'var(--text-bold)' }}>Fatah</span>
          <span className="text-[9px] font-black uppercase tracking-tight" style={{ color: 'var(--text-bold)' }}>Abdilah</span>
       </div>
       <span className="text-3xl select-none leading-none pb-1" style={{ color: 'var(--text-bold)', fontFamily: 'var(--font-logo)', fontWeight: 600 }}>A</span>
    </div>
  </div>
);

export default Header;