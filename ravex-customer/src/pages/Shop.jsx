import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import QuickView from '../components/QuickView';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { Rocket, X, Cpu, Zap, Sparkles } from 'lucide-react';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const { setIsQuickViewOpen } = useAuth();
  const { products } = useProducts();

  // Sync state with URL params
  useEffect(() => {
    const category = searchParams.get('category') || 'All';
    setSelectedCategory(category);
  }, [searchParams]);

  const filteredProducts = (selectedCategory === 'All' 
    ? products 
    : selectedCategory === 'New Arrivals'
      ? products.filter(p => p.isNew)
      : products.filter(p => p.category === selectedCategory))
    .sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

  const handleCategoryChange = (cat) => {
    if (cat === 'New Launcher') {
      setIsLauncherOpen(true);
      return;
    }
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-background">
      <div className="container-tight">
        <header className="mb-12">
          <h1 className="text-4xl font-bold uppercase tracking-tighter mb-4">Pro Store</h1>
          <p className="text-foreground/40 text-sm max-w-xl">Filter by category to find the perfect gear for your competitive setup.</p>
        </header>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                selectedCategory === cat 
                  ? 'bg-tiffany border-tiffany text-white shadow-lg shadow-tiffany/20' 
                  : 'bg-card border-border text-foreground/80 hover:border-tiffany/50 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ProductCard 
                  product={product} 
                  onQuickView={(p) => {
                    setQuickViewProduct(p);
                    setIsQuickViewOpen(true);
                  }} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {quickViewProduct && (
            <QuickView 
              product={quickViewProduct} 
              onClose={() => {
                setQuickViewProduct(null);
                setIsQuickViewOpen(false);
              }} 
            />
          )}
        </AnimatePresence>

        {/* NEW LAUNCHER TEASER MODAL */}
        <AnimatePresence>
          {isLauncherOpen && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsLauncherOpen(false)}
                className="absolute inset-0 bg-background/90 backdrop-blur-3xl"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                className="relative w-full max-w-lg bg-card border border-border rounded-[3rem] p-12 overflow-hidden shadow-2xl"
              >
                {/* Background decorative elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-tiffany/20 blur-[100px] rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-tiffany/20 blur-[100px] rounded-full" />

                <button 
                  onClick={() => setIsLauncherOpen(false)}
                  className="absolute top-8 right-8 p-3 hover:bg-foreground/5 rounded-full transition-all"
                >
                  <X size={24} />
                </button>

                <div className="text-center relative z-10">
                  <motion.div 
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="h-24 w-24 bg-tiffany/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-tiffany"
                  >
                    <Rocket size={48} />
                  </motion.div>

                  <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Ravex Launcher</h2>
                  <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest mb-12">Total System Control. Zero Latency.</p>

                  <div className="space-y-6">
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="bg-background/50 border border-border p-4 rounded-2xl flex items-center gap-4"
                    >
                      <Cpu size={20} className="text-tiffany" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Hardware Sync Engine</span>
                    </motion.div>
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="bg-background/50 border border-border p-4 rounded-2xl flex items-center gap-4"
                    >
                      <Zap size={20} className="text-tiffany" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Macro Optimization Pro</span>
                    </motion.div>
                  </div>

                  <div className="mt-16">
                    <motion.div 
                      animate={{ 
                        opacity: [0.3, 1, 0.3],
                        scale: [0.98, 1, 0.98]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-tiffany/5 border border-tiffany/20 rounded-full"
                    >
                      <Sparkles size={16} className="text-tiffany" />
                      <span className="text-[11px] font-black uppercase tracking-[0.3em] text-tiffany">Coming Soon</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Shop;
