import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Trash2, Home, Briefcase, Check, X, Edit3, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const FloatingInput = ({ label, value, onChange, type = 'text', required = false, prefix = '' }) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value.length > 0;

  return (
    <div className="relative w-full group">
      <label 
        className={`absolute left-6 transition-all duration-300 pointer-events-none z-10 font-bold uppercase tracking-widest ${
          isActive 
            ? '-top-2.5 text-[9px] bg-background px-2 text-tiffany' 
            : 'top-4 text-[10px] text-foreground/30'
        }`}
      >
        {label} {required && '*'}
      </label>
      <div className={`flex items-center w-full bg-card border rounded-xl overflow-hidden transition-all ${
        isFocused ? 'border-tiffany ring-1 ring-tiffany/20 shadow-lg shadow-tiffany/5' : 'border-border'
      }`}>
        <AnimatePresence>
          {(prefix && isActive) && (
            <motion.span 
              initial={{ opacity: 0, x: -10, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 'auto' }}
              exit={{ opacity: 0, x: -10, width: 0 }}
              className="pl-6 pr-4 py-4 bg-background/50 text-sm font-bold text-tiffany border-r border-border/50 whitespace-nowrap overflow-hidden"
            >
              {prefix}
            </motion.span>
          )}
        </AnimatePresence>
        <input
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-transparent py-4 ${(prefix && isActive) ? 'px-4' : 'px-6'} text-sm outline-none font-semibold`}
        />
      </div>
    </div>
  );
};

const Addresses = () => {
  const { user, setShowLoginDrawer } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      setShowLoginDrawer(true);
    }
  }, [user, navigate, setShowLoginDrawer]);

  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('ravex_addresses');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        type: 'Home',
        name: 'Pro Gamer',
        mobile: '6266268901',
        flat: 'Flat 402',
        area: 'Elite Towers, Tech Park Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560103',
        isDefault: true
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('ravex_addresses', JSON.stringify(addresses));
  }, [addresses]);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    flat: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    type: 'Home'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      mobile: '',
      flat: '',
      area: '',
      city: '',
      state: '',
      pincode: '',
      type: 'Home'
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (addr) => {
    setFormData({
      name: addr.name,
      mobile: addr.mobile,
      flat: addr.flat,
      area: addr.area,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      type: addr.type
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setAddresses(addresses.map(addr => 
        addr.id === editingId ? { ...addr, ...formData } : addr
      ));
    } else {
      const newAddress = {
        id: Date.now(),
        ...formData,
        isDefault: addresses.length === 0
      };
      setAddresses([...addresses, newAddress]);
    }
    resetForm();
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const setAsDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  if (!user) return null;

  return (
    <div className="pt-32 pb-20 min-h-screen bg-background">
      <div className="container-tight">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-tiffany mb-4 transition-colors">
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <h1 className="text-4xl font-bold uppercase tracking-tighter mb-2">My Addresses</h1>
            <p className="text-foreground/40 text-sm font-medium uppercase tracking-widest">Manage your shipping destinations</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-3 bg-tiffany text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-tiffany/20"
          >
            <Plus size={18} /> Add New Address
          </motion.button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {addresses.map((addr) => (
              <motion.div
                key={addr.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`p-8 rounded-2xl border transition-all relative group flex flex-col h-full ${
                  addr.isDefault ? 'bg-card border-tiffany shadow-2xl shadow-tiffany/10' : 'bg-card/50 border-border hover:border-tiffany/30'
                }`}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    {addr.type === 'Home' ? (
                      <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
                        <Home size={18} />
                      </div>
                    ) : (
                      <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg">
                        <Briefcase size={18} />
                      </div>
                    )}
                    <span className="font-bold uppercase tracking-widest text-[10px]">{addr.type}</span>
                  </div>
                  
                  {addr.isDefault ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-tiffany/10 text-tiffany rounded-full border border-tiffany/20">
                      <Check size={12} />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Default</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setAsDefault(addr.id)}
                      className="text-[9px] font-bold uppercase tracking-widest text-foreground/20 hover:text-tiffany transition-colors"
                    >
                      Set as Default
                    </button>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{addr.name}</h3>
                    <p className="text-sm text-tiffany font-bold mt-1">+91 {addr.mobile}</p>
                  </div>
                  
                  <div className="text-sm text-foreground/60 leading-relaxed font-semibold">
                    <p>{addr.flat}</p>
                    <p>{addr.area}</p>
                    <p className="mt-1 text-foreground/80">{addr.city}, {addr.state} - {addr.pincode}</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleEdit(addr)}
                      className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 hover:text-tiffany transition-colors flex items-center gap-2 group/btn"
                    >
                      <Edit3 size={14} className="group-hover/btn:scale-110 transition-transform" /> Edit
                    </button>
                    <button 
                      onClick={() => deleteAddress(addr.id)}
                      className="text-[10px] font-bold uppercase tracking-widest text-red-500/40 hover:text-red-500 transition-colors flex items-center gap-2 group/btn"
                    >
                      <Trash2 size={14} className="group-hover/btn:scale-110 transition-transform" /> Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Address Modal/Form Overlay */}
        <AnimatePresence>
          {showForm && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={resetForm}
                className="fixed inset-0 bg-black/90 backdrop-blur-md z-[2000]"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-background border border-border rounded-[2.5rem] z-[2001] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                <div className="p-10 border-b border-border flex items-center justify-between bg-card/30">
                  <div>
                    <h2 className="text-3xl font-bold uppercase tracking-tighter">
                      {editingId ? "Update Address" : "New Address"}
                    </h2>
                    <p className="text-[10px] font-bold text-tiffany uppercase tracking-widest mt-2">
                      {editingId ? "Modify your shipping details" : "Step 1: Enter shipping details"}
                    </p>
                  </div>
                  <motion.button 
                    whileHover={{ rotate: 90 }}
                    onClick={resetForm} 
                    className="p-3 rounded-full bg-card border border-border text-foreground/40 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FloatingInput 
                      label="Full Name" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <FloatingInput 
                      label="Mobile Number" 
                      required
                      type="tel"
                      prefix="+91"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                    />
                  </div>

                  <FloatingInput 
                    label="Flat / House No. / Building" 
                    required
                    value={formData.flat}
                    onChange={(e) => setFormData({...formData, flat: e.target.value})}
                  />

                  <FloatingInput 
                    label="Area / Colony / Street" 
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FloatingInput 
                      label="City" 
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                    <FloatingInput 
                      label="State" 
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                    />
                    <FloatingInput 
                      label="Pincode" 
                      required
                      value={formData.pincode}
                      onChange={(e) => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-2">Address Type</label>
                    <div className="flex gap-4">
                      {['Home', 'Work'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormData({...formData, type: t})}
                          className={`flex-1 py-5 rounded-2xl font-bold uppercase tracking-widest text-[11px] border transition-all ${
                            formData.type === t 
                              ? 'bg-tiffany border-tiffany text-white shadow-xl shadow-tiffany/20' 
                              : 'bg-card border-border text-foreground/40 hover:border-tiffany/50'
                          }`}
                        >
                          {t === 'Home' ? <Home size={14} className="inline mr-2" /> : <Briefcase size={14} className="inline mr-2" />}
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-6 bg-white text-black rounded-[1.2rem] font-bold uppercase tracking-widest text-xs hover:bg-tiffany hover:text-white transition-all shadow-2xl mt-4"
                  >
                    {editingId ? "Update Address Information" : "Save Shipping Destination"}
                  </motion.button>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Addresses;
