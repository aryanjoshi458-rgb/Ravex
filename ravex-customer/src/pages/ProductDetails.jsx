import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw, ChevronLeft, Star, Camera, Video, X, Check, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const { addToCart, setShouldOpenCheckout } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user, setShowLoginDrawer } = useAuth();
  const product = products.find(p => String(p.id) === String(id));
  const [selectedImage, setSelectedImage] = useState(product?.image);
  const isFavorited = isInWishlist(product?.id);
  
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!product?.isLimitedOffer || !product?.offerEndTime) return;

    const timer = setInterval(() => {
      const end = new Date(product.offerEndTime).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("");
        clearInterval(timer);
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [product?.isLimitedOffer, product?.offerEndTime]);

  const currentPriceNum = parseInt(String(product?.price || '0').replace(/[^0-9]/g, ''));
  const mrpVal = parseInt(String(product?.mrp || product?.price || '0').replace(/[^0-9]/g, ''));
  const calculatedDiscount = mrpVal > currentPriceNum ? Math.round(((mrpVal - currentPriceNum) / mrpVal) * 100) : 0;
  const formattedMRP = new Intl.NumberFormat('en-IN').format(mrpVal);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [showBundleSuccess, setShowBundleSuccess] = useState(false);
  const [productReviews, setProductReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:3000/reviews?productId=${id}`);
      const data = await response.json();
      setProductReviews(data);
      setLoadingReviews(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const averageRating = productReviews.length > 0 
    ? (productReviews.reduce((acc, curr) => acc + curr.rating, 0) / productReviews.length).toFixed(1)
    : product?.rating || "0.0";

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) setSelectedImage(product.image);
  }, [product]);

  const handleAddBundle = () => {
    // Add current product
    addToCart(product);
    // Add Speed Pad
    addToCart({
      id: 999, 
      name: "Ravex Pro Speed Pad",
      price: "999",
      image: "/ravex_essential_pad_branded_1778169221018.png",
      category: "Desk Pad"
    });
    
    setShowBundleSuccess(true);
    setTimeout(() => setShowBundleSuccess(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product);
    setShouldOpenCheckout(true);
  };

  const handleWriteReviewClick = async () => {
    if (!user) {
      setShowLoginDrawer(true);
      return;
    }

    try {
      // Check backend for verified purchase
      const response = await fetch(`http://localhost:3000/orders?userMobile=${user.mobile}`);
      const backendOrders = await response.json();
      
      const allOrders = [...backendOrders, ...JSON.parse(localStorage.getItem('ravex_orders') || '[]')];
      
      const hasOrdered = allOrders.some(order => 
        order.items.some(item => item.id === product.id)
      );
      
      const hasDeliveredOrder = allOrders.some(order => 
        order.status === 'Delivered' && 
        order.items.some(item => item.id === product.id)
      );

      if (!hasOrdered) {
        setReviewError("Authentication Required: You must purchase this product before leaving a review. Experience the gear first!");
        setTimeout(() => setReviewError(""), 5000);
        return;
      }

      if (!hasDeliveredOrder) {
        setReviewError("Delivery Pending: You can share your experience once your order has been successfully delivered. We appreciate your patience!");
        setTimeout(() => setReviewError(""), 5000);
        return;
      }

      setIsReviewModalOpen(true);
    } catch (error) {
      console.error("Error verifying purchase:", error);
      // Fallback to local storage if API fails
      const localOrders = JSON.parse(localStorage.getItem('ravex_orders') || '[]');
      const hasDeliveredLocal = localOrders.some(order => 
        order.status === 'Delivered' && order.userMobile === user.mobile &&
        order.items.some(item => item.id === product.id)
      );
      if (hasDeliveredLocal) setIsReviewModalOpen(true);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    const newReview = {
      productId: product.id,
      rating,
      comment: reviewText,
      date: new Date().toISOString(),
      userName: user.name || "Verified User",
      userMobile: user.mobile
    };
    
    try {
      const response = await fetch('http://localhost:3000/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      if (response.ok) {
        setProductReviews(prev => [...prev, newReview]);
        setIsSubmitted(true);
        setTimeout(() => {
          setIsReviewModalOpen(false);
          setIsSubmitted(false);
          setRating(0);
          setReviewText("");
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (!product) return <div className="pt-40 text-center uppercase font-black">Gear Not Found</div>;

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen">
      <div className="container-tight">
        {/* Breadcrumb */}
        <Link to="/shop" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-tiffany transition-colors mb-16 ml-2">
          <ChevronLeft size={14} /> Back to Gear
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          {/* Product Images Section */}
          <div className="flex flex-col-reverse md:flex-row gap-4 items-start">
            {/* Thumbnails Column (Left side) */}
            <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto w-full md:w-16 scrollbar-hide shrink-0 pb-2 md:pb-0">
              {(product.images && product.images.length > 0 ? product.images : [product.image]).map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square w-14 md:w-full rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-foreground shadow-sm' : 'border-transparent bg-card hover:border-border'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Product Image (Right side) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 aspect-square rounded-2xl overflow-hidden bg-card border border-border group"
            >
              <img 
                src={selectedImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-tiffany/10 text-tiffany rounded-full text-[10px] font-medium tracking-widest">
                  {product.category}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4 leading-snug">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-xl md:text-2xl font-bold text-foreground">₹ {new Intl.NumberFormat('en-IN').format(parseInt(String(product.price).replace(/[^0-9]/g, '')))}</span>
                <span className="text-sm font-medium text-foreground/40 line-through">
                  MRP ₹ {formattedMRP}
                </span>
                {(product.showDiscount !== false && calculatedDiscount > 0) && (
                  <span className="ml-2 px-2 py-1 bg-black text-white text-[10px] font-bold uppercase rounded">
                    {calculatedDiscount}% OFF
                  </span>
                )}
              </div>

              {/* Minimal Flash Sale Timer */}
              {timeLeft && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mb-8 bg-orange-50/50 p-4 rounded-2xl border border-orange-100 inline-flex">
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>🔥</motion.span>
                  <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Limited Flash Offer Ends:</span>
                  <span className="text-[15px] font-black text-orange-600 font-mono tracking-tighter">{timeLeft}</span>
                </motion.div>
              )}

              <p className="text-foreground text-sm leading-relaxed max-w-lg mt-6">
                {product.description} Engineered for pro-gamers and competitive enthusiasts. 
                Experience the pinnacle of hardware performance with ultra-low latency and 
                premium build quality that Ravex is known for.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.button 
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                variants={{
                  hover: { scale: 1.02, boxShadow: "0 20px 40px rgba(20,255,236,0.2)" },
                  tap: { scale: 0.98 }
                }}
                onClick={() => addToCart(product)}
                className="flex-1 btn-primary py-5 text-xs tracking-[0.2em] flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                <motion.div
                  variants={{
                    initial: { x: 0 },
                    hover: { x: [0, -4, 4, 0] }
                  }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10"
                >
                  <ShoppingCart size={18} />
                </motion.div>
                <span className="relative z-10">Add to Cart</span>
                <motion.div 
                  variants={{
                    initial: { x: "-100%", opacity: 0 },
                    hover: { x: "200%", opacity: 1 }
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none"
                />
              </motion.button>
              
              {user && (
                <motion.button 
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  variants={{
                    hover: { scale: 1.02, boxShadow: "0 20px 40px rgba(20,255,236,0.1)" },
                    tap: { scale: 0.98 }
                  }}
                  onClick={handleBuyNow}
                  className="flex-1 bg-tiffany text-white py-5 text-xs font-black uppercase tracking-[0.2em] rounded-lg hover:bg-tiffany-light transition-all shadow-xl shadow-tiffany/20 relative overflow-hidden group"
                >
                  <span className="relative z-10">Buy Now</span>
                  <motion.div 
                    variants={{
                      initial: { x: "-100%", opacity: 0 },
                      hover: { x: "200%", opacity: 1 }
                    }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none"
                  />
                </motion.button>
              )}

              <button 
                onClick={() => toggleWishlist(product)}
                className={`px-8 py-5 border rounded-lg transition-all active:scale-95 flex items-center justify-center ${
                  isFavorited ? 'border-red-500 text-red-500 bg-red-500/5' : 'border-border text-foreground hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart size={20} className={isFavorited ? "fill-current" : ""} />
              </button>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-border">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <ShieldCheck className="text-tiffany mb-3" size={24} />
                <p className="text-[10px] font-medium uppercase tracking-widest mb-1">1 Year Warranty</p>
                <p className="text-[9px] text-foreground/70 font-medium uppercase">Official Ravex Shield</p>
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <Truck className="text-tiffany mb-3" size={24} />
                <p className="text-[10px] font-medium uppercase tracking-widest mb-1">Free Shipping</p>
                <p className="text-[9px] text-foreground/70 font-medium uppercase">Across Raipur India</p>
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <RefreshCw className="text-tiffany mb-3" size={24} />
                <p className="text-[10px] font-medium uppercase tracking-widest mb-1">7 Day Replacement Policy</p>
                <p className="text-[9px] text-foreground/70 font-medium uppercase">No Questions Asked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specs Section */}
        <div className="mt-32 pt-20 border-t border-border">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-12">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { label: "Connection", value: product.specs?.connection || "Wireless / USB-C" },
              { label: "Sensor", value: product.specs?.sensor || "Ravex Pro Optical" },
              { label: "Switches", value: product.specs?.switches || "Optical Gen 3" },
              { label: "Battery Life", value: product.specs?.battery || "Up to 90 Hours" },
              { label: "Weight", value: product.specs?.weight || "62 Grams" },
              { label: "Lighting", value: product.specs?.lighting || "Sync RGB" }
            ].map((spec, i) => (
              <div key={i} className="flex justify-between items-center py-4 border-b border-border">
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/80">{spec.label}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-tiffany">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Frequently Bought Together */}
        <div className="mt-32 pt-20 border-t border-border">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-12">Frequently Bought Together</h2>
          <div className="bg-card border border-border p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-12">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-background border border-border rounded-xl p-2">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
              </div>
              <div className="text-2xl font-black text-foreground/20">+</div>
              <div className="w-24 h-24 bg-background border border-border rounded-xl p-2">
                <div className="w-full h-full flex items-center justify-center text-tiffany bg-tiffany/5 rounded-lg font-black text-[10px] text-center px-1">RAVEX SPEED PAD</div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-2">Bundle Price</p>
              <h3 className="text-3xl font-black text-tiffany">₹{(parseInt(String(product.price).replace(/,/g, '')) + 999).toLocaleString()}</h3>
            </div>
            <button 
              onClick={handleAddBundle}
              className="btn-primary py-5 px-10 whitespace-nowrap active:scale-95 transition-transform"
            >
              Add Bundle to Cart
            </button>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-32 pt-20 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Customer Reviews</h2>
              <div className="flex items-center gap-3">
                <div className="flex text-tiffany">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`w-4 h-4 ${i <= Math.round(averageRating) ? 'fill-current' : 'text-foreground/10'}`} />
                  ))}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">Based on {productReviews.length} reviews</span>
              </div>
            </div>
              <div className="relative">
                <button 
                  onClick={handleWriteReviewClick}
                  className="btn-outline py-4 px-8 text-[10px] tracking-[0.2em] uppercase"
                >
                  Write a Review
                </button>
                <AnimatePresence>
                  {reviewError && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-4 w-64 p-4 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-xl z-10"
                    >
                      {reviewError}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          {/* REVIEW MODAL */}
          <AnimatePresence>
            {isReviewModalOpen && (
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
                      <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">Thank you for your feedback!</p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-3xl font-black uppercase tracking-tighter mb-8">Rate Your Gear</h3>
                      
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
                            <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 group-hover:text-tiffany">Upload Photo</p>
                          </div>
                          <div className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-tiffany/30 cursor-pointer group transition-all">
                            <Video size={24} className="text-foreground/20 group-hover:text-tiffany" />
                            <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 group-hover:text-tiffany">Upload Video</p>
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
                          Submit Review
                        </button>
                      </form>
                    </>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {productReviews.length > 0 ? (
              productReviews.sort((a, b) => new Date(b.date) - new Date(a.date)).map((review, i) => (
                <div key={i} className="bg-card border border-border p-8 rounded-2xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest mb-1">{review.userName}</p>
                      <div className="flex text-tiffany mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-foreground/10"} />
                        ))}
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">
                      {new Date(review.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed italic">"{review.comment}"</p>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-12 text-center border border-dashed border-border rounded-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">No reviews yet. Be the first to rate this gear!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BUNDLE ADDED SUCCESS POPUP */}
      <AnimatePresence>
        {showBundleSuccess && (
          <motion.div 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] w-[90%] max-w-md"
          >
            <div className="bg-card border border-tiffany/30 p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(20,255,236,0.15)] backdrop-blur-xl flex items-center gap-6">
              <div className="h-16 w-16 bg-tiffany rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-tiffany/20">
                <CheckCircle size={32} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-tighter mb-1">Bundle Optimized</h4>
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest leading-tight">
                  {product.name} + Pro Speed Pad added to your loadout.
                </p>
              </div>
              <Link 
                to="/cart" 
                className="ml-auto p-3 bg-tiffany/10 text-tiffany rounded-xl hover:bg-tiffany hover:text-white transition-all"
              >
                <ShoppingCart size={20} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetails;
