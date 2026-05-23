import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings,
  LogOut,
  User,
  Mail,
  Shield,
  Menu as MenuIcon,
  Star,
  Sun,
  Moon,
  Tag,
  Zap,
  Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import Loader from './Loader';

import { ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ isCollapsed, onLogout, toggleSidebar, transition }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Orders', path: '/orders', icon: ShoppingBag },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Coupons', path: '/coupons', icon: Tag },
    { name: 'Banners', path: '/banners', icon: Zap },
    { name: 'Shipments', path: '/shipments', icon: Truck },
    { name: 'Reviews', path: '/reviews', icon: Star },
    { name: 'Settings', path: '/settings', icon: Settings, animate: 'rotate' },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={transition}
      className="fixed inset-y-0 left-0 bg-[#0f172a] z-50 flex flex-col py-6 overflow-visible"
    >
      {/* Sidebar Toggle Button - Image Style */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-12 w-6 h-6 bg-tiffany text-white rounded-lg flex items-center justify-center shadow-lg shadow-tiffany/40 z-50 hover:scale-110 active:scale-90 transition-all"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Section */}
      <div className="mb-10 flex justify-center">
        <Link to="/">
          <Logo variant="white" iconOnly={isCollapsed} />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pr-2 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex items-center gap-4 h-12 rounded-lg text-sm font-bold transition-all whitespace-nowrap overflow-hidden group ${
                isActive 
                  ? 'bg-tiffany text-white shadow-lg shadow-tiffany/20' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              } ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
            >
              <motion.div 
                className="flex-shrink-0"
                whileHover={item.animate === 'rotate' ? { rotate: 90 } : { scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <item.icon size={20} />
              </motion.div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 pt-6 border-t border-white/5">
        <button 
          onClick={onLogout}
          className={`flex items-center gap-4 h-12 w-full text-gray-300 hover:bg-red-500/10 hover:text-red-500 active:scale-95 transition-all rounded-lg overflow-hidden whitespace-nowrap group ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
        >
          <motion.div 
            className="flex-shrink-0 transition-colors"
            whileHover={{ x: -3, scale: 1.1 }}
          >
            <LogOut size={20} />
          </motion.div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-bold"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('ravex_sidebar_collapsed');
    return saved === 'true';
  });
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('ravex_admin_dark_mode');
    return saved === 'true';
  });
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  useEffect(() => {
    localStorage.setItem('ravex_sidebar_collapsed', isCollapsed);
  }, [isCollapsed]);

  useEffect(() => {
    localStorage.setItem('ravex_admin_dark_mode', isDarkMode);
  }, [isDarkMode]);

  const springTransition = { duration: 0.5, ease: [0.4, 0, 0.2, 1] };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex overflow-x-hidden font-gaming">
      {/* <AnimatePresence>
        {isInitialLoading && (
          <Loader onComplete={() => setIsInitialLoading(false)} />
        )}
      </AnimatePresence> */}

      <Sidebar 
        isCollapsed={isCollapsed} 
        onLogout={handleLogout} 
        toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
        transition={springTransition}
      />
      
      <motion.div 
        animate={{ paddingLeft: isCollapsed ? 80 : 260 }}
        transition={springTransition}
        className={`flex-1 flex flex-col min-h-screen ${isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-[#f8fafc] text-gray-800'}`}
      >
        {/* Header */}
        <header className={`h-16 ${isDarkMode ? 'bg-[#1a2235] border-b border-white/5' : 'bg-white border-b border-gray-100'} flex items-center justify-between px-6 relative z-40`}>
          <div className="flex items-center gap-4">
            <h2 className={`text-sm font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Admin Portal</h2>
          </div>
          
          <div className="relative" ref={dropdownRef}>
            <div 
              className="flex items-center gap-3 cursor-pointer select-none group"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <div className="w-9 h-9 rounded-full bg-tiffany/10 flex items-center justify-center text-tiffany font-bold border border-tiffany/20 group-hover:bg-tiffany/20 transition-all font-brand">
                A
              </div>
              <div className="text-left hidden sm:block">
                <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} leading-tight`}>Admin User</p>
                <p className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} font-bold`}>Store Manager</p>
              </div>
            </div>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute right-0 top-full mt-4 w-72 ${isDarkMode ? 'bg-[#1a2235] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-gray-200/50'} border rounded-lg shadow-2xl z-[100] overflow-hidden`}
                >
                  <div className={`p-6 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}>
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Administrator</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>admin@ravex.com</p>
                  </div>

                  <div className="p-2">
                    {[
                      { label: 'My Profile', icon: User, path: '/profile' },
                      { label: 'Inbox', icon: Mail, path: '/inbox' },
                      { label: 'Security', icon: Shield, path: '/security' },
                    ].map((item) => (
                      <button 
                        key={item.label} 
                        onClick={() => { navigate(item.path); setIsUserMenuOpen(false); }}
                        className={`w-full flex items-center gap-4 px-4 py-3 text-sm font-bold ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-800 hover:bg-gray-50'} rounded-lg transition-colors text-left`}
                      >
                        <item.icon size={18} className="text-gray-500" />
                        {item.label}
                      </button>
                    ))}
                    
                    {/* Appearance Toggle */}
                    <div className={`mt-2 pt-2 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}>
                      <p className="px-4 py-2 text-[10px] font-black text-gray-400 tracking-widest">Appearance</p>
                      <button 
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-800 hover:bg-gray-50'} rounded-lg transition-colors`}
                      >
                        <div className="flex items-center gap-4">
                          {isDarkMode ? <Moon size={18} className="text-tiffany" /> : <Sun size={18} className="text-orange-400" />}
                          <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-tiffany' : 'bg-gray-200'}`}>
                          <motion.div 
                            animate={{ x: isDarkMode ? 22 : 2 }}
                            className="absolute top-1 w-3 h-3 bg-white rounded-full" 
                          />
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className={`p-4 ${isDarkMode ? 'bg-white/[0.02]' : 'bg-gray-50/50'}`}>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/10 text-red-500 rounded-lg text-sm font-bold hover:bg-red-500/20 transition-colors"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <main className="p-12 flex-1 w-11/12 max-w-[1600px] mx-auto">
          <Outlet context={{ isDarkMode }} />
        </main>
      </motion.div>
    </div>
  );
};

export default Layout;
