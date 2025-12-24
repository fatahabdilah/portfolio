import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white py-12 mt-auto">
      {/* Kontainer Footer disesuaikan max-width nya dengan Header */}
      <div className="max-w-5xl mx-auto px-8">
        <div className="border-t border-gray-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-gray-900">Fatah Abdilah</h3>
            <p className="text-sm text-gray-500 mt-1">Fullstack Developer & UI Enthusiast.</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex gap-6">
               <a href="#" className="text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Github</a>
               <a href="#" className="text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Linkedin</a>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-300 font-medium mt-2">
              &copy; {currentYear} — Built with Passion
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;