import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ChevronRight, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('isAdminAuthenticated', 'true');
    navigate('/');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-gaming transition-colors duration-500 ${darkMode ? 'bg-[#0f172a]' : 'bg-white'}`}>
      
      {/* Theme Switcher */}
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-8 right-8 p-3 rounded-2xl transition-all duration-500 shadow-lg ${
          darkMode ? 'bg-slate-800 text-yellow-400 shadow-black/20' : 'bg-gray-50 text-slate-600 shadow-gray-200'
        } hover:scale-110 active:scale-95`}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="max-w-[440px] w-full relative z-10"
      >
        <div className={`rounded-[2.5rem] py-12 px-10 transition-all duration-500 border shadow-2xl ${
          darkMode 
          ? 'bg-slate-900 border-slate-800 shadow-black/40 text-white' 
          : 'bg-white border-gray-100 shadow-gray-200/50 text-gray-800'
        }`}>
          {/* Header Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="mb-6">
              <Logo className="h-10" isDark={darkMode} />
            </div>
            
            <div className="text-center">
              <h1 className={`text-2xl font-bold tracking-tight transition-colors duration-500 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Admin Portal
              </h1>
              <p className={`text-sm mt-2 font-medium italic transition-colors duration-500 ${darkMode ? 'text-slate-400' : 'text-gray-400'}`}>
                Please sign in to manage your store
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className={`text-[11px] font-bold uppercase tracking-widest ml-1 transition-colors duration-500 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Email Address
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ravex.com"
                  className={`w-full border rounded-2xl py-4 px-12 text-sm font-semibold outline-none focus:border-tiffany transition-all duration-500 ${
                    darkMode 
                    ? 'bg-[#0f172a] border-slate-800 text-white placeholder:text-slate-700 focus:bg-black' 
                    : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:bg-white'
                  }`}
                />
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-500 ${darkMode ? 'text-slate-600' : 'text-gray-400'}`} size={18} />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className={`text-[11px] font-bold uppercase tracking-widest ml-1 transition-colors duration-500 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Password
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full border rounded-2xl py-4 px-12 text-sm font-semibold outline-none focus:border-tiffany transition-all duration-500 ${
                    darkMode 
                    ? 'bg-[#0f172a] border-slate-800 text-white placeholder:text-slate-700 focus:bg-black' 
                    : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:bg-white'
                  }`}
                />
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-500 ${darkMode ? 'text-slate-600' : 'text-gray-400'}`} size={18} />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-tiffany text-white font-bold py-5 rounded-2xl shadow-xl shadow-tiffany/20 flex items-center justify-center gap-3 hover:bg-tiffany hover:scale-[1.01] active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
            >
              Sign In to Dashboard
              <ChevronRight size={18} />
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-12 text-center">
            <p className={`text-[9px] font-bold uppercase tracking-[0.3em] transition-colors duration-500 ${darkMode ? 'text-slate-600' : 'text-gray-400'}`}>
              Authorized Personnel Only
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
