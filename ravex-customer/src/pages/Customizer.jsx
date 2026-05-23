import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, MousePointer2, Keyboard, Zap, Sparkles } from 'lucide-react';

const Customizer = () => {
  const [activeGear, setActiveGear] = useState('mouse');
  const [primaryColor, setPrimaryColor] = useState('#0ABAB5'); // Tiffany Blue
  const [secondaryColor, setSecondaryColor] = useState('#000000');
  const [selectedSwitch, setSelectedSwitch] = useState('Linear');

  const colors = [
    { name: 'Tiffany Blue', hex: '#0ABAB5' },
    { name: 'Ravex Red', hex: '#FF3131' },
    { name: 'Cyber Purple', hex: '#BC13FE' },
    { name: 'Ghost White', hex: '#F8F8F8' },
    { name: 'Stealth Black', hex: '#111111' }
  ];

  const switches = [
    { name: 'Linear', feel: 'Smooth & Fast', color: 'red' },
    { name: 'Tactile', feel: 'Bumpy & Precise', color: 'brown' },
    { name: 'Clicky', feel: 'Loud & Satisfying', color: 'blue' }
  ];

  return (
    <div className="pt-32 pb-20 min-h-screen bg-background overflow-hidden">
      <div className="container-tight">
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter mb-6">
            Gear <span className="text-tiffany italic">Customizer</span>
          </h1>
          <p className="text-xl text-foreground/60 max-w-2xl leading-relaxed">
            Build your unique loadout. Choose your colors, switches, and performance mods.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-12">
            {/* Gear Select */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 mb-6">Select Base Gear</p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setActiveGear('mouse')}
                  className={`flex items-center justify-center gap-3 py-4 rounded-xl border transition-all ${
                    activeGear === 'mouse' ? 'bg-tiffany border-tiffany text-white' : 'bg-card border-border text-foreground/40 hover:border-foreground/20'
                  }`}
                >
                  <MousePointer2 size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Mouse</span>
                </button>
                <button 
                  onClick={() => setActiveGear('keyboard')}
                  className={`flex items-center justify-center gap-3 py-4 rounded-xl border transition-all ${
                    activeGear === 'keyboard' ? 'bg-tiffany border-tiffany text-white' : 'bg-card border-border text-foreground/40 hover:border-foreground/20'
                  }`}
                >
                  <Keyboard size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Keyboard</span>
                </button>
              </div>
            </div>

            {/* Color Palette */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 mb-6">Primary Theme</p>
              <div className="flex flex-wrap gap-4">
                {colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setPrimaryColor(color.hex)}
                    className={`w-12 h-12 rounded-full border-4 transition-all ${
                      primaryColor === color.hex ? 'border-foreground' : 'border-transparent scale-90 opacity-60'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Switches */}
            {activeGear === 'keyboard' && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 mb-6">Switch Selection</p>
                <div className="space-y-3">
                  {switches.map(sw => (
                    <button
                      key={sw.name}
                      onClick={() => setSelectedSwitch(sw.name)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                        selectedSwitch === sw.name ? 'bg-card border-tiffany text-tiffany' : 'bg-card/30 border-border text-foreground/40'
                      }`}
                    >
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest">{sw.name}</p>
                        <p className="text-[9px] font-bold opacity-60 italic">{sw.feel}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full bg-${sw.color}-500 shadow-lg`} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button className="w-full btn-primary py-5 gap-3 flex items-center justify-center">
              <Sparkles size={18} />
              Save Loadout
            </button>
          </div>

          {/* Visual Preview */}
          <div className="lg:col-span-8 sticky top-32">
            <div className="aspect-[4/3] bg-card border border-border rounded-[3rem] p-12 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-tiffany/5 via-transparent to-transparent opacity-50" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeGear + primaryColor}
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  className="relative z-10 w-full max-w-md h-full flex items-center justify-center"
                >
                  {/* Symbolic representation of gear with dynamic color */}
                  <div 
                    className="w-full h-full flex flex-col items-center justify-center gap-8 text-center"
                  >
                    <div 
                      className="w-64 h-64 rounded-[3rem] transition-colors duration-500 shadow-2xl flex items-center justify-center border-4 border-white/10"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {activeGear === 'mouse' ? (
                        <MousePointer2 size={120} className="text-white opacity-40" />
                      ) : (
                        <Keyboard size={120} className="text-white opacity-40" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black uppercase tracking-tighter">
                        Ravex <span style={{ color: primaryColor }}>Custom</span>
                      </h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-2">
                        Equipped with {activeGear === 'keyboard' ? `${selectedSwitch} Switches` : 'Graphene Core'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Specs Overlay */}
              <div className="absolute bottom-12 right-12 text-right">
                <div className="flex items-center gap-3 justify-end text-tiffany mb-2">
                  <Zap size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Peak Performance</span>
                </div>
                <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 italic leading-relaxed">
                  Engineered for Raipur's <br /> Elite Gamers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customizer;
