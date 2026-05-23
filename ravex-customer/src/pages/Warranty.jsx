import { motion } from 'framer-motion';
import { ShieldCheck, FileText, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

const Warranty = () => {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="container-tight">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter mb-6">
              Warranty <span className="text-tiffany italic">& Support</span>
            </h1>
            <p className="text-xl text-foreground/60 max-w-2xl leading-relaxed">
              We stand behind every piece of gear we build. Our warranty ensures you stay in the game without worry.
            </p>
          </div>

          {/* Warranty Claim Process */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-tiffany transition-colors">
              <div className="w-12 h-12 bg-tiffany/10 rounded-xl flex items-center justify-center text-tiffany mb-6 group-hover:bg-tiffany group-hover:text-white transition-all">
                <FileText size={24} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-3">Step 1: Prep</h3>
              <p className="text-xs text-foreground/60 leading-relaxed uppercase font-bold">Have your invoice and product serial number ready.</p>
            </div>
            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-tiffany transition-colors">
              <div className="w-12 h-12 bg-tiffany/10 rounded-xl flex items-center justify-center text-tiffany mb-6 group-hover:bg-tiffany group-hover:text-white transition-all">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-3">Step 2: Submit</h3>
              <p className="text-xs text-foreground/60 leading-relaxed uppercase font-bold">Contact our support team with a detailed description of the issue.</p>
            </div>
            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-tiffany transition-colors">
              <div className="w-12 h-12 bg-tiffany/10 rounded-xl flex items-center justify-center text-tiffany mb-6 group-hover:bg-tiffany group-hover:text-white transition-all">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-3">Step 3: Resolve</h3>
              <p className="text-xs text-foreground/60 leading-relaxed uppercase font-bold">We'll repair or replace your gear within 7-14 business days.</p>
            </div>
          </div>

          {/* Detailed Points */}
          <div className="space-y-16">
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                <CheckCircle2 className="text-tiffany" /> What's Covered
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "Manufacturing defects in materials or workmanship.",
                  "Hardware failure under normal usage conditions.",
                  "Electrical component issues or sensor malfunction.",
                  "Battery performance falling below 70% within warranty period.",
                  "Switch failure (double-clicking) for optical switches.",
                  "Structural integrity of the product frame."
                ].map((point, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-card/50 border border-border/50">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-tiffany flex-shrink-0" />
                    <p className="text-[11px] font-bold uppercase tracking-wide text-foreground/80">{point}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                <AlertCircle className="text-red-500" /> What's NOT Covered
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "Accidental damage (drops, spills, water damage).",
                  "Cosmetic wear and tear from normal usage.",
                  "Modifications or repairs by unauthorized personnel.",
                  "Damage caused by use with non-compatible software/hardware.",
                  "Products purchased from unauthorized resellers.",
                  "Loss or theft of the product."
                ].map((point, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    <p className="text-[11px] font-bold uppercase tracking-wide text-foreground/80">{point}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Support CTA */}
            <div className="bg-tiffany p-10 rounded-3xl text-white overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Need Help Now?</h3>
                <p className="text-white/80 font-bold uppercase tracking-widest text-sm mb-8">Our support team is online and ready to assist you.</p>
                <div className="flex flex-wrap gap-4">
                  <a href="mailto:support@ravex.tech" className="bg-white text-tiffany px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white/90 transition-colors">
                    Email Support
                  </a>
                  <a href="tel:+919876543210" className="bg-black/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-black/30 transition-colors">
                    Call Hotline
                  </a>
                </div>
              </div>
              <HelpCircle className="absolute -right-10 -bottom-10 w-64 h-64 text-white/10 rotate-12" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Warranty;
