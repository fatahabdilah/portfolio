import React from 'react';

const Header = () => {
  const NavLink = ({ href, children }) => (
    <a 
      href={href} 
      className="flex-1 min-w-0 text-center transition-opacity opacity-70 hover:opacity-100 truncate flex items-center justify-center font-bold uppercase select-none"
      style={{ 
        color: 'var(--text-main)',
        fontSize: '11px',
        letterSpacing: '0.25em',
        fontFamily: 'var(--font-sans)'
      }}
    >
      {children}
    </a>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-[1000] flex justify-center pt-8 px-6 pointer-events-none" style={{ isolation: 'isolate' }}>
      <header 
        className="w-full max-w-5xl rounded-full border backdrop-blur-3xl shadow-xl pointer-events-auto flex items-center justify-center px-8 py-2.5 transition-colors duration-500"
        style={{ 
          backgroundColor: 'var(--bg-nav)', 
          borderColor: 'var(--border-nav)',
          minHeight: 'var(--nav-height)'
        }}
      >
        <nav className="flex items-center w-full h-full overflow-hidden" aria-label="Main Navigation">
          <div className="flex flex-1 items-center justify-around h-full">
            <NavLink href="#home">Home</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#experience">Experience</NavLink>
          </div>

          <div className="group relative flex items-center justify-center cursor-default shrink-0 mx-10 transition-all duration-700">
            <div className="flex items-center justify-center">
               <span className="text-3xl select-none leading-none pb-1 z-10" 
                     style={{ color: 'var(--text-bold)', fontFamily: 'var(--font-logo)', fontWeight: 600 }}>
                 F
               </span>

               <div className="flex flex-col items-center justify-center w-0 overflow-hidden opacity-0 group-hover:w-16 group-hover:opacity-100 group-hover:-mx-0.5 transition-all duration-700 ease-in-out">
                  <span className="text-[9px] font-black uppercase leading-tight tracking-tight" 
                        style={{ color: 'var(--text-bold)', fontFamily: 'var(--font-sans)' }}>
                    Fatah
                  </span>
                  <span className="text-[9px] font-black uppercase leading-tight tracking-tight" 
                        style={{ color: 'var(--text-bold)', fontFamily: 'var(--font-sans)' }}>
                    Abdilah
                  </span>
               </div>

               <span className="text-3xl select-none leading-none pb-1 z-10" 
                     style={{ color: 'var(--text-bold)', fontFamily: 'var(--font-logo)', fontWeight: 600 }}>
                 A
               </span>
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