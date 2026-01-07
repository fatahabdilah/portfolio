import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ onFinished }) => {
  const [text, setText] = useState("Loading");
  const [dots, setDots] = useState("");

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const dotsInterval = setInterval(() => {
      setDots(prev => (prev.length < 4 ? prev + "." : ""));
    }, 400);

    const timer1 = setTimeout(() => {
      clearInterval(dotsInterval);
      setText("WELCOME TO OUR PAGE");
      setDots("");
    }, 3000);

    const timer2 = setTimeout(() => {
      document.body.style.overflow = 'unset';
      onFinished();
    }, 5000);

    return () => {
      clearInterval(dotsInterval);
      clearTimeout(timer1);
      clearTimeout(timer2);
      document.body.style.overflow = 'unset';
    };
  }, [onFinished]);

  const curveVariants = {
    initial: { d: "M0 0 L100 0 L100 100 Q50 100 0 100 L0 0" },
    exit: { 
      d: "M0 0 L100 0 L100 0 Q50 0 0 0 L0 0",
      transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
    }
  };

  return (
    <motion.div
      initial={{ y: 0 }}
      // Mengubah ke -120% agar shadow benar-benar menghilang ke atas layar
      exit={{ y: "-120%" }} 
      transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
      // Shadow sangat tebal untuk efek kedalaman tirai
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-white shadow-[0_60px_100px_rgba(0,0,0,0.5)]"
    >
      <div className="relative z-20">
        <span className="text-lg md:text-xl font-normal text-zinc-500 tracking-tight">
          {text}{dots}
        </span>
      </div>

      <svg className="absolute top-0 w-full h-[calc(100%+300px)] pointer-events-none">
        <motion.path variants={curveVariants} initial="initial" exit="exit" fill="white" />
      </svg>
    </motion.div>
  );
};

export default LoadingScreen;