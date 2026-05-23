import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Search, ShoppingBag, Eye, Trash2, CheckCircle, Clock, Truck, Package, ChevronLeft, ChevronRight, X } from 'lucide-react';
import gsap from 'gsap';

const TimelineStep = ({ step, isLast, index, isDarkMode }) => {
  const lineRef = useRef(null);
  const iconRef = useRef(null);

  useLayoutEffect(() => {
    if (step.completed) {
      gsap.fromTo(lineRef.current, 
        { height: 0 }, 
        { height: "100%", duration: 0.8, ease: "power2.out", delay: index * 0.2 }
      );
      gsap.fromTo(iconRef.current,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.7)", delay: index * 0.2 }
      );
    }
  }, [step.completed]);

  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center shrink-0">
        <div 
          ref={iconRef}
          className={`h-6 w-6 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${step.completed ? 'bg-tiffany border-tiffany text-white shadow-[0_0_15px_rgba(20,255,236,0.3)]' : `${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'} text-gray-200`}`}
        >
          {step.completed ? <CheckCircle size={14} /> : <Clock size={14} />}
        </div>
        {!isLast && (
          <div className={`w-0.5 h-10 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'} relative`}>
            <div 
              ref={lineRef}
              className="absolute top-0 left-0 w-full bg-tiffany/50 transition-colors"
            />
          </div>
        )}
      </div>
      <div className="pt-0.5">
        <p className={`text-[11px] font-black tracking-widest transition-colors duration-500 ${step.completed ? (isDarkMode ? 'text-white' : 'text-gray-800') : (isDarkMode ? 'text-gray-600' : 'text-gray-300')}`}>{step.status}</p>
        <p className="text-[9px] text-gray-400 font-bold">{step.date}</p>
      </div>
    </div>
  );
};

const Orders = () => {
  const { isDarkMode } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/orders');
      const data = await response.json();
      const sortedData = Array.isArray(data) ? [...data].reverse() : [];
      setOrders(sortedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const updatedTimeline = [...order.timeline];
      // Update timeline based on status
      if (newStatus === 'Shipped') {
        updatedTimeline[2] = { ...updatedTimeline[2], completed: true, date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) };
      } else if (newStatus === 'Delivered') {
        updatedTimeline[2] = { ...updatedTimeline[2], completed: true };
        updatedTimeline[3] = { ...updatedTimeline[3], completed: true, date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) };
      }

      const response = await fetch(`http://localhost:3000/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, timeline: updatedTimeline })
      });

      if (response.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, timeline: updatedTimeline } : o));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus, timeline: updatedTimeline });
        }
        
        // GSAP Success Animation
        gsap.to(".status-btn-" + newStatus, {
          scale: 1.05,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power2.out"
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order record?")) return;
    try {
      const res = await fetch(`http://localhost:3000/orders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== id));
        if (selectedOrder?.id === id) setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const filteredOrders = orders.filter(o => 
    (o.orderId && o.orderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (o.id && o.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (o.userMobile && o.userMobile.includes(searchTerm)) ||
    (o.address && o.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-600';
      case 'shipped': return 'bg-blue-100 text-blue-600';
      case 'processing': return 'bg-yellow-100 text-yellow-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-10 font-gaming">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-[28px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>Order Management</h1>
          <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-600'} font-semibold mt-1`}>Track fulfillment and manage customer purchases.</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 ${isDarkMode ? 'bg-[#1a2235] border-white/5' : 'bg-white border-gray-200'} rounded-lg shadow-sm border`}>
          <div className="w-2 h-2 bg-tiffany rounded-full animate-pulse" />
          <span className="text-[11px] font-black text-gray-400 tracking-widest">Live Orders:</span>
          <span className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{orders.length}</span>
        </div>
      </div>

      <div className={`${isDarkMode ? 'bg-[#1a2235] border-white/5' : 'bg-white border-gray-200'} rounded-lg border shadow-sm overflow-hidden`}>
        <div className={`p-8 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="relative max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search Order ID, Mobile, Address..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50/50 border-gray-200 text-gray-800'} rounded-lg text-[13px] font-bold outline-none focus:border-tiffany transition-all`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50/50 border-gray-100'} border-b`}>
                <th className={`px-8 py-5 text-[10px] font-black ${isDarkMode ? 'text-gray-300' : 'text-gray-400'} tracking-widest`}>Order ID</th>
                <th className={`px-8 py-5 text-[10px] font-black ${isDarkMode ? 'text-gray-300' : 'text-gray-400'} tracking-widest`}>Customer</th>
                <th className={`px-8 py-5 text-[10px] font-black ${isDarkMode ? 'text-gray-300' : 'text-gray-400'} tracking-widest`}>Total</th>
                <th className={`px-8 py-5 text-[10px] font-black ${isDarkMode ? 'text-gray-300' : 'text-gray-400'} tracking-widest`}>Status</th>
                <th className={`px-8 py-5 text-[10px] font-black ${isDarkMode ? 'text-gray-300' : 'text-gray-400'} tracking-widest`}>Date</th>
                <th className={`px-8 py-5 text-[10px] font-black ${isDarkMode ? 'text-gray-300' : 'text-gray-400'} tracking-widest text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentItems.map((order) => (
                <tr key={order.id} className={`${isDarkMode ? 'hover:bg-white/[0.02] border-white/5' : 'hover:bg-gray-50/50 border-gray-50'} border-b last:border-0 transition-colors group`}>
                  <td className="px-8 py-6">
                    <span className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>#{order.orderId || order.id}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{order.customerName || 'Anonymous'}</p>
                    <p className={`text-[10px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} tracking-tight`}>+91 {order.userMobile}</p>
                    <p className="text-[9px] text-gray-400 font-bold truncate max-w-[180px] mt-1">{order.address}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-tiffany">{order.total}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                   <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className={`text-[11px] font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} whitespace-nowrap`}>{order.date.split(' | ')[0]}</span>
                      {order.date.includes(' | ') && (
                        <span className={`text-[9px] font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5`}>{order.date.split(' | ')[1]}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2.5 text-gray-400 hover:text-tiffany hover:bg-tiffany/5 rounded-lg transition-all"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => deleteOrder(order.id)}
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-8 border-t border-gray-100 flex justify-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-3 rounded-xl border border-gray-100 disabled:opacity-30 hover:border-tiffany transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center px-6 bg-gray-50 rounded-xl text-xs font-black">
              {currentPage} / {totalPages}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-3 rounded-xl border border-gray-100 disabled:opacity-30 hover:border-tiffany transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative w-[95%] max-w-6xl ${isDarkMode ? 'bg-[#1a2235] border-white/5' : 'bg-white border-gray-100'} rounded shadow-[0_30px_60px_rgba(0,0,0,0.12)] z-[101] border max-h-[90vh] flex flex-col`}
            >
              <div className="overflow-y-auto custom-scrollbar p-10">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <span className="px-3 py-1 bg-tiffany/10 text-tiffany rounded-md text-[10px] font-black tracking-[0.3em] mb-4 inline-block border border-tiffany/20">Order Details</span>
                    <h2 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tighter`}>#{selectedOrder.orderId || selectedOrder.id}</h2>
                    <p className="text-[11px] text-gray-400 font-bold mt-1 tracking-widest">Placed on {selectedOrder.date}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className={`p-2.5 ${isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/5' : 'bg-gray-50 hover:bg-gray-100 border-gray-100'} border rounded-lg transition-all text-gray-400`}>
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  {/* Left Column: Order Summary */}
                  <div className="lg:col-span-7 space-y-12">
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-6">Items Summary</h3>
                      <div className="space-y-4">
                        {selectedOrder.items.map((item, i) => (
                          <div key={i} className={`flex items-center gap-6 p-5 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'} rounded border hover:border-tiffany/30 transition-all group shadow-sm`}>
                            <div className={`h-20 w-20 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'} rounded border p-3 shrink-0 overflow-hidden`}>
                              <img src={item.image} alt="" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-widest truncate`}>{item.name}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.qty} Unit</span>
                                <span className={`h-1 w-1 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
                                <span className="text-sm font-black text-tiffany">{item.price}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className={`p-8 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50/30 border-gray-100'} rounded border`}>
                        <h4 className="text-[9px] font-black tracking-[0.3em] text-gray-300 mb-4">Delivery Address</h4>
                        <p className={`text-[11px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed tracking-wider`}>{selectedOrder.address}</p>
                      </div>
                      <div className={`p-8 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50/30 border-gray-100'} rounded border relative overflow-hidden group`}>
                        <h4 className="text-[9px] font-black tracking-[0.3em] text-gray-300 mb-4">Payment Info</h4>
                        <p className="text-[11px] font-black text-gray-400 mb-2 tracking-widest">{selectedOrder.paymentMethod}</p>
                        <p className="text-2xl font-black text-tiffany tracking-tighter">{selectedOrder.total}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Fulfillment & Timeline */}
                  <div className="lg:col-span-5 space-y-12">
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Fulfillment Status</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                          <button 
                            key={status}
                            onClick={() => updateOrderStatus(selectedOrder.id, status)}
                            className={`w-full py-4 px-4 rounded text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 status-btn-${status} ${
                              selectedOrder.status === status 
                                ? 'bg-tiffany text-black shadow-lg shadow-tiffany/20' 
                                : `${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'} border text-gray-400 hover:border-tiffany/50 hover:text-tiffany`
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-8">
                      <h4 className="text-[9px] font-black tracking-[0.4em] text-gray-300">Live Timeline</h4>
                      <div className="space-y-8 text-gray-600">
                        {selectedOrder.timeline.map((step, i) => (
                          <TimelineStep 
                            key={i} 
                            step={step} 
                            index={i} 
                            isLast={i === selectedOrder.timeline.length - 1} 
                            isDarkMode={isDarkMode}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
