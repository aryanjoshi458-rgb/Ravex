import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-10 rounded-3xl w-full max-w-md border-t-2 border-secondary"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black font-display uppercase tracking-tight mb-2">JOIN THE <span className="text-secondary">ELITE</span></h1>
          <p className="text-white/40 text-xs uppercase tracking-[0.2em]">Create your pilot profile</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/50 ml-1">Full Name</label>
            <input 
              type="text" 
              placeholder="John 'Neon' Doe"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-secondary transition-colors text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/50 ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="pilot@ravex.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-secondary transition-colors text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/50 ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-secondary transition-colors text-white"
            />
          </div>

          <button className="px-8 py-4 bg-secondary text-white font-black rounded-xl transition-all duration-300 hover:bg-secondary-glow hover:shadow-neon-blue active:scale-95 w-full uppercase tracking-widest">
            CREATE ACCOUNT
          </button>
        </form>

        <div className="mt-8 text-center text-xs uppercase tracking-widest text-white/30 font-bold">
          Already a member? <Link to="/login" className="text-secondary hover:text-secondary-glow">Login to Terminal</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
