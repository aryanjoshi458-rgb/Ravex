import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Calendar, MapPin, Truck, CheckCircle, ArrowLeft, ExternalLink, ShoppingBag, X, AlertCircle, Star, Lock, Camera, Video, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CANCEL_REASONS = [
  "Order placed by mistake",
  "Price for the product has decreased",
  "Found a better price elsewhere",
  "Delivery is taking too long",
  "Changed my mind / No longer needed",
  "Incorrect shipping address",
  "Shipping cost is too high"
];

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Cancellation State
  const [cancelDrawerOpen, setCancelDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItemIdx, setSelectedItemIdx] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  
  // Invoice State
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [currentInvoiceOrder, setCurrentInvoiceOrder] = useState(null);

  // Review Check State
  const [userReviews, setUserReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, reviewsRes] = await Promise.all([
          fetch(`http://localhost:3000/orders`),
          fetch(`http://localhost:3000/reviews?userMobile=${user?.mobile}`)
        ]);
        
        if (ordersRes.ok) {
          const allOrders = await ordersRes.json();
          // Filter by mobile in JS to be safe
          const userOrders = allOrders.filter(o => o.userMobile === user?.mobile);
          setOrders(userOrders.reverse());
        }
        
        if (reviewsRes.ok) {
          const backendReviews = await reviewsRes.json();
          setUserReviews(backendReviews);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user, invoiceModalOpen, isReviewModalOpen]);

  const handleOpenCancelDrawer = (order, itemIdx) => {
    setSelectedOrder(order);
    setSelectedItemIdx(itemIdx);
    setCancelReason("");
    setCancelDrawerOpen(true);
  };

  const handleConfirmCancellation = () => {
    if (!cancelReason) return;

    const allOrders = JSON.parse(localStorage.getItem('ravex_orders') || '[]');
    const updatedOrders = allOrders.map(o => {
      if (o.id === selectedOrder.id) {
        const newItems = [...o.items];
        const item = newItems[selectedItemIdx];
        item.status = 'Cancelled';
        item.cancelReason = cancelReason;

        const now = new Date();
        const timestamp = now.toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: 'short', 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }).replace(',', '');

        // Add timeline entry
        const newTimeline = [
          ...o.timeline,
          { status: `${item.name} Cancelled`, date: timestamp, completed: true }
        ];

        // Check if all items are cancelled
        const allCancelled = newItems.every(i => i.status === 'Cancelled');
        
        return {
          ...o,
          items: newItems,
          timeline: newTimeline,
          status: allCancelled ? 'Cancelled' : o.status
        };
      }
      return o;
    });
    
    localStorage.setItem('ravex_orders', JSON.stringify(updatedOrders));
    
    // Update local state
    if (user) {
      const userOrders = updatedOrders.filter(o => o.userMobile === user.mobile);
      setOrders([...userOrders].reverse());
    }

    setCancelDrawerOpen(false);
  };

  const handleOpenInvoice = (order) => {
    setCurrentInvoiceOrder(order);
    setInvoiceModalOpen(true);
  };

  const handleDownloadInvoice = () => {
    window.print();
  };

  const handleOpenReviewModal = (item) => {
    setReviewProduct(item);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;
    
    const newReview = {
      productId: reviewProduct.id,
      rating,
      comment: reviewText,
      date: new Date().toISOString(),
      userName: user?.name || "Verified User",
      userMobile: user?.mobile
    };

    try {
      // Save to backend
      await fetch('http://localhost:3000/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      
      // Also save to local for legacy support
      const existingReviews = JSON.parse(localStorage.getItem('ravex_user_reviews') || '[]');
      localStorage.setItem('ravex_user_reviews', JSON.stringify([...existingReviews, newReview]));
      
      setIsSubmitted(true);
      setUserReviews(prev => [...prev, newReview]);

      setTimeout(() => {
        setIsReviewModalOpen(false);
        setIsSubmitted(false);
        setRating(0);
        setReviewText("");
      }, 2000);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (!user) {
    return (
      <div className="pt-40 pb-20 min-h-[80vh] flex items-center justify-center bg-background">
        <div className="text-center p-12 glass rounded-[3rem] max-w-lg border border-white/5">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 text-primary">
            <Package size={48} />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Orders Access Required</h2>
          <p className="text-foreground/40 text-sm uppercase tracking-widest font-bold mb-10 leading-relaxed">
            Please log in with your mobile number to access your order history and gear status.
          </p>
          <Link to="/" className="btn-primary w-full py-5 text-xs">Return to Home</Link>
          <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">Authorized access only</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-20 min-h-screen bg-background">
      <div className="container-tight max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-tiffany mb-4 transition-colors">
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold font-display uppercase tracking-tighter">
              Order <span className="text-tiffany italic">History</span>
            </h1>
          </div>
          <div className="bg-card border border-border p-4 rounded-2xl flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-tiffany/10 flex items-center justify-center text-tiffany">
              <Package size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Total Orders</p>
              <p className="text-lg font-bold uppercase">{orders.length} Orders</p>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {orders.length > 0 ? (
            orders.map((order, idx) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border border-border rounded-[2.5rem] overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-8 md:p-10 border-b border-border bg-foreground/[0.02] flex flex-col md:flex-row justify-between gap-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/30 mb-2">Order ID</p>
                      <p className="text-sm font-bold uppercase tracking-widest">#{order.orderId || order.id}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30 mb-2">Date Placed</p>
                      <p className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={14} className="text-tiffany" /> {order.date}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/30 mb-2">Total Amount</p>
                      <p className="text-sm font-bold text-tiffany tracking-widest">{order.total}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/30 mb-2">Ship To</p>
                      <p className="text-sm font-bold uppercase tracking-widest truncate max-w-[150px]">{order.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {(order.status === 'Shipped' || order.status === 'Delivered') ? (
                      <button 
                        onClick={() => handleOpenInvoice(order)}
                        className="btn-primary py-3 px-6 text-[9px] tracking-[0.2em] uppercase flex items-center gap-2 h-fit"
                      >
                        Download Invoice <ExternalLink size={12} />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-3 bg-foreground/5 border border-dashed border-foreground/10 rounded-xl text-foreground/40 cursor-not-allowed">
                        <Lock size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">
                          Invoice Locked (Ships Soon)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
                  {/* Items List */}
                  <div className="lg:col-span-7 space-y-6">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-6 p-4 rounded-2xl bg-background/50 border border-border group hover:border-tiffany/30 transition-all relative">
                        <div className="h-20 w-20 bg-card rounded-xl border border-border p-2 overflow-hidden">
                          <img src={item.image} alt="" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-bold uppercase tracking-widest">{item.name}</h4>
                            {item.status === 'Cancelled' && (
                              <span className="text-[7px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full border border-red-500/20">Cancelled</span>
                            )}
                          </div>
                          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-2">Quantity: {item.qty}</p>
                          <p className="text-sm font-bold text-tiffany">{item.price}</p>
                        </div>
                        
                        {/* ACTION BUTTONS WITH REVIEW WALL */}
                        <div className="flex flex-col gap-2 min-w-[140px]">
                          {/* Re-Order Button: Available for non-cancelled items */}
                          {item.status !== 'Cancelled' && (
                            <Link 
                              to={`/product/${item.id || products.find(p => p.name === item.name)?.id}`} 
                              className="text-[10px] font-black uppercase tracking-[0.1em] text-center bg-tiffany/10 text-tiffany border border-tiffany/20 py-2.5 px-4 rounded-xl hover:bg-tiffany hover:text-white transition-all duration-300"
                            >
                              Re-Order
                            </Link>
                          )}

                          {/* Cancel Button: Only for Processing orders */}
                          {order.status === 'Processing' && item.status !== 'Cancelled' && (
                            <button 
                              onClick={() => handleOpenCancelDrawer(order, i)}
                              className="text-[10px] font-black uppercase tracking-[0.1em] text-center py-2.5 px-4 rounded-xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all duration-300"
                            >
                              Cancel Item
                            </button>
                          )}

                          {/* Rate Button: Only after delivery if not reviewed */}
                          {order.status === 'Delivered' && item.status !== 'Cancelled' && !(userReviews && userReviews.some(r => r.productId === item.id || (products.find(p => p.name === item.name)?.id === r.productId))) && (
                            <button 
                              onClick={() => handleOpenReviewModal(item)}
                              className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-center py-2.5 px-4 rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all"
                            >
                              <Star size={12} fill="currentColor" />
                              Rate Now
                            </button>
                          )}

                          {/* Review Submitted Status */}
                          {userReviews && userReviews.some(r => r.productId === item.id || (products.find(p => p.name === item.name)?.id === r.productId)) && (
                            <div className="flex items-center justify-center gap-1.5 py-2 px-4 bg-green-500/10 rounded-xl text-green-500 text-[9px] font-black uppercase tracking-widest border border-green-500/20">
                              <CheckCircle size={10} /> Reviewed
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-6 mt-6 border-t border-dashed border-border flex items-start gap-4">
                      <MapPin size={18} className="text-foreground/20 mt-1" />
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30 mb-1">Delivery Address</p>
                        <p className="text-xs font-bold text-foreground/60 leading-relaxed uppercase tracking-widest">{order.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tracking Progress */}
                  <div className="lg:col-span-5 bg-foreground/[0.02] rounded-3xl p-8 border border-border">
                    <div className="flex items-center justify-between mb-8">
                      <h5 className="text-[10px] font-bold uppercase tracking-[0.3em]">Status Tracker</h5>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' : 
                        order.status === 'Cancelled' ? 'bg-red-500/20 text-red-500' :
                        'bg-tiffany/20 text-tiffany'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="space-y-6">
                      {order.timeline.map((step, i) => (
                        <div key={i} className="flex gap-4 relative">
                          {i !== order.timeline.length - 1 && (
                            <div className={`absolute left-[7px] top-4 w-[2px] h-full ${step.completed ? 'bg-tiffany' : 'bg-border'}`} />
                          )}
                          <div className={`h-4 w-4 rounded-full border-2 z-10 flex items-center justify-center bg-background ${
                            step.completed ? 'border-tiffany bg-tiffany' : 'border-border'
                          }`}>
                            {step.completed && <CheckCircle size={10} className="text-white" />}
                          </div>
                          <div>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${step.completed ? 'text-foreground' : 'text-foreground/30'}`}>
                              {step.status}
                            </p>
                            <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">{step.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-24 text-center bg-card border border-border rounded-[3rem]">
              <div className="h-28 w-28 rounded-full bg-tiffany/5 border border-tiffany/10 flex items-center justify-center mx-auto mb-10 text-tiffany/40">
                <ShoppingBag size={48} />
              </div>
              <h3 className="text-3xl font-bold uppercase tracking-tight mb-4 text-white">You haven't placed any orders yet</h3>
              <p className="text-sm text-foreground/40 uppercase tracking-widest font-bold mb-12 max-w-md mx-auto leading-relaxed">
                Explore our latest high-performance gaming gear and start your first order today.
              </p>
              <Link to="/shop" className="btn-primary px-16 py-6 text-xs shadow-2xl shadow-tiffany/20">Start Shopping</Link>
            </div>
          )}
        </div>

        <div className="mt-20 p-12 rounded-[3rem] bg-tiffany/5 border border-tiffany/20 text-center">
          <p className="text-2xl font-bold uppercase tracking-tight mb-4">Looking for something else?</p>
          <p className="text-sm text-foreground/60 uppercase tracking-widest font-bold mb-8">Need help with an order or want to initiate a return?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-primary py-4 px-8 text-xs">Contact Support</Link>
            <Link to="/faq" className="btn-outline py-4 px-8 text-xs">Visit Help Center</Link>
          </div>
        </div>
      </div>

      {/* CANCELLATION DRAWER */}
      <AnimatePresence>
        {cancelDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancelDrawerOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-full md:max-w-xl bg-card border border-border z-[101] shadow-[0_50px_100px_rgba(0,0,0,0.5)] rounded-[3rem] overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-card z-10 pb-2">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Cancel Item</h2>
                  <button onClick={() => setCancelDrawerOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-4 p-4 bg-background/50 border border-border rounded-2xl mb-8">
                  <div className="h-16 w-16 bg-card rounded-xl border border-border p-2">
                    <img src={selectedOrder.items[selectedItemIdx].image} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Item to cancel</p>
                    <p className="text-sm font-bold uppercase tracking-tight">{selectedOrder.items[selectedItemIdx].name}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 mb-6 px-1">Reason for Cancellation</p>
                    <div className="space-y-3">
                      {CANCEL_REASONS.map((reason) => (
                        <label 
                          key={reason} 
                          className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                            cancelReason === reason ? 'border-red-500 bg-red-500/5' : 'border-border bg-foreground/[0.02] hover:border-foreground/20'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="cancelReason" 
                            className="hidden" 
                            value={reason} 
                            onChange={(e) => setCancelReason(e.target.value)}
                          />
                          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            cancelReason === reason ? 'border-red-500' : 'border-border'
                          }`}>
                            {cancelReason === reason && <div className="h-2 w-2 rounded-full bg-red-500" />}
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${cancelReason === reason ? 'text-red-500' : 'text-foreground/60'}`}>{reason}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-3xl flex gap-4 items-start">
                    <AlertCircle className="text-red-500 mt-1" size={20} />
                    <p className="text-[10px] font-bold text-red-500/80 leading-relaxed uppercase tracking-widest">
                      Are you sure you want to cancel? This action cannot be reversed and your gear will return to inventory.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 sticky bottom-0 bg-card pt-6 z-10 border-t border-border mt-10">
                  <button 
                    onClick={() => setCancelDrawerOpen(false)}
                    className="flex-1 py-5 rounded-2xl border border-border font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all"
                  >
                    Keep Item
                  </button>
                  <button 
                    onClick={handleConfirmCancellation}
                    disabled={!cancelReason}
                    className={`flex-1 py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all ${
                      cancelReason ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-card text-foreground/20 cursor-not-allowed border border-border'
                    }`}
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* INVOICE MODAL */}
      <AnimatePresence>
        {invoiceModalOpen && currentInvoiceOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInvoiceModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 md:p-8 border-b border-border flex items-center justify-between bg-foreground/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-tiffany rounded-xl flex items-center justify-center text-white font-black text-xl">R</div>
                  <h2 className="text-sm font-black uppercase tracking-[0.2em]">Tax Invoice</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleDownloadInvoice}
                    className="p-3 bg-tiffany/10 text-tiffany rounded-xl hover:bg-tiffany hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                  >
                    <Truck size={14} /> Download PDF
                  </button>
                  <button onClick={() => setInvoiceModalOpen(false)} className="p-3 hover:bg-foreground/5 rounded-xl transition-all">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div id="invoice-content" className="flex-1 overflow-y-auto p-10 md:p-16 text-foreground">
                <style>{`
                  @media print {
                    body { background: white !important; color: black !important; }
                    .no-print { display: none !important; }
                    #invoice-content { padding: 0 !important; }
                    .print-border { border: 1px solid #eee !important; }
                  }
                `}</style>
                <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
                  <div className="space-y-4">
                    <div className="text-3xl font-black text-tiffany tracking-tighter">RAVEX GEAR</div>
                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest leading-loose">
                      Elite Gaming Solutions Private Ltd.<br />
                      H-12, Cyber Hub, Gurgaon<br />
                      Haryana - 122002<br />
                      GSTIN: 07AAACE1234F1Z5
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Invoice No</p>
                    <p className="text-xl font-black text-tiffany">INV-{currentInvoiceOrder.id.split('-')[1]}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mt-4">Order ID: #{currentInvoiceOrder.id}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Date: {currentInvoiceOrder.date}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-16 p-8 bg-foreground/[0.02] rounded-3xl border border-border">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30 mb-4">Billing To</p>
                    <p className="text-xs font-black uppercase tracking-widest mb-2">Member: +91 {currentInvoiceOrder.userMobile}</p>
                    <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest leading-relaxed">
                      {currentInvoiceOrder.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30 mb-4">Payment Method</p>
                    <p className="text-xs font-black uppercase tracking-widest text-tiffany">{currentInvoiceOrder.paymentMethod}</p>
                  </div>
                </div>

                <table className="w-full mb-16">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-4 text-left text-[9px] font-black uppercase tracking-widest text-foreground/30">Gear Description</th>
                      <th className="py-4 text-center text-[9px] font-black uppercase tracking-widest text-foreground/30">Qty</th>
                      <th className="py-4 text-right text-[9px] font-black uppercase tracking-widest text-foreground/30">Price</th>
                      <th className="py-4 text-right text-[9px] font-black uppercase tracking-widest text-foreground/30">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInvoiceOrder.items.map((item, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-6">
                          <p className="text-[11px] font-black uppercase tracking-widest mb-1">{item.name}</p>
                          <p className="text-[8px] font-bold text-foreground/30 uppercase tracking-widest">Category: Pro Gaming Gear</p>
                        </td>
                        <td className="py-6 text-center text-xs font-bold">{item.qty || 1}</td>
                        <td className="py-6 text-right text-xs font-bold">{item.price}</td>
                        <td className="py-6 text-right text-xs font-black text-tiffany">{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-end">
                  <div className="w-full max-w-[240px] space-y-4">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                      <span>Subtotal</span>
                      <span>{currentInvoiceOrder.total}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                      <span>GST (0%)</span>
                      <span>₹0</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                      <span>Shipping</span>
                      <span className="text-green-500">FREE</span>
                    </div>
                    <div className="pt-4 border-t border-border flex justify-between">
                      <span className="text-xs font-black uppercase tracking-widest">Grand Total</span>
                      <span className="text-xl font-black text-tiffany">{currentInvoiceOrder.total}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-20 pt-10 border-t border-border text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground/20 mb-4 italic">Thank you for choosing Ravex Gear</p>
                  <div className="h-10 w-32 bg-foreground/5 mx-auto rounded-lg flex items-center justify-center opacity-30 grayscale">
                    <span className="font-black text-xs">AUTHORIZED</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INTEGRATED REVIEW MODAL */}
      <AnimatePresence>
        {isReviewModalOpen && reviewProduct && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute inset-0 bg-background/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-card border border-border rounded-[3rem] p-10 md:p-12 shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                className="absolute top-8 right-8 p-3 hover:bg-foreground/5 rounded-full transition-all"
              >
                <X size={24} />
              </button>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="h-20 w-20 bg-tiffany/10 rounded-full flex items-center justify-center mx-auto mb-6 text-tiffany">
                    <Check size={40} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Review Submitted</h3>
                  <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">Feedback saved! Invoice unlocked.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-16 w-16 bg-background rounded-2xl border border-border p-2">
                      <img src={reviewProduct.image} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter">Rate Gear</h3>
                      <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{reviewProduct.name}</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleReviewSubmit} className="space-y-8">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-4 ml-1">Overall Satisfaction</p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setRating(star)}
                            className={`p-1 transition-all ${rating >= star ? 'text-tiffany scale-110' : 'text-foreground/10'}`}
                          >
                            <Star size={32} fill={rating >= star ? 'currentColor' : 'none'} strokeWidth={1.5} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-4 ml-1">Share Your Experience</p>
                      <textarea 
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="How is the performance? Any pros/cons?"
                        className="w-full bg-background border border-border rounded-2xl p-6 text-sm outline-none focus:border-tiffany transition-all min-h-[120px] font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-tiffany/30 cursor-pointer group transition-all">
                        <Camera size={24} className="text-foreground/20 group-hover:text-tiffany" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 group-hover:text-tiffany">Add Photo</p>
                      </div>
                      <div className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-tiffany/30 cursor-pointer group transition-all">
                        <Video size={24} className="text-foreground/20 group-hover:text-tiffany" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 group-hover:text-tiffany">Add Video</p>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={rating === 0}
                      className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl ${
                        rating > 0 
                          ? 'bg-tiffany text-white shadow-tiffany/20 hover:scale-[1.02] active:scale-[0.98]' 
                          : 'bg-card border border-border text-foreground/10 cursor-not-allowed'
                      }`}
                    >
                      Submit & Unlock Gear
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
