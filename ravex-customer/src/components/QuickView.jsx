import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, Zap, Heart, Shield, RotateCcw, Share2, ExternalLink, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const QuickView = ({ product, onClose }) => {
  const { addToCart, setShouldOpenCheckout } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => {
      document.body.style.overflow = 'unset';
      clearTimeout(timer);
    };
  }, []);

  if (!product) return null;

  const currentPriceNum = parseInt(String(product.price).replace(/[^0-9]/g, ''));
  const mrp = parseInt(String(product.mrp || product.price).replace(/[^0-9]/g, ''));
  const formattedMRP = new Intl.NumberFormat('en-IN').format(mrp);
  const calculatedDiscount = mrp > currentPriceNum ? Math.round(((mrp - currentPriceNum) / mrp) * 100) : 0;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.origin + '/product/' + product.id,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + '/product/' + product.id);
      alert('Link copied to clipboard!');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000]"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.4, 0, 0.2, 1] 
        }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[98%] max-w-7xl max-h-[95vh] overflow-y-auto bg-background border border-border rounded-[1.5rem] z-[1001] shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-8 right-8 p-2.5 rounded-full bg-card/80 border border-border hover:text-tiffany hover:bg-card transition-all z-[1002]"
        >
          <X size={22} />
        </motion.button>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="global-loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex-1 flex flex-col items-center justify-center min-h-[600px] gap-6"
            >
              <div className="w-48 h-[2px] bg-foreground/10 rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-y-0 left-0 bg-tiffany"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col md:flex-row w-full h-full"
            >
              {/* Left Side: Image container */}
              <div className="flex-1 bg-white/[0.03] flex items-center justify-center relative overflow-hidden group min-h-[400px] md:min-h-[700px] p-0">
                <div className="absolute inset-0 bg-gradient-to-br from-tiffany/5 to-transparent opacity-30" />
                <motion.img 
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
                />
              </div>

              {/* Right Side: Info Panel */}
              <div className="flex-1 p-8 md:p-16 flex flex-col justify-between overflow-y-auto bg-background">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col h-full justify-between"
                >
                  <div>
                    <div className="mb-6">
                      <motion.p variants={itemVariants} className="text-xs font-medium text-foreground/40 mb-2 tracking-wider">RAVEX</motion.p>
                      <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl font-medium leading-tight mb-4">{product.name}</motion.h2>
                      
                      {/* Price Section */}
                      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
                        <span className="text-2xl font-bold text-foreground">₹ {new Intl.NumberFormat('en-IN').format(currentPriceNum)}</span>
                        <span className="text-sm font-medium text-foreground/40 line-through">MRP ₹ {formattedMRP}</span>
                        {calculatedDiscount > 0 && (
                          <span className="px-2 py-0.5 bg-black text-white text-[10px] font-bold rounded">
                            {calculatedDiscount}% OFF
                          </span>
                        )}
                      </motion.div>

                      {/* Rating */}
                      <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6">
                        <div className="flex items-center gap-0.5 text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              fill={i < Math.floor(product.rating || 4.8) ? "currentColor" : "none"} 
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-medium text-foreground/40">{product.rating || '4.8'} | 50 reviews</span>
                      </motion.div>

                      {/* Actions */}
                      <motion.div variants={itemVariants} className="flex flex-col gap-4 mb-8">
                        <div className="flex gap-4">
                          <motion.button 
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                            variants={{
                              initial: { 
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                boxShadow: "0 0 0 rgba(255, 255, 255, 0)"
                              },
                              hover: { 
                                scale: 1.02,
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)"
                              },
                              tap: { scale: 0.98 }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                            className="flex-1 h-14 border border-border rounded-full font-bold text-sm relative z-20 overflow-hidden"
                          >
                            <div className="relative h-5 overflow-hidden flex flex-col items-center">
                              <motion.span 
                                variants={{
                                  initial: { y: 0 },
                                  hover: { y: -25 }
                                }}
                                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                className="block"
                              >
                                Add to cart
                              </motion.span>
                              <motion.span 
                                variants={{
                                  initial: { y: 25 },
                                  hover: { y: 0 }
                                }}
                                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                className="absolute top-0 w-full text-center"
                              >
                                Add to cart
                              </motion.span>
                            </div>
                          </motion.button>

                          {user && (
                            <motion.button 
                              initial="initial"
                              whileHover="hover"
                              whileTap="tap"
                              variants={{
                                initial: { 
                                  backgroundColor: "var(--foreground)",
                                  color: "var(--background)",
                                  boxShadow: "0 0 0 rgba(10, 186, 181, 0)"
                                },
                                hover: { 
                                  scale: 1.02,
                                  backgroundColor: "#0ABAB5",
                                  color: "#ffffff",
                                  boxShadow: "0 0 25px rgba(10, 186, 181, 0.5)"
                                },
                                tap: { scale: 0.98 }
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product);
                                onClose();
                                setShouldOpenCheckout(true);
                              }}
                              className="flex-1 h-14 rounded-full font-bold text-sm relative z-20 overflow-hidden"
                            >
                              <div className="relative h-5 overflow-hidden flex flex-col items-center">
                                <motion.span 
                                  variants={{
                                    initial: { y: 0 },
                                    hover: { y: -25 }
                                  }}
                                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                  className="block"
                                >
                                  Buy Now
                                </motion.span>
                                <motion.span 
                                  variants={{
                                    initial: { y: 25 },
                                    hover: { y: 0 }
                                  }}
                                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                  className="absolute top-0 w-full text-center"
                                >
                                  Buy Now
                                </motion.span>
                              </div>
                            </motion.button>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={handleShare}
                            className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground/40 hover:text-tiffany hover:border-tiffany transition-all"
                            title="Share"
                          >
                            <Share2 size={18} />
                          </button>
                          <button 
                            onClick={() => toggleWishlist(product)}
                            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                              isInWishlist(product.id) ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'border-border text-foreground/40 hover:text-red-500 hover:border-red-500'
                            }`}
                          >
                            <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Footer Link */}
                  <motion.div variants={itemVariants} className="pt-8 mt-4 border-t border-border">
                    <Link 
                      to={`/product/${product.id}`}
                      onClick={onClose}
                      className="flex items-center justify-between group hover:text-tiffany transition-colors py-2"
                    >
                      <span className="text-sm font-bold tracking-tight uppercase">View full details</span>
                      <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-tiffany/10 group-hover:text-tiffany transition-all">
                        <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default QuickView;
