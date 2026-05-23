import { useState, useEffect } from 'react';
import { Search, User, Mail, Phone, Trash2, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';

const Customers = () => {
  const { isDarkMode } = useOutletContext();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:3000/orders');
      if (response.ok) {
        const orders = await response.json();
        // Group by userMobile to get unique customers
        const customerMap = {};
        orders.forEach(order => {
          if (!customerMap[order.userMobile]) {
            customerMap[order.userMobile] = {
              name: order.customerName || 'Anonymous',
              mobile: order.userMobile,
              address: order.address,
              lastOrderDate: order.date,
              totalOrders: 1,
              orderIds: [order.id]
            };
          } else {
            customerMap[order.userMobile].totalOrders += 1;
            customerMap[order.userMobile].orderIds.push(order.id);
            customerMap[order.userMobile].lastOrderDate = order.date;
            // Update name if we found a better one
            if (order.customerName && order.customerName !== 'Verified Customer') {
              customerMap[order.userMobile].name = order.customerName;
            }
          }
        });
        setCustomers(Object.values(customerMap));
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomerHistory = async (mobile) => {
    if (!window.confirm(`Are you sure you want to delete all order history for customer +91 ${mobile}?`)) return;

    try {
      // Find all orders for this mobile
      const response = await fetch('http://localhost:3000/orders');
      const orders = await response.json();
      const userOrders = orders.filter(o => o.userMobile === mobile);

      // Delete each order
      await Promise.all(userOrders.map(order => 
        fetch(`http://localhost:3000/orders/${order.id}`, { method: 'DELETE' })
      ));

      // Refresh list
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting history:", error);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} tracking-tighter mb-2`}>Customer <span className="text-tiffany italic">Management</span></h1>
          <p className={`text-[10px] font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} tracking-[0.1em]`}>View and manage customer data and history</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`${isDarkMode ? 'bg-[#1a2235] border-white/5' : 'bg-white border-gray-100'} p-4 rounded-lg flex items-center gap-4 shadow-sm border`}>
            <div className="h-10 w-10 rounded-full bg-tiffany/10 flex items-center justify-center text-tiffany">
              <User size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-gray-400">Total Customers</p>
              <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{customers.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`${isDarkMode ? 'bg-[#1a2235] border-white/5' : 'bg-white border-gray-100'} rounded-lg overflow-hidden shadow-sm border`}>
        {/* Filter Section */}
        <div className={`p-8 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-50'} flex flex-col md:flex-row gap-6 justify-between items-center`}>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by mobile or address..." 
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
                <th className={`px-8 py-5 text-[10px] font-black ${isDarkMode ? 'text-gray-300' : 'text-gray-400'} tracking-widest`}>Customer Info</th>
                <th className={`px-8 py-5 text-[10px] font-black ${isDarkMode ? 'text-gray-300' : 'text-gray-400'} tracking-widest`}>Address</th>
                <th className={`px-8 py-5 text-[10px] font-black ${isDarkMode ? 'text-gray-300' : 'text-gray-400'} tracking-widest`}>Total Orders</th>
                <th className={`px-8 py-5 text-[10px] font-black ${isDarkMode ? 'text-gray-300' : 'text-gray-400'} tracking-widest`}>Last Order</th>
                <th className={`px-8 py-5 text-[10px] font-black ${isDarkMode ? 'text-gray-300' : 'text-gray-400'} tracking-widest text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentItems.map((customer, idx) => (
                <tr key={customer.mobile} className={`${isDarkMode ? 'hover:bg-white/[0.02] border-white/5' : 'hover:bg-gray-50/50 border-gray-50'} border-b last:border-0 transition-colors group`}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-400'} flex items-center justify-center font-bold text-xs uppercase`}>
                        {customer.mobile.slice(-2)}
                      </div>
                      <div>
                        <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{customer.name}</p>
                        <p className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-bold tracking-widest`}>+91 {customer.mobile}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} truncate max-w-[250px]`}>{customer.address}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-tiffany/5 text-tiffany text-[10px] font-black tracking-widest rounded-full border border-tiffany/10">
                      {customer.totalOrders} Orders
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} tracking-widest`}>{customer.lastOrderDate}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => deleteCustomerHistory(customer.mobile)}
                        className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all"
                        title="Delete History"
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

        {/* Pagination */}
        <div className="p-8 bg-gray-50/30 flex items-center justify-between">
          <p className="text-[10px] font-black text-gray-400 tracking-widest">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCustomers.length)} of {filteredCustomers.length} customers
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-tiffany hover:border-tiffany disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-400 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-tiffany text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-tiffany hover:border-tiffany disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-400 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
