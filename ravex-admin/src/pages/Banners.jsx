import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Trash2, 
  X,
  CheckCircle,
  ShoppingBag,
  Zap,
  Star,
  Activity,
  Image as ImageIcon
} from 'lucide-react';

const Banners = () => {
  const { isDarkMode } = useOutletContext() || { isDarkMode: false };
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    image: '',
    style: 'gradient',
    animation: 'fade',
    type: 'Sale',
    status: 'active'
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('http://localhost:3000/banners');
      const data = await res.json();
      setBanners(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBanner)
      });
      if (res.ok) {
        fetchBanners();
        setIsModalOpen(false);
        setNewBanner({ title: '', subtitle: '', image: '', style: 'gradient', animation: 'fade', type: 'Sale', status: 'active' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await fetch(`http://localhost:3000/banners/${id}`, { method: 'DELETE' });
      setBanners(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBanners = (banners || []).filter(b => 
    b && b.title && b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStyleClass = (style) => {
    switch(style) {
      case 'gradient': return 'bg-gradient-to-r from-tiffany/20 to-blue-500/20 border-tiffany/30';
      case 'glassmorphism': return 'bg-white/5 backdrop-blur-md border-white/10';
      case 'dark': return 'bg-black/40 border-white/5';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-tiffany/20 border-t-tiffany rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10 font-gaming">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-[28px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>Banner Manager</h1>
          <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-600'} font-semibold mt-1`}>Design and schedule marketing banners for your storefront.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-tiffany text-white font-black px-8 py-4 rounded-lg flex items-center gap-3 shadow-xl shadow-tiffany/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={18} />
          <span className="text-[11px] tracking-widest">Create Banner</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {filteredBanners.map((banner) => (
          <motion.div 
            key={banner.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative group rounded-lg border overflow-hidden transition-all ${getStyleClass(banner.style)}`}
          >
            <div className="p-10 flex flex-col md:flex-row gap-8 items-center">
              {/* Preview Box */}
              <div className="w-full md:w-48 h-32 rounded-lg bg-black/20 flex items-center justify-center relative overflow-hidden shrink-0 border border-white/10">
                {banner.image ? (
                  <img src={banner.image} alt="" className="w-full h-full object-cover opacity-60" />
                ) : (
                  <ImageIcon size={32} className="text-white/20" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className={`px-3 py-1 rounded-full text-[8px] font-black tracking-widest bg-tiffany text-white shadow-lg`}>{banner.animation}</div>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest ${isDarkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    {banner.type}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-400" />
                  <span className="text-[9px] font-bold text-tiffany tracking-widest">{banner.status}</span>
                </div>
                <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tighter mb-1`}>{banner.title}</h3>
                <p className={`text-[11px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} tracking-tight`}>{banner.subtitle}</p>
              </div>

              <div className="flex md:flex-col gap-2">
                <button 
                  onClick={() => handleDelete(banner.id)}
                  className={`p-3 rounded-lg border transition-all ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400 hover:text-red-500 hover:bg-red-500/10' : 'bg-white border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            {/* Decoration Bar */}
            <div className={`h-1 w-full absolute bottom-0 left-0 bg-tiffany shadow-[0_-5px_15px_rgba(20,255,236,0.3)]`} />
          </motion.div>
        ))}
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative w-full max-w-2xl ${isDarkMode ? 'bg-[#1a2235] border-white/10' : 'bg-white border-gray-100'} rounded-lg shadow-2xl z-[101] border p-10 overflow-hidden overflow-y-auto max-h-[90vh]`}
            >
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tighter`}>Create Marketing Banner</h2>
                  <p className="text-[10px] text-gray-400 font-bold mt-1 tracking-widest">Select seasonal presets and animations.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>

              <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6 md:col-span-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 tracking-widest px-1">Banner Headline (Title)</label>
                    <input 
                      required
                      type="text" 
                      value={newBanner.title}
                      onChange={(e) => setNewBanner({...newBanner, title: e.target.value.toUpperCase()})}
                      className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 px-5 text-sm font-bold outline-none focus:border-tiffany transition-all`}
                      placeholder="e.g. DIWALI MEGA SALE"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 tracking-widest px-1">Sub-Headline (Offer Details)</label>
                    <input 
                      required
                      type="text" 
                      value={newBanner.subtitle}
                      onChange={(e) => setNewBanner({...newBanner, subtitle: e.target.value})}
                      className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 px-5 text-sm font-bold outline-none focus:border-tiffany transition-all`}
                      placeholder="e.g. Up to 70% Off on Gaming Peripherals"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 tracking-widest px-1">Visual Style</label>
                  <select 
                    value={newBanner.style}
                    onChange={(e) => setNewBanner({...newBanner, style: e.target.value})}
                    className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 px-5 text-sm font-bold outline-none focus:border-tiffany transition-all appearance-none`}
                  >
                    <option value="gradient">Modern Gradient</option>
                    <option value="glassmorphism">Glassmorphism</option>
                    <option value="dark">Stealth Dark</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 tracking-widest px-1">Animation Effect</label>
                  <select 
                    value={newBanner.animation}
                    onChange={(e) => setNewBanner({...newBanner, animation: e.target.value})}
                    className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 px-5 text-sm font-bold outline-none focus:border-tiffany transition-all appearance-none`}
                  >
                    <option value="fade">Smooth Fade</option>
                    <option value="slide">Side Slide</option>
                    <option value="zoom">Slow Zoom</option>
                    <option value="pulse">Heartbeat Pulse</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 tracking-widest px-1">Season / Category</label>
                  <select 
                    value={newBanner.type}
                    onChange={(e) => setNewBanner({...newBanner, type: e.target.value})}
                    className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 px-5 text-sm font-bold outline-none focus:border-tiffany transition-all appearance-none`}
                  >
                    <option value="Festival">Festival (Diwali, Eid, Holi)</option>
                    <option value="Seasonal">Seasonal (Summer, Winter)</option>
                    <option value="Sale">Clearance Sale</option>
                    <option value="New Launch">New Product Launch</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 tracking-widest px-1">Image URL</label>
                  <input 
                    type="text" 
                    value={newBanner.image}
                    onChange={(e) => setNewBanner({...newBanner, image: e.target.value})}
                    className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 px-5 text-sm font-bold outline-none focus:border-tiffany transition-all`}
                    placeholder="https://example.com/banner.jpg"
                  />
                </div>

                <div className="md:col-span-2 pt-6">
                  <button 
                    type="submit"
                    className="w-full bg-tiffany text-white font-black py-5 rounded-lg shadow-xl shadow-tiffany/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3"
                  >
                    <CheckCircle size={20} />
                    <span className="text-[11px] tracking-[0.2em]">Deploy Banner</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Banners;
