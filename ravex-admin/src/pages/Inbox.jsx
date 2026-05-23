import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Mail, Search, Trash2, CheckCircle, Clock, AlertCircle, Shield } from 'lucide-react';

const messagesData = [
  { id: 1, title: 'New Order Received', sender: 'System Store', time: '5m ago', type: 'success', preview: 'Order #ORD-2045 has been successfully placed and is ready for processing.', isUnread: true },
  { id: 2, title: 'Low Stock Alert: Ravex Viper M1', sender: 'Inventory Bot', time: '1h ago', type: 'warning', preview: 'The stock for Ravex Viper M1 is below 10 units. Please restock soon.', isUnread: true },
  { id: 3, title: 'Customer Review Submitted', sender: 'Rahul Sharma', time: '4h ago', type: 'info', preview: 'A new 5-star review has been submitted for Phantom K1 Keyboard.', isUnread: false },
  { id: 4, title: 'Monthly Sales Report', sender: 'Analytics Bot', time: 'Yesterday', type: 'info', preview: 'Your sales report for the month of August is now available for review.', isUnread: false },
  { id: 5, title: 'Security Alert: New Login', sender: 'Security System', time: '2 days ago', type: 'danger', preview: 'A new login was detected from a Chrome browser on Windows.', isUnread: false },
];

const Inbox = () => {
  const { isDarkMode } = useOutletContext();
  const [activeTab, setActiveTab] = useState('All');

  return (
    <div className="max-w-5xl space-y-8 font-gaming">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>Inbox</h1>
          <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'} font-medium mt-1`}>Stay updated with store notifications and system alerts.</p>
        </div>
        <div className={`flex gap-2 ${isDarkMode ? 'bg-[#1a2235] border-white/5' : 'bg-white border-gray-100'} p-1.5 rounded-lg border shadow-sm`}>
          {['All', 'Unread', 'Archive'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-tiffany text-white shadow-lg shadow-tiffany/20' : 'text-gray-400 hover:text-tiffany'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className={`${isDarkMode ? 'bg-[#1a2235] border-white/5' : 'bg-white border-gray-100'} rounded-lg border shadow-sm overflow-hidden`}>
        <div className={`p-6 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-50'} flex items-center justify-between`}>
          <div className="relative w-full max-w-sm">
            <input 
              type="text" 
              placeholder="Search messages..."
              className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-700'} rounded-lg py-3 px-12 text-sm outline-none focus:border-tiffany transition-all font-bold`}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
          </div>
          <button className="text-gray-400 hover:text-red-500 p-2 transition-all">
            <Trash2 size={20} />
          </button>
        </div>

        <div className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-50'}`}>
          <AnimatePresence>
            {messagesData.map((msg, idx) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-6 flex items-start gap-4 ${isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50/50'} transition-all cursor-pointer group ${msg.isUnread ? (isDarkMode ? 'bg-tiffany/5' : 'bg-tiffany/[0.02]') : ''}`}
              >
                <div className={`mt-1 p-2.5 rounded-lg ${
                  msg.type === 'success' ? (isDarkMode ? 'bg-green-500/10 text-green-500' : 'bg-green-50 text-green-500') :
                  msg.type === 'warning' ? (isDarkMode ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-50 text-orange-500') :
                  msg.type === 'danger' ? (isDarkMode ? 'bg-red-500/10 text-red-500' : 'bg-red-50 text-red-500') :
                  (isDarkMode ? 'bg-blue-500/10 text-blue-500' : 'bg-blue-50 text-blue-500')
                }`}>
                  {msg.type === 'success' ? <CheckCircle size={18} /> : 
                   msg.type === 'warning' ? <AlertCircle size={18} /> : 
                   msg.type === 'danger' ? <Shield size={18} /> : 
                   <Mail size={18} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`text-sm font-bold ${msg.isUnread ? (isDarkMode ? 'text-white' : 'text-gray-800') : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}>
                      {msg.title}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                      <Clock size={12} />
                      {msg.time}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 font-medium mb-1">{msg.sender}</p>
                  <p className="text-xs text-gray-500 line-clamp-1 leading-relaxed">{msg.preview}</p>
                </div>

                {msg.isUnread && (
                  <div className="w-2 h-2 bg-tiffany rounded-full mt-2 self-start ring-4 ring-tiffany/5" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
