import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../context/ProductContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, addToCart, cartTotal } = useCart();
  const { products } = useProducts();
  const suggestedItems = products
    .filter(p => !cart.some(item => item.id === p.id))
    .slice(0, 2);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-20">
        <div className="h-32 w-32 rounded-full bg-white/5 flex items-center justify-center mb-8 text-white/20">
          <ShoppingBag size={64} />
        </div>
        <h2 className="text-3xl font-black font-display mb-4 uppercase">YOUR CART IS EMPTY</h2>
        <p className="text-white/40 mb-10 text-center max-w-sm">
          You haven't added any gear to your collection yet. Start exploring our latest drops.
        </p>
        <Link to="/shop" className="btn-primary">
          BROWSE GEAR
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-20">
      <div className="container px-6 mx-auto">
        <h1 className="text-4xl md:text-5xl font-black font-display mb-12 uppercase tracking-tight">
          YOUR <span className="text-primary">CART</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cart.map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-8 relative"
                >
                  <div className="h-32 w-32 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{item.category}</span>
                    <h3 className="text-xl font-bold font-display mt-1 mb-4">{item.name}</h3>
                    <div className="flex items-center justify-center sm:justify-start space-x-6">
                      <div className="flex items-center border border-white/10 rounded-lg h-10 overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 hover:bg-white/5"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 hover:bg-white/5"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-xl font-black font-display">₹{(item.price.replace(/,/g, '') * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-6 right-6 text-white/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="glass p-8 rounded-3xl sticky top-32 border-t-2 border-primary">
              <h3 className="text-2xl font-black font-display mb-8 uppercase tracking-wider">ORDER SUMMARY</h3>
              <div className="space-y-6 mb-8 text-sm uppercase tracking-widest font-bold">
                <div className="flex justify-between text-white/40">
                  <span>Subtotal</span>
                  <span className="text-white">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white/40">
                  <span>Shipping</span>
                  <span className="text-primary font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-white/40 border-t border-white/5 pt-6">
                  <span className="text-lg text-white">Total</span>
                  <span className="text-2xl text-white font-black font-display">₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>
              <Link to="/checkout" className="btn-primary w-full flex items-center justify-center space-x-3 h-14">
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight size={20} />
              </Link>
              
              {/* Suggested Add-ons */}
              <div className="mt-12 pt-8 border-t border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6">Suggested for you</p>
                <div className="space-y-4">
                  {suggestedItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
                      <div className="h-12 w-12 bg-background rounded-lg flex-shrink-0 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest">{item.name}</p>
                        <p className="text-xs font-black text-primary">₹{new Intl.NumberFormat('en-IN').format(parseInt(String(item.price).replace(/[^0-9]/g, '')))}</p>
                      </div>
                      <button 
                        onClick={() => addToCart(item)}
                        className="h-8 px-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-primary-light transition-all"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-white/30 text-center mt-6 tracking-widest uppercase">
                Secure 256-bit SSL Encrypted Payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
