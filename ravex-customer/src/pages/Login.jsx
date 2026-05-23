import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-10 rounded-3xl w-full max-w-md border-t-2 border-primary"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black font-display uppercase tracking-tight mb-2">WELCOME <span className="text-primary">BACK</span></h1>
          <p className="text-white/40 text-xs uppercase tracking-[0.2em]">Enter your credentials</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/50 ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="pilot@ravex.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-primary transition-colors text-white"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/50">Password</label>
              <a href="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-glow">Forgot?</a>
            </div>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-primary transition-colors text-white"
            />
          </div>

          <button className="btn-primary w-full h-14 uppercase tracking-widest font-black">
            AUTHENTICATE
          </button>
        </form>

        <div className="mt-8 text-center text-xs uppercase tracking-widest text-white/30 font-bold">
          Don't have an account? <Link to="/register" className="text-primary hover:text-primary-glow">Join the Elite</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
