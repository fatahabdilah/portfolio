import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-blue-500 selection:text-white">
      <Header />
      
      <main className="flex-grow pt-56 pb-24 px-8 w-full max-w-5xl mx-auto">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center mb-32">
          <h1 className="text-6xl md:text-8xl font-medium tracking-tight leading-[0.9] mb-12" 
              style={{ fontFamily: 'var(--font-logo)', color: 'var(--text-bold)' }}>
            Building <br /> 
            Digital <span className="opacity-40 italic">Experiences.</span>
          </h1>
          
          <p className="max-w-xl text-lg md:text-xl leading-relaxed opacity-70" style={{ color: 'var(--text-main)' }}>
            Crafting aesthetic and functional digital solutions with a focus on high performance and exceptional user experience.
          </p>
        </section>

        {/* About Section */}
        <section id="about" className="pt-20 border-t border-slate-200 dark:border-white/5">
          <h2 className="text-sm font-black uppercase tracking-[0.4em] mb-16 opacity-40 text-center md:text-left">
            About
          </h2>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-20">
            {/* Profile Image Area */}
            <div className="shrink-0">
              <div className="w-48 h-60 md:w-64 md:h-80 rounded-[2rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl rotate-3 hover:rotate-0 bg-slate-200 dark:bg-white/5">
                <img 
                  src="/images/Fatah Abdilah.png" 
                  alt="Fatah Abdilah" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Description Text */}
            <div className="flex flex-col gap-6 text-lg leading-relaxed max-w-2xl" style={{ color: 'var(--text-main)' }}>
              <p>
                I am a Computer Science student focused on Web and Android application development, with a strong foundation in building end-to-end digital solutions. My experience spans the entire development lifecycle, from meticulously crafting user interfaces to ensuring seamless functional integration.
              </p>
              <p>
                As a versatile developer, I thrive in collaborative environments, working effectively within development teams to deliver structured and high-quality digital results. I am committed to leveraging my technical expertise to solve complex problems and create impactful software experiences.
              </p>
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