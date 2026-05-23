import { useCart } from '../context/CartContext';
import { ShieldCheck, CreditCard, Truck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { cartTotal } = useCart();

  return (
    <div className="min-h-screen pt-40 pb-20 bg-background">
      <div className="container px-6 mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Form */}
          <div className="flex-1 space-y-12">
            <div>
              <Link to="/cart" className="inline-flex items-center space-x-2 text-white/50 hover:text-primary transition-colors mb-8 uppercase text-[10px] font-black tracking-[0.2em]">
                <ArrowLeft size={14} />
                <span>Return to Shop</span>
              </Link>
              <h1 className="text-4xl font-black font-display uppercase tracking-tight mb-2">SECURE <span className="text-primary">CHECKOUT</span></h1>
              <p className="text-white/40 text-sm tracking-widest uppercase">Complete your acquisition</p>
            </div>

            {/* Shipping */}
            <div className="space-y-6">
              <h3 className="flex items-center space-x-3 text-xl font-bold font-display uppercase">
                <Truck className="text-primary" size={24} />
                <span>Shipping Intel</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-primary transition-colors col-span-1" />
                <input type="text" placeholder="Last Name" className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-primary transition-colors col-span-1" />
                <input type="text" placeholder="Address" className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-primary transition-colors col-span-2" />
                <input type="text" placeholder="City" className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-primary transition-colors col-span-1" />
                <input type="text" placeholder="Postal Code" className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-primary transition-colors col-span-1" />
              </div>
            </div>

            {/* Payment */}
            <div className="space-y-6">
              <h3 className="flex items-center space-x-3 text-xl font-bold font-display uppercase">
                <CreditCard className="text-primary" size={24} />
                <span>Payment Method</span>
              </h3>
              <div className="glass p-6 rounded-2xl space-y-4">
                <div className="flex items-center p-4 border border-primary/50 bg-primary/10 rounded-xl">
                  <div className="h-4 w-4 rounded-full border-4 border-primary mr-4"></div>
                  <span className="font-bold">Credit / Debit Card</span>
                </div>
                <div className="space-y-4">
                  <input type="text" placeholder="Card Number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-primary transition-colors" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="MM/YY" className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-primary transition-colors" />
                    <input type="text" placeholder="CVC" className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="glass p-8 rounded-3xl sticky top-32 border-b-2 border-primary">
              <h3 className="text-xl font-black font-display mb-8 uppercase tracking-widest">SUMMARY</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-white/40 text-sm uppercase tracking-widest font-bold">
                  <span>Subtotal</span>
                  <span className="text-white">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white/40 text-sm uppercase tracking-widest font-bold">
                  <span>Shipping</span>
                  <span className="text-tiffany">FREE</span>
                </div>
                
                {/* Ravex Points Redemption */}
                <div className="py-4 my-4 border-y border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-tiffany">Ravex Points</span>
                    <span className="text-[10px] font-bold text-white/40 italic">2,450 available</span>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Pts to use" 
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-tiffany outline-none"
                    />
                    <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">Apply</button>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <span className="text-white font-bold uppercase tracking-widest">Total Due</span>
                  <span className="text-3xl font-black font-display text-tiffany">₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>
              <button className="btn-primary w-full h-14 flex items-center justify-center space-x-3">
                <ShieldCheck size={20} />
                <span>CONFIRM ORDER</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
