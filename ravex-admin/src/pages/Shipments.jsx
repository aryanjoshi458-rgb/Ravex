import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Truck, Package, CheckCircle, Clock, Search, ExternalLink, Play, Pause, Zap } from 'lucide-react';

const Shipments = () => {
  const { isDarkMode } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSimulatorActive, setIsSimulatorActive] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:3000/orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data.sort((a, b) => b.id - a.id) : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // SIMULATOR LOGIC
  useEffect(() => {
    let timer;
    if (isSimulatorActive) {
      timer = setInterval(async () => {
        // Find one order that can be progressed
        const orderToUpdate = orders.find(o => o.status === 'Processing' || o.status === 'Shipped');
        if (orderToUpdate) {
          const nextStatus = orderToUpdate.status === 'Processing' ? 'Shipped' : 'Delivered';
          const nextTimeline = [...orderToUpdate.timeline];
          
          // Find the next incomplete step
          const stepIndex = nextTimeline.findIndex(t => !t.completed);
          if (stepIndex !== -1) {
            nextTimeline[stepIndex] = {
              ...nextTimeline[stepIndex],
              completed: true,
              date: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
            };
          }

          try {
            await fetch(`http://localhost:3000/orders/${orderToUpdate.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                status: nextStatus,
                timeline: nextTimeline
              })
            });
            fetchOrders();
          } catch (err) {
            console.error("Simulator update failed:", err);
          }
        }
      }, 10000); // Progress one order every 10 seconds in simulator mode
    }
    return () => clearInterval(timer);
  }, [isSimulatorActive, orders]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Shipped': return 'text-tiffany bg-tiffany/10 border-tiffany/20';
      default: return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    }
  };

  const filteredOrders = orders.filter(o => 
    o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.userMobile.includes(searchTerm)
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-3xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Logistics Manager</h1>
          <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-600'} font-bold mt-1 text-[10px] tracking-widest`}>Real-time delivery & shipment tracking</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#1a2235] border-white/10' : 'bg-white border-gray-100'} flex items-center gap-6 shadow-xl`}>
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isSimulatorActive ? 'bg-green-500 text-white animate-pulse' : 'bg-gray-500/20 text-gray-500'}`}>
              <Zap size={20} fill={isSimulatorActive ? "currentColor" : "none"} />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-gray-400">Logistics Simulator</p>
              <p className={`text-xs font-black ${isSimulatorActive ? 'text-green-500' : 'text-gray-500'}`}>{isSimulatorActive ? 'Active & Auto-Updating' : 'Paused'}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSimulatorActive(!isSimulatorActive)}
            className={`px-6 py-3 rounded-xl font-black text-[10px] tracking-widest transition-all ${isSimulatorActive ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-tiffany text-white shadow-lg shadow-tiffany/20'}`}
          >
            {isSimulatorActive ? 'Stop Auto-Flow' : 'Start Auto-Flow'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Shipments", value: orders.length, icon: Package, color: "text-blue-500" },
          { label: "In Transit", value: orders.filter(o => o.status === 'Shipped').length, icon: Truck, color: "text-tiffany" },
          { label: "Delivered", value: orders.filter(o => o.status === 'Delivered').length, icon: CheckCircle, color: "text-green-500" },
          { label: "Pending", value: orders.filter(o => o.status === 'Processing').length, icon: Clock, color: "text-orange-500" },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1a2235] border-white/5' : 'bg-white border-gray-100'} shadow-sm`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-foreground/[0.03] ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-[10px] font-black tracking-widest text-gray-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Shipments List */}
      <div className={`rounded-3xl border ${isDarkMode ? 'bg-[#1a2235] border-white/5' : 'bg-white border-gray-100'} overflow-hidden`}>
        <div className="p-8 border-b border-border flex justify-between items-center bg-foreground/[0.01]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by Tracking ID or Mobile..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl text-xs font-bold outline-none border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-tiffany' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-tiffany'}`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`text-left border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                <th className="px-8 py-6 text-[10px] font-black tracking-widest text-gray-400">Order ID</th>
                <th className="px-8 py-6 text-[10px] font-black tracking-widest text-gray-400">Customer</th>
                <th className="px-8 py-6 text-[10px] font-black tracking-widest text-gray-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black tracking-widest text-gray-400">Tracking Info</th>
                <th className="px-8 py-6 text-[10px] font-black tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-50'}`}>
              <AnimatePresence>
                {filteredOrders.map((order) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`${isDarkMode ? 'hover:bg-white/[0.01]' : 'hover:bg-gray-50/50'} transition-colors`}
                  >
                    <td className="px-8 py-6">
                      <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>#{order.orderId}</p>
                      <p className="text-[10px] font-bold text-gray-400 mt-1">{order.date.split('|')[0]}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>+91 {order.userMobile}</p>
                      <p className="text-[9px] text-gray-400 font-medium tracking-tight line-clamp-1">{order.address}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <p className={`text-[10px] font-black tracking-tighter ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {order.paymentMethod}
                        </p>
                        <p className="text-[9px] font-bold text-tiffany tracking-widest">
                          Partner: Ravex Express
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-colors text-gray-400`}>
                          <ExternalLink size={14} />
                        </button>
                        {order.status !== 'Delivered' && (
                          <button 
                            onClick={async () => {
                              const nextStatus = order.status === 'Processing' ? 'Shipped' : 'Delivered';
                              const nextTimeline = [...order.timeline];
                              const stepIndex = nextTimeline.findIndex(t => !t.completed);
                              if (stepIndex !== -1) {
                                nextTimeline[stepIndex] = {
                                  ...nextTimeline[stepIndex],
                                  completed: true,
                                  date: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                                };
                              }
                              await fetch(`http://localhost:3000/orders/${order.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: nextStatus, timeline: nextTimeline })
                              });
                              fetchOrders();
                            }}
                            className="px-4 py-2 bg-tiffany text-white text-[10px] font-black tracking-widest rounded-lg shadow-lg shadow-tiffany/20 hover:scale-105 active:scale-95 transition-all"
                          >
                            Update
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Shipments;
