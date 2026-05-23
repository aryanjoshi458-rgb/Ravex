import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
  Activity,
  ChevronRight,
  RefreshCcw,
  Megaphone
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const { isDarkMode } = useOutletContext();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    conversionRate: 3.2,
    recentOrders: [],
    topProducts: [],
    chartData: []
  });
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    announcementEnabled: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const toggleSetting = async (key) => {
    const updatedSettings = { ...settings, [key]: !settings[key] };
    setSettings(updatedSettings);
    try {
      await fetch('http://localhost:3000/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, productsRes, settingsRes] = await Promise.all([
        fetch('http://localhost:3000/orders'),
        fetch('http://localhost:3000/products'),
        fetch('http://localhost:3000/settings')
      ]);
      
      const orders = await ordersRes.json();
      const productsData = await productsRes.json();
      const settingsData = await settingsRes.json();

      const totalRevenue = orders.reduce((acc, curr) => acc + (parseFloat(curr.total.replace(/[^0-9.]/g, '')) || 0), 0);
      
      const mockChartData = [
        { name: 'Mon', sales: 4500 },
        { name: 'Tue', sales: 5200 },
        { name: 'Wed', sales: 4800 },
        { name: 'Thu', sales: 6100 },
        { name: 'Fri', sales: 5900 },
        { name: 'Sat', sales: 7500 },
        { name: 'Sun', sales: 8200 },
      ];

      setStats({
        totalRevenue: totalRevenue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
        totalOrders: orders.length,
        totalCustomers: new Set(orders.map(o => o.userMobile)).size,
        conversionRate: 3.2,
        recentOrders: orders.slice(0, 5),
        topProducts: productsData.sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 4),
        chartData: mockChartData
      });
      setSettings(settingsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className={`${isDarkMode ? 'bg-[#1a2235] border-white/5' : 'bg-white border-gray-100 shadow-sm'} p-6 rounded-lg border flex flex-col gap-4`}>
      <div className="flex items-center justify-between">
        <div className={`h-10 w-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon size={20} className="text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'} text-xs font-black`}>
            {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 tracking-widest">{title}</p>
        <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'} mt-1`}>{value}</h3>
      </div>
    </div>
  );

  if (loading) return (
    <div className="h-[80vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-tiffany/20 border-t-tiffany rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 font-gaming">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-[28px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>Overview</h1>
          <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-600'} font-semibold mt-1`}>Your business performance at a glance.</p>
        </div>
        <div className={`flex items-center gap-3 px-6 py-3 ${isDarkMode ? 'bg-[#1a2235] border-white/5' : 'bg-white border-gray-200 shadow-sm'} rounded-lg border`}>
          <Activity size={16} className="text-tiffany animate-pulse" />
          <span className="text-[11px] font-black text-gray-400 tracking-widest">Live Updates Enabled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={stats.totalRevenue} icon={DollarSign} trend={12} color="bg-tiffany" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} trend={8} color="bg-blue-500" />
        <StatCard title="Active Customers" value={stats.totalCustomers} icon={Users} trend={-2} color="bg-orange-500" />
        <StatCard title="Conversion Rate" value={`${stats.conversionRate}%`} icon={TrendingUp} trend={1.4} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`lg:col-span-1 ${isDarkMode ? 'bg-[#1a2235] border-white/5' : 'bg-white border-gray-100 shadow-sm'} rounded-lg border p-8 flex flex-col`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>Quick Actions</h3>
              <p className="text-[10px] text-gray-400 font-bold mt-1">One-tap store controls</p>
            </div>
          </div>
          <div className="space-y-4 flex-1">
            <div className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200/50'} group hover:border-tiffany/50 transition-all cursor-pointer`} onClick={() => toggleSetting('maintenanceMode')}>
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-lg ${settings.maintenanceMode ? 'bg-red-500/10 text-red-500' : 'bg-tiffany/10 text-tiffany'} flex items-center justify-center`}>
                  <RefreshCcw size={18} className={settings.maintenanceMode ? 'animate-spin' : ''} />
                </div>
                <div>
                  <p className={`text-[11px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>Maintenance</p>
                  <p className="text-[9px] text-gray-500 font-bold">{settings.maintenanceMode ? 'Store is Hidden' : 'Store is Live'}</p>
                </div>
              </div>
              <div className={`w-8 h-4 rounded-full relative transition-colors ${settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'left-[18px]' : 'left-0.5'}`} />
              </div>
            </div>
            <div className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200/50'} group hover:border-tiffany/50 transition-all cursor-pointer`} onClick={() => toggleSetting('announcementEnabled')}>
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-lg ${settings.announcementEnabled ? 'bg-tiffany/10 text-tiffany' : 'bg-gray-500/10 text-gray-500'} flex items-center justify-center`}>
                  <Megaphone size={18} />
                </div>
                <div>
                  <p className={`text-[11px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>Announcement</p>
                  <p className="text-[9px] text-gray-500 font-bold">{settings.announcementEnabled ? 'Bar Visible' : 'Bar Hidden'}</p>
                </div>
              </div>
              <div className={`w-8 h-4 rounded-full relative transition-colors ${settings.announcementEnabled ? 'bg-tiffany' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${settings.announcementEnabled ? 'left-[18px]' : 'left-0.5'}`} />
              </div>
            </div>
            <button onClick={() => navigate('/settings')} className={`w-full mt-4 flex items-center justify-between p-4 rounded-xl border border-dashed ${isDarkMode ? 'border-white/10 text-gray-400 hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-100'} transition-all`}>
              <span className="text-[10px] font-black tracking-widest">More Settings</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className={`lg:col-span-2 ${isDarkMode ? 'bg-[#1a2235] border-white/5' : 'bg-white border-gray-100 shadow-sm'} rounded-lg border p-8`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>Revenue Trends</h3>
            <div className="flex gap-2">
              {['7D', '30D', '90D'].map(p => (
                <button key={p} className={`px-4 py-1.5 rounded-md text-[9px] font-black tracking-widest transition-all ${p === '7D' ? 'bg-tiffany text-white shadow-lg shadow-tiffany/20' : `${isDarkMode ? 'bg-white/5 text-gray-500 hover:text-white' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14ffec" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14ffec" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: isDarkMode ? '#4b5563' : '#9ca3af' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: isDarkMode ? '#4b5563' : '#9ca3af' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#1a2235' : '#fff', 
                    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 900
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#14ffec" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className={`lg:col-span-4 ${isDarkMode ? 'bg-[#1a2235] border-white/5' : 'bg-white border-gray-100 shadow-sm'} rounded-lg border p-8`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>Top Products</h3>
            <button className="text-tiffany hover:underline text-[10px] font-black tracking-widest">View All</button>
          </div>
          <div className="space-y-6">
            {stats.topProducts.map((product, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className={`h-12 w-12 rounded-lg ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'} border flex items-center justify-center p-2 shrink-0`}>
                  <img src={product.image} alt="" className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-gray-800'} truncate tracking-tight`}>{product.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-tiffany">₹{product.price}</p>
                  <p className="text-[9px] text-gray-500 font-bold mt-0.5">24 Sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Activity */}
        <div className={`lg:col-span-12 ${isDarkMode ? 'bg-[#1a2235] border-white/5' : 'bg-white border-gray-100 shadow-sm'} rounded-lg border overflow-hidden`}>
          <div className={`p-8 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}>
            <h3 className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>Recent Order Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={`${isDarkMode ? 'bg-white/5' : 'bg-gray-50/50'} border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 tracking-widest">Order ID</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 tracking-widest">Customer</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 tracking-widest">Total</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentOrders.map((order, i) => (
                  <tr key={i} className={`group ${isDarkMode ? 'hover:bg-white/[0.02] border-white/5' : 'hover:bg-gray-50/30 border-gray-50'} border-b transition-colors`}>
                    <td className="px-8 py-5">
                      <span className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>#{order.orderId || order.id}</span>
                    </td>
                    <td className="px-8 py-5">
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>+91 {order.userMobile}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-black tracking-widest ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-black text-tiffany">{order.total}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-gray-400 hover:text-tiffany transition-colors"><ChevronRight size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

