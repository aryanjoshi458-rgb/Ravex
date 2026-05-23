import Hero from '../components/Hero';
import DynamicBanners from '../components/DynamicBanners';
import FeaturedProducts from '../components/FeaturedProducts';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const Home = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <main ref={containerRef} className="bg-background">
      {/* Hero Section with Parallax */}
      <motion.div style={{ y: heroY, opacity: heroOpacity }}>
        <Hero />
      </motion.div>

      <DynamicBanners />
      
      {/* Direct to Featured Products with zero gap */}
      <section className="pb-24 relative z-10">
        <div className="container-tight">
          <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
            <h2 className="text-sm font-bold uppercase tracking-tighter">Featured Products</h2>
            <span className="text-[10px] font-bold text-tiffany uppercase tracking-widest">Scroll to explore</span>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* Simple Tech Specs Section with subtle parallax */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container-tight grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Latency", value: "0.2ms" },
            { label: "Durability", value: "100M Clicks" },
            { label: "Warranty", value: "1 Years" },
            { label: "Shipping", value: "Global" }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-[10px] font-bold text-foreground/40 uppercase mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-tiffany">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
