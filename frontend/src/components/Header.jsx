import React from 'react';

const Header = ({ onHomeClick, onLogoClick }) => {
  // Logic untuk handle klik tombol FA
  const handleFaClick = (e) => {
    e.preventDefault();
    if (onLogoClick) onLogoClick();
  };

  // Fungsi scroll sangat halus tanpa offset
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start', // Memulai scroll tepat di bagian atas elemen target
      });
    }
  };

  const NavLink = ({ href, children, onClick, targetId }) => (
    <a 
      href={href} 
      onClick={targetId ? (e) => handleScroll(e, targetId) : onClick}
      className="flex-1 text-center opacity-70 hover:opacity-100 font-bold uppercase cursor-pointer text-[11px] tracking-[0.25em]" 
      style={{ color: 'var(--text-main)', transition: 'all 0.3s ease' }}
    >
      {children}
    </a>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-[5000] flex justify-center pt-8 px-6 pointer-events-none">
      <header 
        className="w-full max-w-5xl relative flex items-center justify-center px-8 py-2.5 pointer-events-auto"
        style={{ minHeight: 'var(--nav-height)' }}
      >
        <div 
          className="glass-blur absolute inset-0 rounded-full transition-opacity duration-500"
          style={{ 
            backdropFilter: 'blur(30px) saturate(200%)',
            WebkitBackdropFilter: 'blur(30px) saturate(200%)',
            zIndex: -2 
          }}
        />

        <div 
          className="absolute inset-0 rounded-full border shadow-xl"
          style={{ 
            backgroundColor: 'var(--bg-nav)', 
            borderColor: 'var(--border-nav)',
            borderWidth: '1px',
            zIndex: -1,
            clipPath: 'inset(0 round 9999px)',
            WebkitClipPath: 'inset(0 round 9999px)',
          }}
        />

        <nav className="flex items-center w-full h-full relative z-10">
          <div className="flex flex-1 items-center justify-around h-full">
            <NavLink onClick={(e) => { e.preventDefault(); onHomeClick(); }}>Home</NavLink>
            <NavLink href="#about" targetId="about">About</NavLink>
            <NavLink href="#experience" targetId="experience">Experience</NavLink>
          </div>

          {/* Tombol FA */}
          <div 
            onClick={handleFaClick}
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

          <div className="flex flex-1 items-center justify-around h-full">
            <NavLink href="#projects" targetId="projects">Project</NavLink>
            <NavLink href="#blog" targetId="blog">Blog</NavLink>
            <NavLink href="#contact" targetId="contact">Contact</NavLink>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;