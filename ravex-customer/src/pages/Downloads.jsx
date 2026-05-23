import { motion } from 'framer-motion';
import { Download, Cpu, BookOpen, Monitor, Apple, Layout, Settings } from 'lucide-react';

const Downloads = () => {
  const mainSoftware = {
    name: "RAVEX HUB v2.0",
    description: "The ultimate command center for your gear. Customize RGB, rebind keys, and tune your sensor performance with pro-grade precision.",
    version: "2.0.4.12",
    size: "142 MB",
    updated: "2 days ago"
  };

  const downloadsList = [
    {
      category: "Firmware Updates",
      icon: <Cpu size={20} />,
      items: [
        { name: "Ravex Phantom 8k Firmware", version: "v1.2.0", date: "Jan 2024" },
        { name: "Ravex Apex Pro Keyboard", version: "v4.5.1", date: "Feb 2024" },
        { name: "Eclipse Wireless Headset", version: "v2.0.8", date: "Dec 2023" }
      ]
    },
    {
      category: "User Manuals",
      icon: <BookOpen size={20} />,
      items: [
        { name: "Phantom 8k Setup Guide", version: "PDF", date: "2024" },
        { name: "Apex Pro Customization", version: "PDF", date: "2024" },
        { name: "Ravex Hub Software Guide", version: "PDF", date: "2024" }
      ]
    },
    {
      category: "Wallpapers",
      icon: <Monitor size={20} />,
      items: [
        { name: "Ravex Brand Pack (4K)", version: "ZIP", date: "2024" },
        { name: "Tiffany Blue Aesthetic", version: "ZIP", date: "2024" },
        { name: "Neon Grid Series", version: "ZIP", date: "2024" }
      ]
    }
  ];

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="container-tight">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter mb-6">
              Driver <span className="text-tiffany italic">& Software</span>
            </h1>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
              Unleash the full potential of your hardware with our latest software and firmware updates.
            </p>
          </div>

          {/* Main Software CTA */}
          <div className="bg-card rounded-[2.5rem] p-8 md:p-16 border border-border mb-24 relative overflow-hidden group">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 text-tiffany mb-6">
                  <div className="p-3 bg-tiffany/10 rounded-xl">
                    <Settings size={28} className="animate-spin-slow" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.4em]">Official Software</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-none">
                  {mainSoftware.name}
                </h2>
                <p className="text-lg text-foreground/60 mb-10 leading-relaxed font-medium">
                  {mainSoftware.description}
                </p>
                <div className="flex flex-wrap gap-4 mb-10">
                  <div className="px-4 py-2 bg-background border border-border rounded-lg">
                    <p className="text-[8px] font-black uppercase text-foreground/40 mb-1">Version</p>
                    <p className="text-xs font-bold">{mainSoftware.version}</p>
                  </div>
                  <div className="px-4 py-2 bg-background border border-border rounded-lg">
                    <p className="text-[8px] font-black uppercase text-foreground/40 mb-1">Size</p>
                    <p className="text-xs font-bold">{mainSoftware.size}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-tiffany text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-tiffany-light transition-all active:scale-[0.98] shadow-[0_10px_20px_rgba(10,186,181,0.2)]">
                    <Download size={20} /> Download for Windows
                  </button>
                  <button className="bg-foreground text-background px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-[0.98]">
                    <Apple size={20} /> MacOS Beta
                  </button>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="aspect-square bg-tiffany/5 rounded-full absolute -top-20 -right-20 blur-3xl" />
                <div className="relative bg-background border border-border rounded-3xl p-4 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-card rounded-2xl p-6 h-[400px] flex items-center justify-center">
                    <Layout className="text-tiffany/20 w-32 h-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Other Downloads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {downloadsList.map((section, idx) => (
              <div key={idx} className="space-y-8">
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="text-tiffany">{section.icon}</div>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em]">{section.category}</h3>
                </div>
                <div className="space-y-4">
                  {section.items.map((item, i) => (
                    <div key={i} className="group flex items-center justify-between p-4 rounded-xl hover:bg-card border border-transparent hover:border-border transition-all cursor-pointer">
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1 group-hover:text-tiffany transition-colors">{item.name}</p>
                        <div className="flex gap-3 text-[8px] font-bold text-foreground/40 uppercase tracking-wider">
                          <span>{item.version}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                      <Download size={14} className="text-foreground/20 group-hover:text-tiffany transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Older Versions Footer */}
          <div className="mt-32 pt-10 border-t border-border text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/30">
              Need older versions? Visit our <span className="text-tiffany cursor-pointer hover:underline">Archive</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Downloads;
