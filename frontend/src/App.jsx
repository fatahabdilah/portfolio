import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <Header />
      
      {/* Konten Utama dengan Z-index di bawah Header */}
      <main className="flex-grow pt-44 pb-24 px-8 w-full max-w-5xl mx-auto flex flex-col items-center relative z-10">
        <section className="text-center mb-24">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] dark:text-white mb-10">
            Digital <br /> 
            <span className="text-blue-600 italic">Architect.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Fix: <strong>View Transition Isolation</strong> memisahkan layer Header dan Konten 
            sehingga transparansi blur tidak pecah saat Portal Lingkaran lewat.
          </p>
        </section>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="md:col-span-2 h-80 rounded-[2.5rem] bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-10 transition-colors duration-500"></div>
          <div className="h-80 rounded-[2.5rem] bg-blue-600 p-10 shadow-2xl shadow-blue-600/20"></div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;