import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const products = [
  { id: 1, name: "Ravex Pro Click", category: "Mouse", price: 4499, specs: { sensor: "26K DPI", weight: "62g", battery: "90h", switches: "Optical" } },
  { id: 2, name: "Ravex Lite G1", category: "Mouse", price: 2999, specs: { sensor: "16K DPI", weight: "69g", battery: "60h", switches: "Mechanical" } },
  { id: 3, name: "Ravex 65% Elite", category: "Keyboards", price: 6999, specs: { switches: "Hot-swap", keycaps: "PBT", latency: "0.5ms", lighting: "RGB" } }
];

const Comparison = () => {
  const { user } = useAuth();
  const [selected, setSelected] = useState([products[0], products[1]]);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-background">
      <div className="container-tight">
        <Link to="/shop" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-tiffany mb-12 transition-colors">
          <ArrowLeft size={14} /> Back to Shop
        </Link>

        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter mb-6">
            Gear <span className="text-tiffany italic">Comparison</span>
          </h1>
          <p className="text-xl text-foreground/60 max-w-2xl leading-relaxed">
            Side-by-side spec analysis to help you choose your ultimate weapon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Comparison Labels */}
          <div className="hidden md:block pt-[280px] space-y-12">
            {["Category", "Price", ...Object.keys(selected[0].specs)].map(label => (
              <p key={label} className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 h-8 flex items-center">
                {label}
              </p>
            ))}
          </div>

          {/* Product Columns */}
          {selected.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border p-8 rounded-[2.5rem] relative"
            >
              <button className="absolute top-6 right-6 text-foreground/20 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
              
              <div className="aspect-square bg-background rounded-2xl mb-8 p-6 flex items-center justify-center">
                <div className="w-full h-full bg-tiffany/5 border border-tiffany/10 rounded-xl flex items-center justify-center font-black text-tiffany/40 uppercase tracking-tighter text-center px-4">
                  {item.name} Visual
                </div>
              </div>

              <h3 className="text-xl font-black uppercase mb-2">{item.name}</h3>
              <div className="h-px bg-border my-8" />

              <div className="space-y-12">
                <p className="font-bold uppercase tracking-widest text-xs h-8 flex items-center">{item.category}</p>
                <p className="text-2xl font-black text-tiffany h-8 flex items-center">₹{item.price.toLocaleString()}</p>
                {Object.entries(item.specs).map(([key, val]) => (
                  <p key={key} className="font-bold uppercase tracking-widest text-xs h-8 flex items-center">
                    {val}
                  </p>
                ))}
              </div>

              {user && (
                <button className="w-full btn-primary mt-12 py-5">Buy Now</button>
              )}
            </motion.div>
          ))}

          {/* Add Product Slot */}
          <div className="border-2 border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-tiffany/50 transition-colors">
            <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center text-foreground/20 group-hover:text-tiffany group-hover:scale-110 transition-all mb-4">
              <Plus size={32} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Add Gear to Compare</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comparison;
