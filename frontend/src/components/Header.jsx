import React from 'react';

const Header = () => {
  const NavLink = ({ href, children }) => (
    <a 
      href={href} 
      className="text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 hover:opacity-100 opacity-80"
      style={{ color: 'var(--text-main)' }}
    >
      {children}
    </a>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-[1000] flex justify-center p-6 pointer-events-none" style={{ isolation: 'isolate' }}>
      <header 
        className="w-full max-w-5xl flex justify-between items-center px-10 py-4 rounded-3xl border backdrop-blur-2xl shadow-xl pointer-events-auto transition-all duration-500"
        style={{ 
          backgroundColor: 'var(--nav-bg)', 
          borderColor: 'var(--nav-border)'
        }}
      >
        <nav className="hidden md:flex items-center space-x-8 flex-1">
          <NavLink href="#home">Home</NavLink>
          <NavLink href="#about">About</NavLink>
          <NavLink href="#experience">Experience</NavLink>
        </nav>

        {/* Logo FA Monochrome */}
        <div className="group relative flex items-center justify-center px-8 cursor-default">
          <div className="flex items-center transition-all duration-700 ease-in-out">
             
             <span className="text-3xl font-black tracking-tighter transition-transform duration-500 group-hover:-translate-x-4" 
                   style={{ color: 'var(--text-bold)' }}>
               F
             </span>

             <div className="flex flex-col items-center justify-center w-0 overflow-hidden opacity-0 group-hover:w-24 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                {/* Sekarang warna mengikuti var --text-brand (Monochrome) */}
                <span className="text-[9px] font-black uppercase tracking-[0.3em] leading-tight" 
                      style={{ color: 'var(--text-brand)' }}>
                  Fatah
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] leading-tight" 
                      style={{ color: 'var(--text-brand)' }}>
                  Abdilah
                </span>
             </div>

             <span className="text-3xl font-black tracking-tighter transition-transform duration-500 group-hover:translate-x-4" 
                   style={{ color: 'var(--text-bold)' }}>
               A
             </span>
             
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8 flex-1 justify-end">
          <NavLink href="#project">Project</NavLink>
          <NavLink href="#blog">Blog</NavLink>
          <NavLink href="#contact">Contact</NavLink>
        </nav>
      </header>
    </div>
  );
};

export default Header;