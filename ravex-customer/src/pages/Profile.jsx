import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Package, Settings, LogOut, Shield } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen pt-40 pb-20">
      <div className="container px-6 mx-auto max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass p-6 rounded-2xl text-center">
              <div className="h-24 w-24 rounded-full bg-primary/10 border-2 border-primary mx-auto mb-4 flex items-center justify-center text-primary">
                <User size={48} />
              </div>
              <h2 className="text-xl font-black font-display uppercase tracking-tight">GUEST PILOT</h2>
              <p className="text-white/30 text-[10px] uppercase tracking-widest mt-1">Level 1 Elite Member</p>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              {[
                { icon: User, name: "Profile Details" },
                { icon: Package, name: "Order History" },
                { icon: Shield, name: "Security" },
                { icon: Settings, name: "Preferences" }
              ].map((item, i) => (
                <button 
                  key={i}
                  className="w-full flex items-center space-x-4 p-4 text-sm font-bold uppercase tracking-widest text-white/50 hover:text-primary hover:bg-white/5 transition-all"
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </button>
              ))}
              <button 
                onClick={logout}
                className="w-full flex items-center space-x-4 p-4 text-sm font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all border-t border-white/5"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="glass p-8 rounded-3xl border-l-4 border-tiffany">
              <h3 className="text-2xl font-black font-display uppercase tracking-wider mb-8">DASHBOARD OVERVIEW</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-tiffany/10 p-6 rounded-2xl border border-tiffany/20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-tiffany mb-2">Ravex Points</p>
                  <p className="text-3xl font-black font-display text-white">2,450</p>
                  <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                    <div className="w-[65%] h-full bg-tiffany" />
                  </div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mt-2">550 pts until Level 2</p>
                </div>
                {[
                  { label: "Total Orders", value: "0" },
                  { label: "Member Since", value: "MAY 2026" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">{stat.label}</p>
                    <p className="text-2xl font-black font-display text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-8 rounded-3xl">
              <h3 className="text-2xl font-black font-display uppercase tracking-wider mb-8">RECENT ORDERS</h3>
              <div className="space-y-6">
                {[
                  { id: "RX-9921", date: "02 MAY 2026", items: "Ravex Phantom K1", status: "Delivered", total: "₹8,999" },
                  { id: "RX-8842", date: "28 APR 2026", items: "Ravex Viper M1 + Speed Pad", status: "Shipped", total: "₹5,498" }
                ].map((order, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-tiffany/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-6">
                      <div className="h-12 w-12 rounded-xl bg-tiffany/10 flex items-center justify-center text-tiffany">
                        <Package size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Order #{order.id}</p>
                        <p className="text-sm font-bold uppercase">{order.items}</p>
                      </div>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{order.date}</p>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' : 'bg-tiffany/20 text-tiffany'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-right min-w-[100px]">
                      <p className="text-xl font-black font-display text-white">{order.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
