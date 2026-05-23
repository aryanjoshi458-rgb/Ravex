import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DynamicBanners = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3000/banners')
      .then(res => res.json())
      .then(data => {
        const activeBanners = Array.isArray(data) ? data.filter(b => b.status === 'active') : [];
        setBanners(activeBanners);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners]);

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  const getStyleStyles = (style) => {
    switch (style) {
      case 'gradient': return 'bg-gradient-to-r from-[#0ABAB5] to-[#2D3436] text-white';
      case 'glassmorphism': return 'bg-white/10 backdrop-blur-xl border border-white/20 text-white';
      case 'dark': return 'bg-[#0a0a0a] text-white border border-white/5';
      default: return 'bg-white text-gray-900';
    }
  };

  const getAnimationVariants = (anim) => {
    switch (anim) {
      case 'pulse': return {
        animate: { scale: [1, 1.02, 1], transition: { repeat: Infinity, duration: 2 } }
      };
      case 'zoom': return {
        initial: { scale: 1.1, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: { duration: 1.5 } }
      };
      case 'slide': return {
        initial: { x: 100, opacity: 0 },
        animate: { x: 0, opacity: 1, transition: { type: 'spring', damping: 20 } }
      };
      default: return {
        initial: { opacity: 0 },
        animate: { opacity: 1 }
      };
    }
  };

  const variants = getAnimationVariants(currentBanner.animation);

  return (
    <section className="relative w-full overflow-hidden py-12">
      <div className="container-tight px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner.id}
            {...variants}
            className={`relative min-h-[300px] rounded-[2rem] flex flex-col md:flex-row items-center gap-10 p-12 overflow-hidden shadow-2xl ${getStyleStyles(currentBanner.style)}`}
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div className="flex-1 text-center md:text-left z-10">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-3 py-1 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-[0.2em] mb-4"
              >
                {currentBanner.type} Special
              </motion.div>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 leading-none"
              >
                {currentBanner.title}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm md:text-lg opacity-80 font-bold uppercase tracking-wide mb-8"
              >
                {currentBanner.subtitle}
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl"
              >
                Shop Now
              </motion.button>
            </div>

            {currentBanner.image && (
              <div className="flex-1 w-full md:w-auto h-48 md:h-full relative z-10 flex items-center justify-center">
                <img 
                  src={currentBanner.image} 
                  alt="" 
                  className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DynamicBanners;
