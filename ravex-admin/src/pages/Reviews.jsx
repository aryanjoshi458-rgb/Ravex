import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Search, Star, Trash2, ChevronLeft, ChevronRight, MessageSquare, User, Package } from 'lucide-react';

const Reviews = () => {
  const { isDarkMode } = useOutletContext();
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchData = async () => {
    try {
      const [reviewsRes, productsRes] = await Promise.all([
        fetch('http://localhost:3000/reviews'),
        fetch('http://localhost:3000/products')
      ]);
      if (!reviewsRes.ok || !productsRes.ok) throw new Error("Failed to fetch");
      
      const reviewsData = await reviewsRes.json();
      const productsData = await productsRes.json();
      
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const response = await fetch(`http://localhost:3000/reviews/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setReviews(prev => prev.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const getProductName = (id) => {
    const product = products.find(p => String(p.id) === String(id));
    return product ? product.name : "Unknown Product";
  };

  const getProductImage = (id) => {
    const product = products.find(p => String(p.id) === String(id));
    return product ? product.image : "";
  };

  const filteredReviews = reviews.filter(r => {
    const comment = r.comment || "";
    const userName = r.userName || "";
    const productName = getProductName(r.productId);
    const term = searchTerm.toLowerCase();
    
    return comment.toLowerCase().includes(term) ||
           userName.toLowerCase().includes(term) ||
           productName.toLowerCase().includes(term);
  }).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-tiffany/20 border-t-tiffany rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 font-gaming">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-[28px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>Customer Reviews</h1>
          <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-600'} font-semibold mt-1`}>Manage product ratings and customer feedback.</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 ${isDarkMode ? 'bg-[#1a2235] border-white/5' : 'bg-white border-gray-200'} rounded-lg shadow-sm border`}>
          <div className="w-2 h-2 bg-tiffany rounded-full animate-pulse" />
          <span className="text-[11px] font-black text-gray-400 tracking-widest">Total:</span>
          <span className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{reviews.length} Reviews</span>
        </div>
      </div>

      <div className={`${isDarkMode ? 'bg-[#1a2235] border-white/5' : 'bg-white border-gray-200'} rounded-lg border shadow-sm overflow-hidden p-8 space-y-8`}>
        <div className="relative max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search reviews, products, users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50/50 border-gray-200 text-gray-800'} rounded-lg text-[13px] font-bold outline-none focus:border-tiffany transition-all`}
          />
        </div>

        {filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {currentItems.map((review) => (
                <motion.div 
                  key={review.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-gray-100 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-gray-100 transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-tiffany/10 flex items-center justify-center text-tiffany overflow-hidden">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-[13px] font-black tracking-tight">{review.userName || "Anonymous"}</p>
                        <p className="text-[10px] text-gray-400 font-bold tracking-widest">{review.date ? new Date(review.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={1.5} className={i < review.rating ? "" : "text-gray-200"} />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-6 border border-gray-100">
                    <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg p-1 shrink-0 overflow-hidden">
                      <img src={getProductImage(review.productId)} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 font-black tracking-[0.2em] mb-0.5">Product</p>
                      <p className="text-[11px] font-bold text-gray-800 truncate">{getProductName(review.productId)}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <MessageSquare size={16} className="text-tiffany shrink-0 mt-1" />
                      <p className="text-sm text-gray-600 font-medium leading-relaxed italic line-clamp-3">
                        "{review.comment || "No comment provided."}"
                      </p>
                    </div>
                    
                    <div className="flex justify-end pt-2">
                      <button 
                        onClick={() => handleDelete(review.id)}
                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
            <Star size={40} className="mx-auto text-gray-200 mb-4" />
            <p className="text-sm font-bold text-gray-400">No reviews found matching your search.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-8">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-3 rounded-xl border border-gray-200 disabled:opacity-30 hover:border-tiffany transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2 px-4 bg-gray-50 rounded-xl text-xs font-black">
              {currentPage} / {totalPages}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-3 rounded-xl border border-gray-200 disabled:opacity-30 hover:border-tiffany transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
