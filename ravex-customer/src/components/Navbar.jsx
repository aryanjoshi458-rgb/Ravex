import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Sun, Moon, X, Heart, Trash, ChevronRight, Check, Plus, MapPin, CreditCard, Smartphone, ShieldCheck, Banknote, Package, Star, Zap, ExternalLink, RefreshCcw, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { motion, AnimatePresence } from 'framer-motion';
import Drawer from './Drawer';
import Logo from './Logo';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const { cart, cartTotal, removeFromCart, addToCart, clearCart, isCartOpen, setIsCartOpen, shouldOpenCheckout, setShouldOpenCheckout, subtotal, shipping, storeSettings, appliedCoupon, applyCoupon, removeCoupon, discountAmount } = useCart();
  const { user, login, logout, updateUser, showLoginDrawer, setShowLoginDrawer, isQuickViewOpen } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const { products } = useProducts();
  const { isDarkMode, toggleTheme } = useTheme();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastPlacedOrderId, setLastPlacedOrderId] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponStatus, setCouponStatus] = useState({ type: '', message: '' });

  // Persistence Hack: Show success modal after refresh if needed
  useEffect(() => {
    const shouldShowSuccess = localStorage.getItem('ravex_pending_success');
    const pendingId = localStorage.getItem('ravex_pending_order_id');
    if (shouldShowSuccess === 'true' && pendingId) {
      setLastPlacedOrderId(pendingId);
      setOrderSuccess(true);
      localStorage.removeItem('ravex_pending_success');
      localStorage.removeItem('ravex_pending_order_id');
    }
  }, []);
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [profileData, setProfileData] = useState({ name: '', mobile: '', address: '' });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user?.name || '',
        mobile: user?.mobile || '',
        address: user?.address || ''
      });
    }
  }, [user]);

  const handleUpdateProfile = () => {
    updateUser(profileData);
    setActiveDrawer('profile');
  };

  useEffect(() => {
    if (activeDrawer === 'address_selection') {
      const saved = localStorage.getItem('ravex_addresses');
      const parsed = saved ? JSON.parse(saved) : [];
      setSavedAddresses(parsed);
      const defaultAddr = parsed.find(a => a.isDefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    }
  }, [activeDrawer]);

  useEffect(() => {
    if (isCartOpen) {
      setActiveDrawer('cart');
    } else if (activeDrawer === 'cart') {
      setActiveDrawer(null);
    }
  }, [isCartOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showLoginDrawer) {
      setActiveDrawer('profile');
      setShowLoginDrawer(false);
    }
  }, [showLoginDrawer, setShowLoginDrawer]);

  const [announcement, setAnnouncement] = useState({ text: '', enabled: false });

  useEffect(() => {
    fetch('http://localhost:3000/settings')
      .then(res => res.json())
      .then(data => {
        setAnnouncement({
          text: data.announcementText || '',
          enabled: data.announcementEnabled || false
        });
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (shouldOpenCheckout) {
      if (user) {
        setActiveDrawer('address_selection');
      } else {
        setActiveDrawer('profile');
      }
      setShouldOpenCheckout(false);
    }
  }, [shouldOpenCheckout, user, setShouldOpenCheckout]);

  const handleCardChange = (field, value) => {
    let formattedValue = value;
    if (field === 'number') {
      formattedValue = value.replace(/\D/g, '').slice(0, 16);
      formattedValue = (formattedValue.match(/.{1,4}/g)?.join(' ') || formattedValue);
    } else if (field === 'expiry') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      if (formattedValue.length >= 2) formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }
    setCardData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const isCardValid = cardData.number.replace(/\s/g, '').length === 16 && cardData.expiry.length === 5 && cardData.cvv.length === 3 && cardData.name.length > 2;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const closeDrawer = () => {
    setActiveDrawer(null);
    setIsCartOpen(false);
    setIsDropdownOpen(false);
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(value);
  };

  const handleSendOtp = () => {
    if (mobileNumber.length === 10) {
      setShowOtpStep(true);
    }
  };

  const handleVerifyOtp = () => {
    if (otp === '1234') {
      login({ mobile: mobileNumber });
      closeDrawer();
      setShowOtpStep(false);
      setMobileNumber('');
      setOtp('');
    } else {
      alert('Invalid OTP. Please use 1234 for testing.');
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();
    if (isPlacingOrder) return;

    if (!selectedAddressId) {
      alert("Please select a delivery address.");
      return;
    }

    if (!user?.name || user.name.trim() === "") {
      alert("Please enter your name in profile to place an order.");
      setActiveDrawer('edit_profile');
      return;
    }

    const razorpayKey = storeSettings.razorpayKeyId;
    // Total calculation for Razorpay (in paise)
    const amountInPaise = Math.round((subtotal + shipping - discountAmount) * 100);

    if (razorpayKey && selectedPaymentMethod !== 'cod') {
      const res = await loadRazorpay();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }

      const options = {
        key: razorpayKey,
        amount: amountInPaise,
        currency: "INR",
        name: storeSettings.storeName || "RAVEX",
        description: "Premium Gaming Gear",
        image: "/favicon.svg",
        handler: function (response) {
          processOrder(response.razorpay_payment_id);
        },
        prefill: {
          name: user?.name || "",
          contact: user?.mobile || ""
        },
        theme: {
          color: "#0ABAB5"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        alert("Payment Failed: " + response.error.description);
      });
      rzp1.open();
    } else {
      // Direct placement (COD or Mock)
      setIsPlacingOrder(true);
      setTimeout(() => {
        processOrder("MOCK_PAYMENT_ID");
      }, 2000);
    }
  };

  const processOrder = (paymentId) => {
    let addressString = "Address not specified";
    let finalCustomerName = user?.name || "Verified Customer";

    if (selectedAddressId === 'profile') {
      addressString = user?.address || "Address not specified";
    } else {
      const selectedAddr = savedAddresses.find(a => a.id === selectedAddressId);
      if (selectedAddr) {
        addressString = `${selectedAddr.flat}, ${selectedAddr.area}, ${selectedAddr.city}, ${selectedAddr.state} - ${selectedAddr.pincode}`;
        finalCustomerName = selectedAddr.name || user?.name || "Verified Customer";
      }
    }

    if (finalCustomerName === "Verified Customer" || !finalCustomerName.trim()) {
      const inputName = prompt("Please enter Receiver's Name for this order:");
      if (!inputName || !inputName.trim()) {
        alert("Name is required to place an order.");
        return;
      }
      finalCustomerName = inputName;
    }

    const newOrder = {
      orderId: `RVX-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentId: paymentId,
      date: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()} | ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`,
      status: "Processing",
      total: `₹${cartTotal}`,
      customerName: finalCustomerName,
      address: addressString,
      paymentMethod: selectedPaymentMethod === 'card' ? 'Credit/Debit Card' : selectedPaymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery',
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: `₹${item.price}`,
        image: item.image,
        qty: item.quantity || 1
      })),
      timeline: [
        { status: "Order Placed", date: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }), completed: true },
        { status: "Processing", date: "System checks in progress", completed: true },
        { status: "Shipped", date: "Estimating...", completed: false },
        { status: "Delivered", date: "Estimating...", completed: false }
      ],
      userMobile: user?.mobile
    };

    fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    })
    .then(res => res.json())
    .then(savedOrder => {
      localStorage.setItem('ravex_pending_success', 'true');
      localStorage.setItem('ravex_pending_order_id', newOrder.orderId);
      setLastPlacedOrderId(newOrder.orderId);
      setOrderSuccess(true);
      clearCart();
      setIsPlacingOrder(false);
      setActiveDrawer(null);
    })
    .catch(err => {
      console.error("Error saving order:", err);
      setIsPlacingOrder(false);
    });
  };

  const iconVariants = {
    hover: { 
      scale: 1.2, 
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.9 }
  };

  const suggestedItems = products
    .filter(p => !cart.some(item => item.id === p.id))
    .slice(0, 2);

  return (
    <>
      {/* Announcement Bar */}
      <AnimatePresence>
        {announcement.enabled && announcement.text && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-tiffany text-black overflow-hidden relative z-[60]"
          >
            <div className="py-2.5 whitespace-nowrap flex overflow-hidden">
              <motion.div 
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                className="flex items-center gap-12 font-black text-[10px] uppercase tracking-[0.25em]"
              >
                {[...Array(10)].map((_, i) => (
                  <span key={i} className="flex items-center gap-4">
                    <Zap size={12} fill="currentColor" />
                    {announcement.text}
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ease-in-out ${
        isQuickViewOpen ? '-translate-y-full' : 'translate-y-0'
      } ${
        isScrolled ? 'bg-background/90 backdrop-blur-md border-b border-border py-3' : 'bg-background py-5'
      }`}>
        <div className="container-tight">
          <div className="flex items-center justify-between">
            <Link to="/" className="group" onClick={closeDrawer}>
              <Logo className="h-8" />
            </Link>

            <div className="hidden md:flex flex-col items-start gap-1">
              <div className="flex items-center space-x-8 text-[11px] font-bold uppercase tracking-widest text-foreground">
                {['Keyboards', 'Mouse', 'Headphones', 'Desk Pad'].map((item) => (
                  <Link key={item} to={`/shop?category=${item}`} className="nav-bracket" onClick={closeDrawer}>{item}</Link>
                ))}
                
                {/* Dropdown Menu */}
                <div 
                  className="relative py-2"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <Link to="/shop" className="nav-bracket" onClick={closeDrawer}>
                    Shop All
                  </Link>
                  
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 pt-4 z-50"
                      >
                        <div className="bg-background border border-border p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] min-w-[200px] overflow-hidden backdrop-blur-md">
                          <Link 
                            to="/downloads" 
                            className="flex items-center gap-3 px-4 py-4 rounded-xl hover:bg-tiffany/10 text-foreground hover:text-tiffany transition-all duration-200 group"
                            onClick={closeDrawer}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-tiffany" />
                            <span className="font-bold uppercase tracking-widest text-[10px]">Downloads</span>
                          </Link>
                          <Link 
                            to="/warranty" 
                            className="flex items-center gap-3 px-4 py-4 rounded-xl hover:bg-tiffany/10 text-foreground hover:text-tiffany transition-all duration-200 group"
                            onClick={closeDrawer}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-tiffany/30 group-hover:bg-tiffany" />
                            <span className="font-bold uppercase tracking-widest text-[10px]">Warranty</span>
                          </Link>
                          <Link 
                            to="/contact" 
                            className="flex items-center gap-3 px-4 py-4 rounded-xl hover:bg-tiffany/10 text-foreground hover:text-tiffany transition-all duration-200 group"
                            onClick={closeDrawer}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-tiffany/30 group-hover:bg-tiffany" />
                            <span className="font-bold uppercase tracking-widest text-[10px]">Contact</span>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              {/* Sub Link: Gamer Bundle Packs Aligned under Keyboards */}
              <div className="text-[11px] font-bold uppercase tracking-widest text-foreground">
                <Link 
                  to="/shop?category=Gamer Bundle Packs" 
                  className="nav-bracket"
                  onClick={closeDrawer}
                >
                  Gamer Bundle Packs
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <motion.button onClick={toggleTheme} whileHover="hover" whileTap="tap" variants={iconVariants} className="p-2 cursor-pointer outline-none text-foreground hover:text-tiffany transition-colors">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>

              <motion.button onClick={() => setActiveDrawer('search')} whileHover="hover" whileTap="tap" variants={iconVariants} className="p-2 cursor-pointer outline-none text-foreground hover:text-tiffany transition-colors">
                <Search size={20} />
              </motion.button>

              <motion.button onClick={() => setActiveDrawer('wishlist')} whileHover="hover" whileTap="tap" variants={iconVariants} className="p-2 cursor-pointer outline-none text-foreground hover:text-red-500 transition-colors relative">
                <Heart size={20} className={wishlist.length > 0 ? "fill-red-500 text-red-500" : ""} />
                {wishlist?.length > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center text-white">
                    {wishlist.length}
                  </span>
                )}
              </motion.button>

              <motion.button onClick={() => setActiveDrawer('profile')} whileHover="hover" whileTap="tap" variants={iconVariants} className="p-2 cursor-pointer outline-none text-foreground hover:text-tiffany transition-colors">
                <User size={20} />
              </motion.button>

              <motion.button onClick={() => setActiveDrawer('cart')} whileHover="hover" whileTap="tap" variants={iconVariants} className="p-2 cursor-pointer outline-none text-foreground hover:text-tiffany transition-colors relative">
                <ShoppingCart size={20} />
                {cart?.length > 0 && (
                  <span className="absolute top-1 right-1 bg-tiffany text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center text-white shadow-[0_0_10px_rgba(10,186,181,0.5)]">
                    {cart.length}
                  </span>
                )}
              </motion.button>
            </div>
          </div>


        </div>
      </nav>

      {/* SEARCH DRAWER */}
      <Drawer isOpen={activeDrawer === 'search'} onClose={() => { closeDrawer(); setSearchQuery(''); }} title="Search Gear">
        <div className="space-y-12">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search keywords..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border rounded-xl py-5 px-6 text-sm outline-none focus:border-tiffany transition-colors font-medium placeholder:text-foreground/20"
              autoFocus
            />
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
          </div>

          <div className="space-y-8">
            {searchQuery.length > 0 ? (
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 mb-6">Search Results ({filteredProducts.length})</p>
                {filteredProducts.length > 0 ? (
                  <div className="space-y-4">
                    {filteredProducts.map(product => (
                      <Link 
                        key={product.id} 
                        to={`/product/${product.id}`} 
                        onClick={() => { closeDrawer(); setSearchQuery(''); }}
                        className="flex items-center gap-4 group p-2 rounded-2xl hover:bg-foreground/[0.03] transition-all"
                      >
                        <div className="h-16 w-16 bg-card border border-border rounded-xl p-2 overflow-hidden">
                          <img src={product.image} alt="" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                        </div>
                          <div>
                            <p className="text-xs font-bold mb-1 group-hover:text-tiffany transition-colors">{product.name}</p>
                            <p className="text-[10px] text-tiffany font-black">₹{product.price}</p>
                          </div>
                        <ChevronRight size={14} className="ml-auto text-foreground/20 group-hover:text-tiffany group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-foreground/20">
                    <p className="text-xs font-bold uppercase tracking-widest">No gear found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 mb-6">Trending Now</p>
                  <div className="flex flex-wrap gap-2">
                    {['Mechanical Keyboard', 'Gaming Mouse', 'RGB Desk Pad', 'Wireless Headset', '60% Layout'].map(tag => (
                      <button 
                        key={tag} 
                        onClick={() => setSearchQuery(tag)}
                        className="px-5 py-3 rounded-full border border-border bg-foreground/[0.02] text-[9px] font-bold uppercase tracking-widest hover:border-tiffany hover:text-tiffany transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 mb-6">Popular Gear</p>
                  <div className="space-y-4">
                    {products.slice(0, 3).map(product => (
                      <Link 
                        key={product.id} 
                        to={`/product/${product.id}`} 
                        onClick={() => { closeDrawer(); setSearchQuery(''); }}
                        className="flex items-center gap-4 group p-2 rounded-2xl hover:bg-foreground/[0.03] transition-all"
                      >
                        <div className="h-14 w-14 bg-card border border-border rounded-xl p-2 overflow-hidden">
                          <img src={product.image} alt="" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest mb-1 group-hover:text-tiffany transition-colors">{product.name}</p>
                          <p className="text-[9px] text-tiffany font-black">₹{product.price}</p>
                        </div>
                        <ChevronRight size={14} className="ml-auto text-foreground/20 group-hover:text-tiffany group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Drawer>

      {/* WISHLIST DRAWER */}
      <Drawer isOpen={activeDrawer === 'wishlist'} onClose={closeDrawer} title="My Favorites">
        <div className="space-y-6">
          {wishlist.length > 0 ? (
            wishlist.map(item => (
              <div key={item.id} className="flex items-center gap-6 py-4 border-b border-border group">
                <div className="h-16 w-16 bg-card rounded-xl p-2 border border-border">
                  <img src={item.image} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-wider mb-1">{item.name}</p>
                  <p className="text-xs text-tiffany font-black">₹{item.price}</p>
                </div>
                <button 
                  onClick={() => toggleWishlist(item)}
                  className="p-2 text-foreground/10 hover:text-red-500 transition-colors"
                >
                  <Trash size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-foreground/20">
              <Heart size={40} className="mx-auto mb-4 opacity-10" />
              <p className="text-xs font-bold uppercase tracking-widest">No favorites yet</p>
            </div>
          )}
          <button onClick={closeDrawer} className="btn-primary w-full py-4 text-xs mt-4">Continue Shopping</button>
        </div>
      </Drawer>

      {/* PROFILE/LOGIN DRAWER */}
      <Drawer isOpen={activeDrawer === 'profile'} onClose={closeDrawer} title={user ? "My Profile" : "Account Login"}>
        <div className="flex flex-col h-full">
          {user ? (
            <div className="space-y-8">
              <div className="flex items-center gap-4 p-6 bg-card rounded-2xl border border-border">
                <div className="h-16 w-16 rounded-full bg-tiffany/20 flex items-center justify-center text-tiffany text-2xl font-black">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'R'}
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">{user.name || `+91 ${user.mobile}`}</h3>
                  <p className="text-[10px] text-foreground/40 font-bold tracking-widest">{user.name ? `+91 ${user.mobile}` : 'Ravex Member'}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => setActiveDrawer('edit_profile')}
                  className="flex items-center justify-between w-full p-5 bg-card border border-border rounded-xl hover:border-tiffany/50 transition-all group"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-tiffany">My Profile</span>
                  <ChevronRight size={14} className="text-foreground/20 group-hover:text-tiffany" />
                </button>
                <Link 
                  to="/orders" 
                  onClick={closeDrawer}
                  className="flex items-center justify-between p-5 bg-card border border-border rounded-xl hover:border-tiffany/50 transition-all group"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-tiffany">My Orders</span>
                  <ChevronRight size={14} className="text-foreground/20 group-hover:text-tiffany" />
                </Link>
                <Link 
                  to="/track-order" 
                  onClick={closeDrawer}
                  className="flex items-center justify-between p-5 bg-card border border-border rounded-xl hover:border-tiffany/50 transition-all group"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-tiffany">Track Order</span>
                  <ChevronRight size={14} className="text-foreground/20 group-hover:text-tiffany" />
                </Link>
                <Link 
                  to="/addresses" 
                  onClick={closeDrawer}
                  className="flex items-center justify-between p-5 bg-card border border-border rounded-xl hover:border-tiffany/50 transition-all group"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-tiffany">My Addresses</span>
                  <ChevronRight size={14} className="text-foreground/20 group-hover:text-tiffany" />
                </Link>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    logout();
                    closeDrawer();
                  }}
                  className="w-full py-4 bg-red-500/10 text-red-500 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h3 className="text-xl font-bold uppercase tracking-tighter mb-2">
                  {showOtpStep ? "Verify OTP" : "Welcome Back"}
                </h3>
                <p className="text-xs text-foreground/40 font-medium">
                  {showOtpStep ? `Enter the 4-digit code sent to +91 ${mobileNumber}` : "Enter your mobile number to access your pro gear."}
                </p>
              </div>

              <div className="space-y-6">
                {!showOtpStep ? (
                  <div className="relative">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-2 block">Mobile Number</label>
                    <div className="flex items-center bg-background border border-border rounded-xl overflow-hidden focus-within:border-tiffany focus-within:ring-4 focus-within:ring-tiffany/5 transition-all">
                      <div className="pl-6 pr-4 py-5 bg-card/50 text-sm font-black text-tiffany border-r border-border">
                        +91
                      </div>
                      <input 
                        type="tel" 
                        value={mobileNumber} 
                        onChange={handleMobileChange} 
                        placeholder="Enter mobile number" 
                        className="w-full bg-transparent py-5 px-6 text-sm outline-none font-semibold placeholder:text-foreground/20" 
                      />
                    </div>
                    <button 
                      onClick={handleSendOtp}
                      disabled={mobileNumber.length !== 10} 
                      className={`w-full py-4 mt-6 rounded-lg font-bold uppercase tracking-widest text-xs transition-all ${mobileNumber.length === 10 ? 'bg-tiffany text-white shadow-lg shadow-tiffany/20' : 'bg-card text-foreground/20 cursor-not-allowed'}`}
                    >
                      Continue with OTP
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-2 block">Enter OTP (Test: 1234)</label>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))} 
                        placeholder="0 0 0 0" 
                        className="w-full bg-card border border-border rounded-lg py-4 px-6 text-center text-xl font-black tracking-[1em] outline-none focus:border-tiffany transition-colors" 
                      />
                    </div>
                    <button 
                      onClick={handleVerifyOtp}
                      disabled={otp.length !== 4} 
                      className={`w-full py-4 mt-6 rounded-lg font-bold uppercase tracking-widest text-xs transition-all ${otp.length === 4 ? 'bg-tiffany text-white shadow-lg shadow-tiffany/20' : 'bg-card text-foreground/20 cursor-not-allowed'}`}
                    >
                      Verify & Login
                    </button>
                    <button 
                      onClick={() => {
                        setShowOtpStep(false);
                        setOtp('');
                      }}
                      className="w-full py-3 mt-2 text-[9px] font-black uppercase tracking-widest text-foreground/40 hover:text-tiffany transition-colors"
                    >
                      Change Mobile Number
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Drawer>

      {/* EDIT PROFILE DRAWER */}
      <Drawer isOpen={activeDrawer === 'edit_profile'} onClose={() => setActiveDrawer('profile')} title="Edit Profile">
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="relative">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-2 block ml-1">Full Name</label>
              <input 
                type="text" 
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name" 
                className="w-full bg-card border border-border rounded-xl py-5 px-6 text-sm outline-none focus:border-tiffany transition-colors font-medium"
              />
            </div>
            
            <div className="relative">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-2 block ml-1">Mobile Number</label>
              <input 
                type="tel" 
                value={profileData.mobile}
                onChange={(e) => setProfileData(prev => ({ ...prev, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                placeholder="Enter mobile number" 
                className="w-full bg-card border border-border rounded-xl py-5 px-6 text-sm outline-none focus:border-tiffany transition-colors font-medium"
              />
            </div>
          </div>

          <button 
            onClick={() => {
              if (!profileData.name || profileData.name.trim() === "") {
                alert("Name is required!");
                return;
              }
              handleUpdateProfile();
            }}
            className="w-full py-5 bg-tiffany text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-tiffany/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Save Profile
          </button>
        </div>
      </Drawer>

      {/* CART DRAWER */}
      <Drawer isOpen={activeDrawer === 'cart'} onClose={closeDrawer} title="Your Shopping Cart">
         <div className="space-y-6">
          {cart && cart.length > 0 ? (
            <>
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center gap-6 py-4 border-b border-border group">
                  <div className="h-16 w-16 bg-card rounded-xl p-2 border border-border overflow-hidden">
                    <img src={item.image} alt="" className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-wider mb-1">{item.name}</p>
                    <p className="text-xs text-tiffany font-black">₹{item.price}</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item.id);
                    }} 
                    className="p-2 text-foreground/20 hover:text-red-500 transition-colors"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ))}
              <div className="pt-6">
                <div className="flex justify-between font-black mb-6 text-[10px] uppercase tracking-[0.2em]">
                  <span className="text-foreground/40">Total Amount</span>
                  <span className="text-tiffany">₹{cartTotal}</span>
                </div>
                <button 
                  onClick={() => {
                    if (user) {
                      setActiveDrawer('address_selection');
                    } else {
                      setActiveDrawer('profile');
                    }
                  }}
                  className="btn-primary w-full py-5 text-xs tracking-[0.2em] mb-8"
                >
                  Proceed to Checkout
                </button>

                {/* Suggested Add-ons */}
                <div className="border-t border-border pt-8">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/30 mb-4">Suggested for you</p>
                  <div className="grid grid-cols-2 gap-4">
                    {suggestedItems.map((item) => (
                      <div key={item.id} className="bg-card border border-border p-4 rounded-xl group cursor-pointer hover:border-tiffany/50 transition-colors">
                        <div className="aspect-square bg-background rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                        </div>
                        <p className="text-[8px] font-black uppercase tracking-widest mb-1 truncate">{item.name}</p>
                        <p className="text-[10px] font-black text-tiffany">₹{item.price}</p>
                        <button 
                          onClick={() => addToCart(item)}
                          className="mt-3 w-full py-2 bg-tiffany/5 hover:bg-tiffany hover:text-white text-[8px] font-black uppercase tracking-widest rounded-lg transition-all"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <ShoppingCart className="text-foreground/10 mx-auto mb-6" size={24} />
              <p className="text-xs font-bold uppercase tracking-widest text-foreground/30 mb-8">Your bag is empty</p>
              <button onClick={closeDrawer} className="btn-primary w-full py-4 text-xs">Continue Shopping</button>
            </div>
          )}
        </div>
      </Drawer>
      {/* ADDRESS SELECTION DRAWER */}
      <Drawer isOpen={activeDrawer === 'address_selection'} onClose={closeDrawer} title="Select Delivery Address">
        <div className="space-y-6">
          {(savedAddresses.length > 0 || user?.address) ? (
            <>
              <div className="space-y-4">
                {user?.address && (
                  <button 
                    onClick={() => setSelectedAddressId('profile')}
                    className={`w-full p-6 rounded-2xl border text-left transition-all relative ${
                      selectedAddressId === 'profile' || (!selectedAddressId && !savedAddresses.length)
                        ? 'bg-tiffany/5 border-tiffany shadow-lg shadow-tiffany/5' 
                        : 'bg-card border-border hover:border-tiffany/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-tiffany">Primary Profile Address</span>
                      {(selectedAddressId === 'profile' || (!selectedAddressId && !savedAddresses.length)) && (
                        <div className="h-4 w-4 rounded-full bg-tiffany flex items-center justify-center">
                          <Check size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-bold uppercase mb-1">{user.name || 'Account Holder'}</p>
                    <p className="text-[10px] text-foreground/40 font-semibold uppercase leading-relaxed">
                      {user.address}
                    </p>
                  </button>
                )}
                
                {savedAddresses.map((addr) => (
                  <button 
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`w-full p-6 rounded-2xl border text-left transition-all relative ${
                      selectedAddressId === addr.id 
                        ? 'bg-tiffany/5 border-tiffany shadow-lg shadow-tiffany/5' 
                        : 'bg-card border-border hover:border-tiffany/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-tiffany">{addr.type}</span>
                      {selectedAddressId === addr.id && (
                        <div className="h-4 w-4 rounded-full bg-tiffany flex items-center justify-center">
                          <Check size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-bold uppercase mb-1">{addr.name}</p>
                    <p className="text-[10px] text-foreground/40 font-semibold uppercase leading-relaxed">
                      {addr.flat}, {addr.area}, {addr.city} - {addr.pincode}
                    </p>
                  </button>
                ))}
              </div>

              <div className="pt-6 border-t border-border mt-8">
                <button 
                  onClick={() => setActiveDrawer('payment_selection')}
                  className="w-full py-5 bg-tiffany text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-tiffany/20 mb-4"
                >
                  Confirm Address & Pay
                </button>
                <Link 
                  to="/addresses" 
                  onClick={closeDrawer}
                  className="flex items-center justify-center gap-2 w-full py-4 text-[10px] font-bold uppercase tracking-widest text-foreground/40 hover:text-tiffany transition-colors"
                >
                  <Plus size={14} /> Add New Address
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="h-20 w-20 bg-card border border-border rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin size={32} className="text-foreground/20" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2">No Saved Addresses</p>
              <p className="text-[10px] text-foreground/40 font-semibold uppercase tracking-widest mb-10 leading-relaxed">
                Please add a shipping destination<br/>to continue with your order.
              </p>
              <Link 
                to="/addresses" 
                onClick={closeDrawer}
                className="inline-flex items-center gap-3 bg-tiffany text-white px-10 py-5 rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-tiffany/20"
              >
                <Plus size={16} /> Add New Address
              </Link>
            </div>
          )}
        </div>
      </Drawer>

      {/* PAYMENT SELECTION DRAWER */}
      <Drawer isOpen={activeDrawer === 'payment_selection'} onClose={closeDrawer} title="Select Payment Method">
        <div className="space-y-6">
          {/* Coupon Section */}
          <div className="mb-8 p-6 bg-card border border-border rounded-3xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-4 ml-1">Promo Code</p>
            {!appliedCoupon ? (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="ENTER CODE"
                  className="flex-1 bg-background border border-border rounded-xl py-3 px-4 text-xs font-bold uppercase outline-none focus:border-tiffany transition-all"
                />
                <button 
                  onClick={async () => {
                    const result = await applyCoupon(couponInput);
                    setCouponStatus({ type: result.success ? 'success' : 'error', message: result.message });
                    if (result.success) setCouponInput('');
                  }}
                  className="bg-tiffany text-black px-6 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                >
                  Apply
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-tiffany/10 border border-tiffany/20 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-tiffany flex items-center justify-center text-black">
                    <Tag size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-tighter text-tiffany">{appliedCoupon.code}</p>
                    <p className="text-[8px] font-bold text-foreground/40 uppercase">Discount Applied</p>
                  </div>
                </div>
                <button onClick={removeCoupon} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">Remove</button>
              </div>
            )}
            {couponStatus.message && (
              <p className={`mt-3 text-[9px] font-bold uppercase tracking-wider ${couponStatus.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {couponStatus.message}
              </p>
            )}
          </div>

          <div className="p-8 bg-foreground/[0.03] border border-border rounded-3xl mb-8 space-y-4">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-foreground/40">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-green-500">
                <span>Discount</span>
                <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-foreground/40">
              <span>GST ({storeSettings.gstPercentage}%)</span>
              <span>₹{Math.round((subtotal - discountAmount) * (storeSettings.gstPercentage / 100)).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-foreground/40">
              <span>Shipping Fee</span>
              {shipping > 0 ? (
                <span>₹{shipping.toLocaleString('en-IN')}</span>
              ) : (
                <span className="text-green-500 font-black">FREE</span>
              )}
            </div>
            <div className="pt-4 border-t border-dashed border-border flex justify-between items-center">
              <span className="text-[11px] font-black uppercase tracking-widest">Order Total</span>
              <span className="text-xl font-black text-tiffany">₹{cartTotal}</span>
            </div>
          </div>

          <div className="space-y-4">
            {storeSettings.enableCod && (
              <button 
                onClick={() => setSelectedPaymentMethod('cod')}
                className={`w-full p-6 rounded-2xl border text-left transition-all relative flex items-center gap-6 ${
                  selectedPaymentMethod === 'cod' 
                    ? 'bg-tiffany/5 border-tiffany shadow-lg shadow-tiffany/5' 
                    : 'bg-card border-border hover:border-tiffany/30'
                }`}
              >
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${selectedPaymentMethod === 'cod' ? 'bg-tiffany text-white' : 'bg-background text-foreground/20'}`}>
                  <Banknote size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase mb-1">Cash on Delivery</p>
                  <p className="text-[9px] text-foreground/40 font-semibold uppercase tracking-widest leading-relaxed">
                    Pay when your gear arrives
                  </p>
                </div>
                {selectedPaymentMethod === 'cod' && (
                  <div className="h-4 w-4 rounded-full bg-tiffany flex items-center justify-center">
                    <Check size={10} className="text-white" />
                  </div>
                )}
              </button>
            )}

            <button 
              onClick={() => setSelectedPaymentMethod('card')}
              className={`w-full p-6 rounded-2xl border text-left transition-all relative flex items-center gap-6 ${
                selectedPaymentMethod === 'card' 
                  ? 'bg-tiffany/5 border-tiffany shadow-lg shadow-tiffany/5' 
                  : 'bg-card border-border hover:border-tiffany/30'
              }`}
            >
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${selectedPaymentMethod === 'card' ? 'bg-tiffany text-white' : 'bg-background text-foreground/20'}`}>
                <CreditCard size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase mb-1">Credit / Debit Card</p>
                <p className="text-[9px] text-foreground/40 font-semibold uppercase tracking-widest leading-relaxed">
                  Visa, Mastercard, RuPay
                </p>
              </div>
              {selectedPaymentMethod === 'card' && (
                <div className="h-4 w-4 rounded-full bg-tiffany flex items-center justify-center">
                  <Check size={10} className="text-white" />
                </div>
              )}
            </button>

            <AnimatePresence>
              {selectedPaymentMethod === 'card' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
                    <div className="relative">
                      <p className="text-[8px] font-black uppercase tracking-widest text-foreground/40 mb-2 ml-1">Card Holder Name</p>
                      <input 
                        type="text" 
                        placeholder="Name on card"
                        value={cardData.name}
                        onChange={(e) => handleCardChange('name', e.target.value)}
                        className="w-full bg-background border border-border rounded-xl py-4 px-5 text-sm font-medium outline-none focus:border-tiffany transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <p className="text-[8px] font-black uppercase tracking-widest text-foreground/40 mb-2 ml-1">Card Number</p>
                      <input 
                        type="text" 
                        placeholder="0000 0000 0000 0000"
                        value={cardData.number}
                        onChange={(e) => handleCardChange('number', e.target.value)}
                        className="w-full bg-background border border-border rounded-xl py-4 px-5 text-sm font-medium outline-none focus:border-tiffany transition-colors"
                      />
                      <CreditCard size={14} className="absolute right-5 top-[38px] text-foreground/20" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-foreground/40 mb-2 ml-1">Expiry Date</p>
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          value={cardData.expiry}
                          onChange={(e) => handleCardChange('expiry', e.target.value)}
                          className="w-full bg-background border border-border rounded-xl py-4 px-5 text-sm font-medium outline-none focus:border-tiffany transition-colors text-center"
                        />
                      </div>
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-foreground/40 mb-2 ml-1">CVV</p>
                        <input 
                          type="password" 
                          placeholder="***"
                          value={cardData.cvv}
                          onChange={(e) => handleCardChange('cvv', e.target.value)}
                          className="w-full bg-background border border-border rounded-xl py-4 px-5 text-sm font-medium outline-none focus:border-tiffany transition-colors text-center"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {storeSettings.enableUpi && (
              <button 
                onClick={() => setSelectedPaymentMethod('upi')}
                className={`w-full p-6 rounded-2xl border text-left transition-all relative flex items-center gap-6 ${
                  selectedPaymentMethod === 'upi' 
                    ? 'bg-tiffany/5 border-tiffany shadow-lg shadow-tiffany/5' 
                    : 'bg-card border-border hover:border-tiffany/30'
                }`}
              >
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${selectedPaymentMethod === 'upi' ? 'bg-tiffany text-white' : 'bg-background text-foreground/20'}`}>
                  <Smartphone size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase mb-1">UPI / QR Code</p>
                  <p className="text-[9px] text-foreground/40 font-semibold uppercase tracking-widest leading-relaxed">
                    PhonePe, GPay, Paytm
                  </p>
                </div>
                {selectedPaymentMethod === 'upi' && (
                  <div className="h-4 w-4 rounded-full bg-tiffany flex items-center justify-center">
                    <Check size={10} className="text-white" />
                  </div>
                )}
              </button>
            )}
          </div>

          <div className="pt-8 mt-10 border-t border-border">
            <button 
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || (selectedPaymentMethod === 'card' && !isCardValid)}
              className={`w-full py-5 rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-2xl mb-6 flex items-center justify-center gap-3 transition-all ${
                isPlacingOrder || (selectedPaymentMethod === 'card' && !isCardValid) 
                  ? 'bg-card text-foreground/20 cursor-not-allowed border border-border' 
                  : 'bg-tiffany text-white shadow-tiffany/20 active:scale-95'
              }`}
            >
              {isPlacingOrder ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <ShieldCheck size={16} />
              )}
              {isPlacingOrder ? 'Processing...' : (selectedPaymentMethod === 'cod' ? 'Confirm COD Order' : 'Pay & Place Order')}
            </button>
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-foreground/20 text-center">
              Secure 256-bit SSL Encrypted Payment
            </p>
          </div>
        </div>
      </Drawer>

      {/* ORDER SUCCESS MODAL */}
      <AnimatePresence>
        {orderSuccess && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setOrderSuccess(false);
                setIsCheckoutOpen(false);
              }}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            
            {/* Celebration Icons */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 0, 
                    scale: 0,
                    x: "50vw",
                    y: "50vh"
                  }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0.5],
                    x: `${Math.random() * 100}vw`,
                    y: `${Math.random() * 100}vh`,
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: Math.random() * 0.5,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="absolute text-tiffany"
                >
                  {i % 3 === 0 ? <Star size={24} fill="currentColor" /> : i % 3 === 1 ? <Package size={24} /> : <Zap size={24} fill="currentColor" />}
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className={`relative w-full max-w-md ${isDarkMode ? 'bg-[#0A0A0A] border-white/10' : 'bg-white border-black/5'} border rounded-[2rem] p-8 text-center shadow-[0_30px_60px_rgba(0,0,0,0.4)] overflow-hidden`}
            >
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-tiffany/10 blur-[80px] -z-10`} />
              
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="h-16 w-16 bg-tiffany rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(20,255,236,0.3)]"
              >
                <Check size={32} className="text-black" strokeWidth={4} />
              </motion.div>

              <h2 className={`text-2xl font-black uppercase tracking-tighter mb-2 ${isDarkMode ? 'text-white' : 'text-black'} leading-none`}>
                Order<br/><span className="text-tiffany italic">Successful</span>
              </h2>
              <p className={`text-[9px] font-black ${isDarkMode ? 'text-white/30' : 'text-black/30'} uppercase tracking-[0.4em] mb-8 px-4`}>
                Your deployment is in progress
              </p>
              
              <div className={`${isDarkMode ? 'bg-white/[0.03] border-white/5' : 'bg-black/[0.02] border-black/5'} border rounded-xl p-6 mb-8 text-left relative overflow-hidden group`}>
                <div className={`flex justify-between items-center mb-3 pb-3 border-b ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                  <span className={`text-[8px] font-black ${isDarkMode ? 'text-white/20' : 'text-black/20'} uppercase tracking-widest`}>Tracking ID</span>
                  <span className="text-[11px] font-black text-tiffany uppercase tracking-widest">#{lastPlacedOrderId}</span>
                </div>
                <p className={`text-[8px] ${isDarkMode ? 'text-white/20' : 'text-black/20'} font-bold uppercase leading-relaxed text-center tracking-[0.1em]`}>
                  Details sent to your mobile number.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link 
                  to="/orders" 
                  onClick={() => {
                    setOrderSuccess(false);
                    setActiveDrawer(null);
                  }}
                  className="btn-primary py-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-tiffany/10"
                >
                  Track My Order
                </Link>
                <button 
                  onClick={() => {
                    setOrderSuccess(false);
                    setActiveDrawer(null);
                  }}
                  className={`text-[9px] font-black ${isDarkMode ? 'text-white/20 hover:text-white' : 'text-black/30 hover:text-black'} transition-all uppercase tracking-[0.3em] py-2`}
                >
                  Return to Shop
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Maintenance Mode Overlay */}
      {storeSettings.maintenanceMode && (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-8 text-center">
          <div className="max-w-md space-y-8">
            <div className="h-32 w-32 bg-tiffany/10 rounded-full flex items-center justify-center mx-auto border border-tiffany/20 shadow-[0_0_50px_rgba(20,255,236,0.2)]">
              <RefreshCcw size={64} className="text-tiffany animate-spin" />
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-black text-white tracking-tighter italic">Under<br/><span className="text-tiffany">Construction</span></h1>
              <p className="text-sm text-white/60 font-medium leading-relaxed">
                Our servers are currently undergoing a scheduled maintenance to improve your experience. We'll be back online shortly.
              </p>
            </div>
            <div className="pt-8 border-t border-white/10">
              <p className="text-xs font-bold text-tiffany tracking-wide">RAVEX Technical Support</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
