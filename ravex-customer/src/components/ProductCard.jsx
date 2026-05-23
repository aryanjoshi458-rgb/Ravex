import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart, setIsCartOpen, setShouldOpenCheckout } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState(false);
  
  useEffect(() => {
    console.log(`Product: ${product.name}, Image: ${product.image}`);
  }, [product]);

  const isFavorited = isInWishlist(product.id);
  const [hearts, setHearts] = useState([]);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!product.isLimitedOffer || !product.offerEndTime) return;

    const timer = setInterval(() => {
      const end = new Date(product.offerEndTime).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("");
        clearInterval(timer);
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [product.isLimitedOffer, product.offerEndTime]);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    
    if (!isFavorited) {
      const newHearts = Array.from({ length: 6 }).map((_, i) => ({
        id: Math.random(),
        x: Math.random() * 60 - 30,
        y: Math.random() * -100 - 50,
        size: Math.random() * 8 + 8,
        delay: i * 0.1
      }));
      setHearts(newHearts);
      setTimeout(() => setHearts([]), 1500);
    }
  };

  const currentPriceNum = parseInt(String(product.price || '0').replace(/[^0-9]/g, ''));
  const mrpVal = parseInt(String(product.mrp || product.price || '0').replace(/[^0-9]/g, ''));
  const calculatedDiscount = mrpVal > currentPriceNum ? Math.round(((mrpVal - currentPriceNum) / mrpVal) * 100) : 0;
  const formattedMRP = new Intl.NumberFormat('en-IN').format(mrpVal);

  const isNewArrival = useMemo(() => {
    if (!product.isNew) return false;
    const firstVisit = localStorage.getItem('ravex_first_visit');
    if (!firstVisit) return true;
    const elapsed = Date.now() - parseInt(firstVisit);
    return elapsed < 259200000; // 72 hours
  }, [product.isNew]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="group relative bg-card rounded-[1.2rem] overflow-hidden border border-border hover:shadow-2xl hover:shadow-tiffany/10 transition-all duration-500 cursor-pointer"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-foreground/[0.03]">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 transition-all duration-300">
          {(product.showDiscount !== false && calculatedDiscount > 0) && (
            <div className="px-4 py-2 bg-tiffany/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-tiffany/20 border border-white/20">
              Save {calculatedDiscount}%
            </div>
          )}
          {isNewArrival && (
            <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-tiffany shadow-lg shadow-black/10 border border-tiffany/20 ml-auto">
              New Arrival
            </div>
          )}
        </div>

        {/* Bottom Overlays */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavorite}
            className={`p-3 rounded-full shadow-lg transition-all relative ${
              isFavorited ? 'bg-red-500 text-white' : 'bg-white/80 backdrop-blur-md text-black hover:text-red-500'
            }`}
          >
            <Heart size={16} className={isFavorited ? "fill-white" : ""} />
            
            <AnimatePresence>
              {hearts.map(heart => (
                <motion.div
                  key={heart.id}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: 0, 
                    scale: 1.5, 
                    x: heart.x, 
                    y: heart.y,
                    rotate: heart.x 
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, delay: heart.delay, ease: "easeOut" }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <Heart size={heart.size} fill="#ef4444" className="text-red-500" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.button>

          <div className="px-4 py-2 bg-white/80 backdrop-blur-md rounded-full flex items-center gap-2 shadow-lg border border-white/20">
            <Star size={12} fill="#EAB308" className="text-yellow-500" />
            <span className="text-[11px] font-black text-slate-900">{product.rating || '4.5'}</span>
          </div>
        </div>

        {/* Hover Action (Quick View & Cart) */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product.id}`);
          }}
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 cursor-pointer"
        >
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
              setIsCartOpen(true);
              setIsAdded(true);
              setTimeout(() => setIsAdded(false), 2000);
            }}
            className="p-4 bg-tiffany text-white rounded-full shadow-xl relative z-20"
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 45 }}
                >
                  <Check size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="cart"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <ShoppingCart size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView && onQuickView(product);
            }}
            className="p-4 bg-white text-black hover:text-tiffany rounded-full shadow-xl transition-colors relative z-20"
          >
            <Eye size={20} />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 pt-4">
        <div className="mb-4">
          <Link 
            to={`/product/${product.id}`} 
            onClick={(e) => e.stopPropagation()}
            className="block hover:text-tiffany transition-colors duration-300"
          >
            <h3 className="text-[1.05rem] font-medium text-foreground leading-snug">{product.name}</h3>
          </Link>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-medium text-foreground">₹ {new Intl.NumberFormat('en-IN').format(parseInt(String(product.price).replace(/[^0-9]/g, '')))}</span>
            <span className="text-lg font-medium text-foreground/30 line-through">
              MRP ₹ {formattedMRP}
            </span>
          </div>

          {/* Delivery Estimation */}
          <div className="flex items-center gap-2 mb-6 p-3 bg-foreground/[0.03] rounded-xl border border-dashed border-border">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-5 h-5 rounded-full border-2 border-card bg-tiffany flex items-center justify-center">
                  <Check size={8} className="text-white" strokeWidth={4} />
                </div>
              ))}
            </div>
            <div className="flex-1">
              <p className="text-[9px] font-black uppercase tracking-tighter text-foreground/40 leading-none mb-1">Guaranteed Delivery</p>
              <p className="text-[10px] font-black text-tiffany uppercase tracking-widest">
                Get it by {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
              </p>
            </div>
          </div>
          
          <div className={`${user ? 'grid grid-cols-2 gap-3' : 'w-full'}`}>
            <motion.button 
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              variants={{
                hover: { scale: 1.02, boxShadow: "0 10px 20px rgba(20,255,236,0.15)" },
                tap: { scale: 0.98 }
              }}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
                setIsCartOpen(true);
                setIsAdded(true);
                setTimeout(() => setIsAdded(false), 2000);
              }}
              className={`w-full py-4 text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-500 shadow-md flex items-center justify-center gap-2 relative overflow-hidden group ${
                isAdded ? 'bg-tiffany text-white' : 'bg-[#111] text-white hover:bg-tiffany'
              }`}
            >
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <motion.div
                    key="added"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 relative z-10"
                  >
                    <Check size={14} /> Added!
                  </motion.div>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative z-10"
                  >
                    Add to cart
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.div 
                variants={{
                  initial: { x: "-100%", opacity: 0 },
                  hover: { x: "200%", opacity: 1 }
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none"
              />
            </motion.button>

            {user && (
              <motion.button 
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                variants={{
                  hover: { scale: 1.02, boxShadow: "0 10px 20px rgba(20,255,236,0.15)" },
                  tap: { scale: 0.98 }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                  setShouldOpenCheckout(true);
                }}
                className="w-full py-4 bg-tiffany text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-tiffany-light transition-all duration-300 shadow-md flex items-center justify-center gap-2 relative overflow-hidden group"
              >
                <span className="relative z-10">Buy Now</span>
                <motion.div 
                  variants={{
                    initial: { x: "-100%", opacity: 0 },
                    hover: { x: "200%", opacity: 1 }
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none"
                />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
