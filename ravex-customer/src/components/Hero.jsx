import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-16 bg-background">
      <div className="container-tight grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <motion.h1 
            className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-6"
          >
            {["Elevate", "Your", "Gaming", "Setup"].map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 100, rotate: -10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  rotate: 0,
                }}
                transition={{ 
                  type: "spring",
                  damping: 12,
                  stiffness: 100,
                  delay: index * 0.15,
                }}
                whileHover={{ scale: 1.1, rotate: 5, color: "#0ABAB5" }}
                className={`inline-block mr-3 cursor-default transition-colors ${index >= 1 ? 'text-tiffany' : ''} ${index === 0 ? 'block mb-2' : ''}`}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-foreground text-sm md:text-base max-w-md mx-auto lg:mx-0 mb-8 font-medium"
          >
            Pro-grade gear for elite performance. Simple. Powerful. Professional.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
          >
            <Link to="/shop" className="btn-primary">Shop All Gear</Link>
            <Link to="/shop" className="btn-outline">New Arrivals</Link>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full aspect-[16/9] lg:aspect-square overflow-hidden rounded-[2rem] shadow-2xl"
        >
          <img 
            src="/ravex_elite_keyboard_full_banner_1778151752241.png" 
            alt="Ravex Elite Full Size Keyboard" 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
