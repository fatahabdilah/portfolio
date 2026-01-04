import React from 'react';

const Header = () => {
  const NavLink = ({ href, children }) => (
    <a href={href} className="flex-1 text-center opacity-70 hover:opacity-100 font-bold uppercase cursor-pointer text-[11px] tracking-[0.25em]" style={{ color: 'var(--text-main)', transition: 'none' }}>
      {children}
    </a>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-[5000] flex justify-center pt-8 px-6 pointer-events-none">
      <header 
        className="w-full max-w-5xl relative flex items-center justify-center px-8 py-2.5 pointer-events-auto"
        style={{ minHeight: 'var(--nav-height)' }}
      >
        {/* LAYER 1: THE BLUR MIRROR (Hanya Blur, akan mati saat transisi) */}
        <div 
          className="glass-blur absolute inset-0 rounded-full transition-opacity duration-500"
          style={{ 
            backdropFilter: 'blur(30px) saturate(200%)',
            WebkitBackdropFilter: 'blur(30px) saturate(200%)',
            zIndex: -2 
          }}
        />

        {/* LAYER 2: THE SOLID TINT (Warna Dasar, Tetap Hidup & Tidak Tembus) */}
        <div 
          className="absolute inset-0 rounded-full border shadow-xl transition-colors duration-0"
          style={{ 
            backgroundColor: 'var(--bg-nav)', 
            borderColor: 'var(--border-nav)',
            borderWidth: '1px',
            zIndex: -1,
            // Clip-path menjaga border radius tidak bocor
            clipPath: 'inset(0 round 9999px)',
            WebkitClipPath: 'inset(0 round 9999px)',
          }}
        />

        {/* CONTENT LAYER */}
        <nav className="flex items-center w-full h-full relative z-10">
          <div className="flex flex-1 items-center justify-around h-full">
            <NavLink href="#home">Home</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#experience">Experience</NavLink>
          </div>

          <div className="group relative flex items-center justify-center cursor-pointer shrink-0 mx-10">
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
            <NavLink href="#project">Project</NavLink>
            <NavLink href="#blog">Blog</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;