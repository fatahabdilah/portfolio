import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-40 pb-20 px-8 w-full max-w-5xl mx-auto flex flex-col items-center">
        <section className="w-full">
          <div className="flex flex-col items-center text-center mb-16">
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none dark:text-white">
              PORT<span className="text-blue-600">FOLIO</span>
            </h1>
            <p className="mt-8 text-xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
              Efek portal ini merubah seluruh komponen (teks, background, card) 
              secara instan di dalam lingkaran yang membesar.
            </p>
          </div>

          {/* Card Contoh untuk Melihat Efek Scanner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 rounded-3xl bg-blue-600 text-white shadow-2xl shadow-blue-500/20">
                <h3 className="text-2xl font-bold mb-2">Project 0{i}</h3>
                <p className="opacity-80">Melihat perubahan warna teks dan komponen di dalam portal.</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;