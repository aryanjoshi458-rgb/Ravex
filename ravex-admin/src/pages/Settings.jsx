import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { 
  Store, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  Bell, 
  Globe, 
  Save, 
  Info,
  Smartphone,
  Mail,
  MapPin,
  RefreshCcw,
  Key,
  Server,
  Cloud,
  Database,
  Cpu,
  Lock,
  ChevronLeft,
  ChevronRight,
  Megaphone
} from 'lucide-react';
import { useRef } from 'react';

const Settings = () => {
  const { isDarkMode } = useOutletContext();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'RAVEX',
    supportEmail: 'support@ravex.com',
    supportPhone: '+91 93408 93038',
    storeAddress: 'RAVEX HQ, Tech Park, Raipur, CG',
    shippingFee: 0,
    freeShippingThreshold: 5000,
    gstPercentage: 18,
    enableCod: true,
    enableUpi: true,
    newArrivalDurationDays: 3,
    maintenanceMode: false,
    // API Keys
    razorpayKeyId: '',
    razorpayKeySecret: '',
    cloudinaryCloudName: '',
    cloudinaryApiKey: '',
    cloudinaryApiSecret: '',
    firebaseApiKey: '',
    firebaseProjectId: '',
    // Server & Domain
    backendUrl: 'http://localhost:3000',
    frontendUrl: 'http://localhost:5173',
    customDomain: 'ravex.com',
    // Notifications
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
    msg91ApiKey: '',
    announcementText: '',
    announcementEnabled: true
  });

  const tabsRef = useRef(null);

  const scrollToTab = (id) => {
    const tabElement = document.getElementById(`tab-${id}`);
    if (tabElement && tabsRef.current) {
      tabElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  useEffect(() => {
    scrollToTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:3000/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        alert("Settings updated successfully!");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payments', icon: CreditCard },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'server', label: 'Server & Domain', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'maintenance', label: 'Maintenance', icon: RefreshCcw },
  ];

  return (
    <div className="font-gaming pb-20 pt-8 max-w-[1600px] mx-auto px-4 md:px-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Settings Sidebar Tabs */}
        <div className={`w-full lg:w-72 flex-shrink-0 ${isDarkMode ? 'bg-[#1a2235] border-white/5' : 'bg-white border-gray-100 shadow-sm'} rounded-lg border p-2 space-y-1 sticky top-8`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full relative flex items-center gap-4 px-5 py-4 rounded-md text-[11px] font-black uppercase tracking-widest transition-all
                ${activeTab === tab.id 
                  ? 'text-tiffany' 
                  : `${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`
                }`}
            >
              <tab.icon size={18} className="relative z-10" />
              <span className="relative z-10">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="active-settings-tab"
                  className={`absolute inset-0 ${isDarkMode ? 'bg-tiffany/5' : 'bg-tiffany/5'} rounded-md border-l-2 border-tiffany`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 w-full">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`${isDarkMode ? 'bg-[#1a2235] border-white/5' : 'bg-white border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]'} rounded-lg border p-8 md:p-12`}
          >
            {activeTab === 'general' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 tracking-widest px-1">Store Name</label>
                    <div className="relative">
                      <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input 
                        type="text" 
                        value={settings.storeName}
                        onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                        className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-tiffany transition-all`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 tracking-widest px-1">Support Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input 
                        type="email" 
                        value={settings.supportEmail}
                        onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                        className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-tiffany transition-all`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 tracking-widest px-1">Support Phone</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input 
                        type="text" 
                        value={settings.supportPhone}
                        onChange={(e) => setSettings({...settings, supportPhone: e.target.value})}
                        className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-tiffany transition-all`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 tracking-widest px-1">GST Percentage</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-lg">%</span>
                      <input 
                        type="number" 
                        value={settings.gstPercentage}
                        onChange={(e) => setSettings({...settings, gstPercentage: parseInt(e.target.value)})}
                        className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-tiffany transition-all`}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Store Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-gray-300" size={18} />
                    <textarea 
                      rows="3"
                      value={settings.storeAddress}
                      onChange={(e) => setSettings({...settings, storeAddress: e.target.value})}
                      className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-tiffany transition-all resize-none`}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-8">
                <div className={`${isDarkMode ? 'bg-tiffany/10 border-tiffany/20' : 'bg-tiffany/5 border-tiffany/10'} rounded-lg p-6 flex items-start gap-4 border`}>
                  <Info className="text-tiffany mt-1" size={20} />
                  <div>
                    <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} uppercase tracking-tight`}>Shipping Rules</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Configure how delivery charges are calculated on checkout.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 tracking-widest px-1">Flat Shipping Fee (₹)</label>
                    <input 
                      type="number" 
                      value={settings.shippingFee}
                      onChange={(e) => setSettings({...settings, shippingFee: parseInt(e.target.value)})}
                      className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 px-5 text-sm font-bold outline-none focus:border-tiffany transition-all`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 tracking-widest px-1">Free Shipping Threshold (₹)</label>
                    <input 
                      type="number" 
                      value={settings.freeShippingThreshold}
                      onChange={(e) => setSettings({...settings, freeShippingThreshold: parseInt(e.target.value)})}
                      className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 px-5 text-sm font-bold outline-none focus:border-tiffany transition-all`}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6">
                <div className={`flex items-center justify-between p-6 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'} rounded-lg border`}>
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full ${isDarkMode ? 'bg-green-500/10 text-green-500' : 'bg-green-100 text-green-600'} flex items-center justify-center`}>
                      <Banknote size={20} />
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} uppercase tracking-tight`}>Cash On Delivery (COD)</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Accept cash payments at doorstep</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings.enableCod} onChange={(e) => setSettings({...settings, enableCod: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tiffany"></div>
                  </label>
                </div>

                <div className={`flex items-center justify-between p-6 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'} rounded-lg border`}>
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full ${isDarkMode ? 'bg-blue-500/10 text-blue-500' : 'bg-blue-100 text-blue-600'} flex items-center justify-center`}>
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} uppercase tracking-tight`}>UPI / QR Payments</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Instant digital payments (PhonePe, GPay)</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings.enableUpi} onChange={(e) => setSettings({...settings, enableUpi: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tiffany"></div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-10">
                {/* Payment Gateway */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-1">
                    <div className="h-8 w-8 rounded-lg bg-tiffany/10 flex items-center justify-center text-tiffany">
                      <Lock size={16} />
                    </div>
                    <h3 className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-800'} uppercase tracking-tight`}>Razorpay Integration</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Key ID</label>
                      <input 
                        type="text" 
                        value={settings.razorpayKeyId}
                        onChange={(e) => setSettings({...settings, razorpayKeyId: e.target.value})}
                        className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 px-5 text-sm font-bold outline-none focus:border-tiffany transition-all`}
                        placeholder="rzp_live_..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Key Secret</label>
                      <input 
                        type="password" 
                        value={settings.razorpayKeySecret}
                        onChange={(e) => setSettings({...settings, razorpayKeySecret: e.target.value})}
                        className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 px-5 text-sm font-bold outline-none focus:border-tiffany transition-all`}
                        placeholder="••••••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className={`h-[1px] ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`} />

                {/* Cloudinary */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-1">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Cloud size={16} />
                    </div>
                    <h3 className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-800'} uppercase tracking-tight`}>Cloudinary (Media Storage)</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Cloud Name</label>
                      <input 
                        type="text" 
                        value={settings.cloudinaryCloudName}
                        onChange={(e) => setSettings({...settings, cloudinaryCloudName: e.target.value})}
                        className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 px-5 text-sm font-bold outline-none focus:border-tiffany transition-all`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">API Key</label>
                      <input 
                        type="text" 
                        value={settings.cloudinaryApiKey}
                        onChange={(e) => setSettings({...settings, cloudinaryApiKey: e.target.value})}
                        className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 px-5 text-sm font-bold outline-none focus:border-tiffany transition-all`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">API Secret</label>
                      <input 
                        type="password" 
                        value={settings.cloudinaryApiSecret}
                        onChange={(e) => setSettings({...settings, cloudinaryApiSecret: e.target.value})}
                        className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 px-5 text-sm font-bold outline-none focus:border-tiffany transition-all`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'server' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Backend API URL</label>
                    <div className="relative">
                      <Server className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input 
                        type="text" 
                        value={settings.backendUrl}
                        onChange={(e) => setSettings({...settings, backendUrl: e.target.value})}
                        className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-tiffany transition-all`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Frontend URL</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input 
                        type="text" 
                        value={settings.frontendUrl}
                        onChange={(e) => setSettings({...settings, frontendUrl: e.target.value})}
                        className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-tiffany transition-all`}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Custom Domain Name</label>
                  <div className="relative">
                    <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="text" 
                      value={settings.customDomain}
                      onChange={(e) => setSettings({...settings, customDomain: e.target.value})}
                      className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-tiffany transition-all`}
                      placeholder="www.yourstore.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'announcements' && (
              <div className="space-y-8">
                <div className={`${isDarkMode ? 'bg-tiffany/10 border-tiffany/20' : 'bg-tiffany/5 border-tiffany/10'} rounded-lg p-6 flex items-start gap-4 border`}>
                  <Megaphone className="text-tiffany mt-1" size={20} />
                  <div>
                    <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} uppercase tracking-tight`}>Store Announcements</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Change the top-bar message on your storefront to announce sales or updates.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className={`flex items-center justify-between p-6 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'} rounded-lg border`}>
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full ${settings.announcementEnabled ? 'bg-tiffany/10 text-tiffany' : 'bg-gray-100 text-gray-400'} flex items-center justify-center`}>
                        <Megaphone size={20} />
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} uppercase tracking-tight`}>Enable Announcement Bar</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">Show or hide the marquee message on the website</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={settings.announcementEnabled} onChange={(e) => setSettings({...settings, announcementEnabled: e.target.checked})} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tiffany"></div>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Announcement Message</label>
                    <textarea 
                      rows="3"
                      disabled={!settings.announcementEnabled}
                      value={settings.announcementText}
                      onChange={(e) => setSettings({...settings, announcementText: e.target.value})}
                      className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-100 text-gray-800'} rounded-lg py-4 px-5 text-sm font-bold outline-none focus:border-tiffany transition-all resize-none disabled:opacity-50`}
                      placeholder="e.g. FLASH SALE: 50% OFF ON ALL KEYBOARDS!"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'maintenance' && (
              <div className="text-center py-10 space-y-6">
                <div className={`h-24 w-24 ${isDarkMode ? 'bg-red-500/10 text-red-500' : 'bg-red-50 text-red-500'} rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-500/10`}>
                  <RefreshCcw size={40} className={settings.maintenanceMode ? 'animate-spin' : ''} />
                </div>
                <div className="max-w-xs mx-auto">
                  <h3 className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-gray-800'} uppercase tracking-tight`}>Maintenance Mode</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase mt-2 leading-relaxed">
                    When enabled, customers will see a "Site Under Construction" message and won't be able to place orders.
                  </p>
                </div>
                <button 
                  onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                  className={`py-4 px-10 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    settings.maintenanceMode 
                      ? 'bg-red-500 text-white shadow-xl shadow-red-500/20' 
                      : `${isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`
                  }`}
                >
                  {settings.maintenanceMode ? 'Disable Maintenance' : 'Enable Maintenance'}
                </button>
              </div>
            )}

            {/* Bottom Save Button Area */}
            <div className={`mt-12 pt-8 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-50'} flex justify-end`}>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="bg-tiffany text-white font-black px-10 py-4 rounded-lg flex items-center gap-3 shadow-xl shadow-tiffany/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <RefreshCcw size={18} />
                  </motion.div>
                ) : (
                  <Save size={18} />
                )}
                <span className="text-[11px] tracking-widest">Save Settings</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Internal icon for payment section
const Banknote = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="12" x="2" y="6" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

export default Settings;
