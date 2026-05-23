import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { 
  Tag, 
  Plus, 
  Search, 
  Trash2, 
  Clock, 
  X,
  CheckCircle,
  ShoppingBag
} from 'lucide-react';

const Coupons = () => {
  const { isDarkMode } = useOutletContext() || { isDarkMode: false };
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrder: '',
    expiry: '',
    status: 'active'
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('http://localhost:3000/coupons');
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCoupon, used: 0 })
      });
      if (res.ok) {
        fetchCoupons();
        setIsModalOpen(false);
        setNewCoupon({ code: '', type: 'percentage', value: '', minOrder: '', expiry: '', status: 'active' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await fetch(`http://localhost:3000/coupons/${id}`, { method: 'DELETE' });
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCoupons = (coupons || []).filter(c => 
    c && c.code && c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className={`text-[28px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>Coupon Manager</h1>
          <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-600'} font-semibold mt-1`}>Manage store promotions and discount campaigns.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-tiffany text-white font-black px-8 py-4 rounded-lg flex items-center gap-3 shadow-xl shadow-tiffany/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={18} />
          <span className="text-[11px] tracking-widest">Create Coupon</span>
        </button>
      </div>

      {/* Main Container */}
      <div className={`${isDarkMode ? 'bg-[#1a2235] border-white/5' : 'bg-white border-gray-100 shadow-sm'} rounded-lg border overflow-hidden`}>
        <div className={`p-8 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}>
          <div className="relative max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search Coupon Code..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50/50 border-gray-200 text-gray-800'} rounded-lg text-[13px] font-bold outline-none focus:border-tiffany transition-all`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`${isDarkMode ? 'bg-white/5' : 'bg-gray-50/50'} border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 tracking-widest">Coupon Code</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 tracking-widest">Value</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 tracking-widest">Expiry Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 tracking-widest">Usage</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className={`${isDarkMode ? 'hover:bg-white/[0.02] border-white/5' : 'hover:bg-gray-50/30 border-gray-50'} border-b transition-colors group`}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-lg ${isDarkMode ? 'bg-tiffany/10' : 'bg-tiffany/5'} flex items-center justify-center text-tiffany`}>
                        <Tag size={16} />
                      </div>
                      <span className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tighter`}>{coupon.code}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-gray-400" />
                      <span className={`text-sm font-black ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock size={14} />
                      <span className="text-[11px] font-bold">{coupon.expiry}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-xs font-black ${isDarkMode ? 'text-tiffany' : 'text-gray-800'}`}>{coupon.used} times</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black tracking-widest ${
                      coupon.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleDelete(coupon.id)}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
              className={`relative w-full max-w-xl ${isDarkMode ? 'bg-[#1a2235] border-white/10' : 'bg-white border-gray-100'} rounded-lg shadow-2xl z-[101] border p-10 overflow-hidden`}
            >
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tighter`}>Create Promo</h2>
                  <p className="text-[10px] text-gray-400 font-bold mt-1 tracking-widest">Define new discount parameters.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>

              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 tracking-widest px-1">Coupon Code</label>
                  <input 
                    required
                    type="text" 
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                    className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 px-5 text-sm font-bold outline-none focus:border-tiffany transition-all`}
                    placeholder="e.g. SUMMER50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Discount Type</label>
                    <select 
                      value={newCoupon.type}
                      onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value})}
                      className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 px-5 text-sm font-bold outline-none focus:border-tiffany transition-all appearance-none`}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Value</label>
                    <input 
                      required
                      type="number" 
                      value={newCoupon.value}
                      onChange={(e) => setNewCoupon({...newCoupon, value: e.target.value})}
                      className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 px-5 text-sm font-bold outline-none focus:border-tiffany transition-all`}
                      placeholder={newCoupon.type === 'percentage' ? '20' : '500'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Min. Order</label>
                    <input 
                      required
                      type="number" 
                      value={newCoupon.minOrder}
                      onChange={(e) => setNewCoupon({...newCoupon, minOrder: e.target.value})}
                      className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 px-5 text-sm font-bold outline-none focus:border-tiffany transition-all`}
                      placeholder="1000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Expiry Date</label>
                    <input 
                      required
                      type="date" 
                      value={newCoupon.expiry}
                      onChange={(e) => setNewCoupon({...newCoupon, expiry: e.target.value})}
                      className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 px-5 text-sm font-bold outline-none focus:border-tiffany transition-all`}
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    className="w-full bg-tiffany text-white font-black py-5 rounded-lg shadow-xl shadow-tiffany/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3"
                  >
                    <CheckCircle size={20} />
                    <span className="text-[11px] uppercase tracking-[0.2em]">Activate Coupon</span>
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

export default Coupons;
