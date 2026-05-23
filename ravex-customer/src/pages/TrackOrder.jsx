import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle2, Search, ArrowRight, MapPin } from 'lucide-react';

const TrackOrder = () => {
  const [trackingId, setTrackingId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackingId) return;
    setIsTracking(true);
    setTimeout(() => {
      setIsTracking(false);
      setShowResult(true);
    }, 1500);
  };

  const steps = [
    { label: "Order Confirmed", date: "May 06, 2024", status: "completed" },
    { label: "Processing", date: "May 07, 2024", status: "completed" },
    { label: "In Transit", date: "Today, 10:30 AM", status: "current" },
    { label: "Out for Delivery", date: "Expected by Evening", status: "pending" }
  ];

  return (
    <div className="pt-32 pb-20 min-h-screen bg-background">
      <div className="container-tight max-w-4xl mx-auto">
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter mb-6">
            Track <span className="text-tiffany italic">Order</span>
          </h1>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
            Enter your mobile number or tracking ID to see where your gear is.
          </p>
        </div>

        <div className="bg-card border border-border p-8 md:p-12 rounded-[2.5rem] mb-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-tiffany/5 blur-3xl rounded-full" />
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-6 relative z-10">
            <div className="flex-1 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20" size={20} />
              <input 
                type="text" 
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Mobile Number / Tracking ID"
                className="w-full bg-background border border-border px-16 py-5 rounded-2xl outline-none focus:border-tiffany transition-all font-bold uppercase tracking-widest text-xs"
              />
            </div>
            <button 
              type="submit"
              disabled={isTracking}
              className="bg-tiffany text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-tiffany-light transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isTracking ? "Locating..." : "Track Now"}
              {!isTracking && <ArrowRight size={18} />}
            </button>
          </form>
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border p-8 md:p-12 rounded-[2.5rem] shadow-2xl"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-12 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-tiffany/10 flex items-center justify-center text-tiffany">
                    <Package size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Status</p>
                    <h3 className="text-xl font-black uppercase">In Transit</h3>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-tiffany/10 flex items-center justify-center text-tiffany">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Destination</p>
                    <h3 className="text-xl font-black uppercase">Raipur, CG</h3>
                  </div>
                </div>
              </div>

              <div className="space-y-12 relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border" />
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-8 relative z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 ${
                      step.status === 'completed' ? 'bg-tiffany border-tiffany text-white' : 
                      step.status === 'current' ? 'bg-background border-tiffany text-tiffany' : 
                      'bg-background border-border text-foreground/20'
                    }`}>
                      {step.status === 'completed' ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                    </div>
                    <div>
                      <h4 className={`text-sm font-black uppercase tracking-widest ${
                        step.status === 'pending' ? 'text-foreground/20' : 'text-foreground'
                      }`}>
                        {step.label}
                      </h4>
                      <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-1">
                        {step.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TrackOrder;
