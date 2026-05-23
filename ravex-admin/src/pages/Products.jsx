import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, ChevronDown, Box, ChevronLeft, ChevronRight, X } from 'lucide-react';
import CustomCheckbox from '../components/CustomCheckbox';

const categories = ["Keyboards", "Mouse", "Headphones", "Desk Pad", "Bundles"];

// Helper to format number with commas
const formatCurrency = (val) => {
  if (!val) return "";
  const num = String(val).replace(/[^0-9]/g, "");
  return new Intl.NumberFormat('en-IN').format(num);
};

const FloatingInput = ({ label, value, onChange, type = "text", isDarkMode }) => (
  <div className="relative group w-full">
    <input 
      type={type}
      value={value}
      onChange={onChange}
      placeholder=" "
      className={`peer w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:bg-white/10' : 'bg-gray-50/50 border-gray-200 text-gray-800 focus:bg-white'} rounded-2xl pt-7 pb-3 px-6 text-sm font-bold outline-none focus:border-tiffany transition-all`}
    />
    <label className="absolute left-6 top-5 text-[10px] font-black tracking-widest text-gray-400 transition-all pointer-events-none peer-focus:top-2.5 peer-focus:text-tiffany peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-tiffany">
      {label}
    </label>
  </div>
);

const Products = () => {
  const { isDarkMode } = useOutletContext();
  const [activeView, setActiveView] = useState("list"); // list, add, edit
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "", category: "Keyboards", price: "", mrp: "", status: "STANDARD", stock: "", description: "", image: "", images: [], showDiscount: true, isLimitedOffer: false, offerEndTime: "",
    rating: "4.8",
    specs: { connection: "", sensor: "", switches: "", battery: "", weight: "", lighting: "" }
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [undoNotifications, setUndoNotifications] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/products');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const initiateDelete = (product) => {
    setDeleteConfirm(product);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    const productToDelete = deleteConfirm;
    setDeleteConfirm(null);

    // 1. Delete from DB & main list immediately
    try {
      await fetch(`http://localhost:3000/products/${productToDelete.id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      console.log(`Product ${productToDelete.id} deleted from website.`);
    } catch (error) {
      console.error("Delete failed:", error);
      return;
    }

    // 2. Set 1-minute Undo Window (60000ms)
    const timeoutId = setTimeout(() => {
      setUndoNotifications(prev => prev.filter(n => n.id !== productToDelete.id));
      console.log(`Undo window closed for ${productToDelete.name}`);
    }, 60000);

    // 3. Add to undo notifications
    setUndoNotifications(prev => [...prev, { ...productToDelete, timeoutId }]);
  };

  const handleUndo = async (notif) => {
    clearTimeout(notif.timeoutId);
    
    try {
      if (notif.isBulk) {
        // Restore all items in bulk
        await Promise.all(notif.items.map(item => 
          fetch('http://localhost:3000/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          })
        ));
        setProducts(prev => [...prev, ...notif.items]);
      } else {
        // Restore single item
        await fetch('http://localhost:3000/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notif)
        });
        setProducts(prev => [...prev, notif]);
      }
      setUndoNotifications(prev => prev.filter(n => n.id !== notif.id));
      alert(`${notif.name} restored successfully!`);
    } catch (error) {
      console.error("Restore failed:", error);
    }
  };

  const [selectedIds, setSelectedIds] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredProducts = products
    .filter(p => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = 
        p.name.toLowerCase().includes(term) || 
        (p.description && p.description.toLowerCase().includes(term)) ||
        p.category.toLowerCase().includes(term);
        
      const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => Number(b.id) - Number(a.id));

  // Pagination Logic
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]); // Clear selection on filter
  }, [searchTerm, categoryFilter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Selection Logic
  const toggleSelectAll = () => {
    if (selectedIds.length === currentItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentItems.map(p => p.id));
    }
  };

  const toggleSelectProduct = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) return;
    
    const itemsToDelete = products.filter(p => selectedIds.includes(p.id));
    const idsToRemove = [...selectedIds];

    try {
      // 1. Delete from DB immediately
      await Promise.all(idsToRemove.map(id => 
        fetch(`http://localhost:3000/products/${id}`, { method: 'DELETE' })
      ));

      // 2. Update local list
      setProducts(prev => prev.filter(p => !idsToRemove.includes(p.id)));
      setSelectedIds([]);

      // 3. Set 1-minute Undo Window
      const undoId = Date.now();
      const timeoutId = setTimeout(() => {
        setUndoNotifications(prev => prev.filter(n => n.id !== undoId));
      }, 60000);

      // 4. Add to undo notifications
      setUndoNotifications(prev => [...prev, { 
        id: undoId,
        isBulk: true,
        items: itemsToDelete,
        name: `${itemsToDelete.length} Products`,
        image: itemsToDelete[0].image,
        timeoutId 
      }]);

    } catch (error) {
      console.error("Bulk delete failed:", error);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct({ 
      ...product, 
      showDiscount: product.showDiscount !== undefined ? product.showDiscount : true,
      isLimitedOffer: product.isLimitedOffer || false,
      offerEndTime: product.offerEndTime || "",
      rating: product.rating || "4.8",
      specs: product.specs || { connection: "", sensor: "", switches: "", battery: "", weight: "", lighting: "" }
    });
    setActiveView("edit");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const sanitizedProduct = {
      ...editingProduct,
      price: String(editingProduct.price).replace(/[^0-9]/g, ''),
      mrp: String(editingProduct.mrp).replace(/[^0-9]/g, ''),
      stock: String(editingProduct.stock).replace(/[^0-9]/g, '') + " units",
      isNew: editingProduct.status === "NEW ARRIVAL",
      isFeatured: true,
      showDiscount: editingProduct.showDiscount,
      isLimitedOffer: editingProduct.isLimitedOffer,
      offerEndTime: editingProduct.offerEndTime,
      rating: editingProduct.rating,
      specs: editingProduct.specs
    };
    try {
      const response = await fetch(`http://localhost:3000/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedProduct)
      });
      if (response.ok) {
        setProducts(products.map(p => p.id === editingProduct.id ? sanitizedProduct : p));
        setActiveView("list");
        alert("Product updated successfully!");
      }
    } catch (error) { console.error("Error updating product:", error); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const productToAdd = {
      ...newProduct,
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      price: String(newProduct.price).replace(/[^0-9]/g, ''),
      mrp: String(newProduct.mrp).replace(/[^0-9]/g, ''),
      stock: String(newProduct.stock).replace(/[^0-9]/g, '') + " units",
      isNew: newProduct.status === "NEW ARRIVAL",
      isFeatured: true,
      rating: newProduct.rating || "4.8",
      showDiscount: newProduct.showDiscount,
      isLimitedOffer: newProduct.isLimitedOffer,
      offerEndTime: newProduct.offerEndTime,
      specs: newProduct.specs
    };
    try {
      const response = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productToAdd)
      });
      if (response.ok) {
        const addedProduct = await response.json();
        setProducts([...products, addedProduct]);
        setActiveView("list");
        setNewProduct({ name: "", category: "Keyboards", price: "", mrp: "", status: "STANDARD", stock: "", description: "", image: "", images: [], showDiscount: true, isLimitedOffer: false, offerEndTime: "", rating: "4.8", specs: { connection: "", sensor: "", switches: "", battery: "", weight: "", lighting: "" } });
        alert("Product published successfully!");
      }
    } catch (error) { console.error("Error adding product:", error); }
  };

  const handleImageUpload = (e, isNew = true) => {
    const file = e.target.files[0];
    if (file) {
      const mockPath = `/${file.name}`;
      if (isNew) {
        setNewProduct(prev => ({ ...prev, image: prev.image || mockPath, images: [...(prev.images || []), mockPath].slice(0, 8) }));
      } else {
        setEditingProduct(prev => ({ ...prev, image: prev.image || mockPath, images: [...(prev.images || []), mockPath].slice(0, 8) }));
      }
    }
  };

  if (activeView === "add" || activeView === "edit") {
    const isEdit = activeView === "edit";
    const data = isEdit ? editingProduct : newProduct;
    const setData = isEdit ? setEditingProduct : setNewProduct;
    const onSubmit = isEdit ? handleSave : handleAddProduct;
    const removeImage = (indexToRemove) => {
      const currentImages = data.images || [];
      const updatedImages = currentImages.filter((_, i) => i !== indexToRemove);
      const updatedMainImage = updatedImages.length > 0 ? updatedImages[0] : "";
      setData({ ...data, images: updatedImages, image: updatedMainImage });
    };

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-5xl mx-auto space-y-8 pb-20">
        <button onClick={() => setActiveView("list")} className="flex items-center gap-2 text-gray-500 hover:text-tiffany font-bold transition-all group">
          <ChevronDown size={20} className="rotate-90 group-hover:-translate-x-1 transition-transform" />
          Back to Products List
        </button>

        <div className={`${isDarkMode ? 'bg-[#1a2235] border-white/10 shadow-black/40' : 'bg-white border-gray-200 shadow-gray-100'} rounded-[2.5rem] border shadow-2xl overflow-hidden`}>
          <div className="p-10 md:p-14 space-y-12">
            <div>
              <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>{isEdit ? "Edit Product" : "Add New Product"}</h2>
              <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'} font-medium mt-2 text-lg`}>Detailed configuration for your gear.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-10">
              <div className="space-y-4">
                <label className="text-[11px] font-black tracking-widest text-gray-400 ml-1">Product Gallery (Multiple Slots)</label>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                  {(data.images || []).map((img, i) => (
                    <div key={i} className="group relative aspect-square rounded-2xl border border-tiffany bg-tiffany/5 flex items-center justify-center overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-contain p-2" />
                      <button 
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90 shadow-lg shadow-red-200"
                      >
                        <X size={12} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-tiffany hover:bg-tiffany/5 cursor-pointer flex items-center justify-center transition-all group">
                    <Plus size={24} className="text-gray-300 group-hover:text-tiffany" />
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, !isEdit)} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FloatingInput isDarkMode={isDarkMode} label="Product Name" value={data.name} onChange={(e) => setData({...data, name: e.target.value})} />
                <div className="relative group w-full">
                  <select 
                    value={data.category} 
                    onChange={(e) => setData({...data, category: e.target.value})} 
                    style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
                    className={`peer w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'} rounded-2xl pt-7 pb-3 px-6 text-sm font-bold outline-none focus:border-tiffany focus:bg-transparent transition-all appearance-none cursor-pointer`}
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <label className="absolute left-6 top-2.5 text-[10px] font-black tracking-widest text-tiffany">Category Selection</label>
                  <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FloatingInput isDarkMode={isDarkMode} label="Price (₹)" value={formatCurrency(data.price)} onChange={(e) => setData({...data, price: e.target.value.replace(/[^0-9]/g, '')})} />
                <FloatingInput isDarkMode={isDarkMode} label="MRP (₹)" value={formatCurrency(data.mrp)} onChange={(e) => setData({...data, mrp: e.target.value.replace(/[^0-9]/g, '')})} />
              </div>

              <div className={`flex items-center justify-between p-6 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'} rounded-2xl border`}>
                <div>
                  <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Show Discount Badge</p>
                  <p className="text-[11px] text-gray-400 font-medium">Toggle visibility of "Save %" badge on storefront.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={data.showDiscount} onChange={(e) => setData({...data, showDiscount: e.target.checked})} className="sr-only peer" />
                  <div className={`w-14 h-7 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-tiffany`}></div>
                </label>
              </div>

              <div className={`p-8 ${isDarkMode ? 'bg-orange-500/5 border-orange-500/20' : 'bg-orange-50/30 border-orange-100'} border-2 border-dashed rounded-[2rem] space-y-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange-100 rounded-xl text-orange-600">🔥</div>
                    <div>
                      <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>Limited Time Offer</p>
                      <p className="text-[11px] text-gray-500 font-medium italic">Create urgency with a live countdown timer.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={data.isLimitedOffer} onChange={(e) => setData({...data, isLimitedOffer: e.target.checked})} className="sr-only peer" />
                    <div className={`w-14 h-7 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-orange-500`}></div>
                  </label>
                </div>

                {data.isLimitedOffer && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: "+1 Hour", value: 1 },
                        { label: "+6 Hours", value: 6 },
                        { label: "+24 Hours", value: 24 },
                        { label: "+48 Hours", value: 48 }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            const now = new Date();
                            now.setHours(now.getHours() + preset.value);
                            // Format to YYYY-MM-DDThh:mm
                            const formatted = now.toISOString().slice(0, 16);
                            setData({ ...data, offerEndTime: formatted });
                          }}
                          className="py-3 px-4 bg-white border border-orange-100 rounded-xl text-[10px] font-black tracking-widest text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-sm"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative group w-full">
                      <input 
                        type="datetime-local" 
                        value={data.offerEndTime} 
                        onChange={(e) => setData({...data, offerEndTime: e.target.value})}
                        className="peer w-full bg-white border-2 border-orange-100 rounded-2xl pt-8 pb-4 px-6 text-sm font-bold text-gray-700 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all appearance-none"
                      />
                      <label className="absolute left-6 top-3 text-[10px] font-black tracking-widest text-orange-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                        Custom End Date & Time
                      </label>
                    </div>
                    
                    <p className="text-[11px] text-orange-600 font-bold px-2 flex items-center gap-2 bg-orange-50 py-3 rounded-xl border border-orange-100">
                      <span className="text-sm">⚡</span>
                      Limited offer countdown will start immediately after publishing.
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="relative group w-full">
                  <select 
                    value={data.status} 
                    onChange={(e) => setData({...data, status: e.target.value})} 
                    style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
                    className={`peer w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'} rounded-2xl pt-7 pb-3 px-6 text-sm font-bold outline-none focus:border-tiffany focus:bg-transparent transition-all appearance-none cursor-pointer`}
                  >
                    <option value="NEW ARRIVAL">NEW ARRIVAL</option>
                    <option value="STANDARD">STANDARD</option>
                  </select>
                  <label className="absolute left-6 top-2.5 text-[10px] font-black tracking-widest text-tiffany">Status</label>
                  <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <FloatingInput isDarkMode={isDarkMode} label="Stock Count" value={String(data.stock).replace(/[^0-9]/g, '')} onChange={(e) => setData({...data, stock: e.target.value.replace(/[^0-9]/g, '')})} />
                <FloatingInput isDarkMode={isDarkMode} label="Rating (e.g. 4.8)" value={data.rating} onChange={(e) => setData({...data, rating: e.target.value})} />
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-black tracking-widest text-gray-400 ml-1">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FloatingInput isDarkMode={isDarkMode} label="Connection" value={data.specs?.connection || ""} onChange={(e) => setData({...data, specs: { ...data.specs, connection: e.target.value }})} />
                  <FloatingInput isDarkMode={isDarkMode} label="Sensor" value={data.specs?.sensor || ""} onChange={(e) => setData({...data, specs: { ...data.specs, sensor: e.target.value }})} />
                  <FloatingInput isDarkMode={isDarkMode} label="Switches" value={data.specs?.switches || ""} onChange={(e) => setData({...data, specs: { ...data.specs, switches: e.target.value }})} />
                  <FloatingInput isDarkMode={isDarkMode} label="Battery Life" value={data.specs?.battery || ""} onChange={(e) => setData({...data, specs: { ...data.specs, battery: e.target.value }})} />
                  <FloatingInput isDarkMode={isDarkMode} label="Weight" value={data.specs?.weight || ""} onChange={(e) => setData({...data, specs: { ...data.specs, weight: e.target.value }})} />
                  <FloatingInput isDarkMode={isDarkMode} label="Lighting" value={data.specs?.lighting || ""} onChange={(e) => setData({...data, specs: { ...data.specs, lighting: e.target.value }})} />
                </div>
              </div>

              <div className="relative group w-full">
                <textarea 
                  rows="5" 
                  value={data.description} 
                  onChange={(e) => setData({...data, description: e.target.value})} 
                  placeholder=" " 
                  className={`peer w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:bg-white/10' : 'bg-gray-50 border-gray-200 text-gray-700 focus:bg-white'} rounded-2xl pt-7 pb-3 px-6 text-sm font-bold outline-none focus:border-tiffany transition-all resize-none`}
                ></textarea>
                <label className="absolute left-6 top-5 text-[10px] font-black tracking-widest text-gray-400 transition-all pointer-events-none peer-focus:top-2.5 peer-focus:text-tiffany peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-tiffany">Product Description</label>
              </div>

              <div className="flex gap-6 pt-6">
                <button type="button" onClick={() => setActiveView("list")} className={`flex-1 ${isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} font-bold py-6 rounded-2xl transition-all tracking-widest text-xs`}>Cancel</button>
                <button type="submit" className="flex-1 bg-tiffany text-white font-bold py-6 rounded-2xl shadow-2xl shadow-tiffany/20 hover:scale-[1.02] active:scale-[0.98] transition-all tracking-widest text-xs">
                  {isEdit ? "Update Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-10 font-gaming relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-[28px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>Products Management</h1>
          <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-600'} font-semibold mt-1`}>Manage your store's inventory, pricing, and details.</p>
        </div>
        <button 
          onClick={() => setActiveView("add")}
          className="bg-tiffany text-white font-bold px-8 py-4 rounded-2xl flex items-center gap-2 shadow-xl shadow-tiffany/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={20} />
          Add New Product
        </button>
      </div>

      <div className={`${isDarkMode ? 'bg-[#1a2235] border-white/5' : 'bg-white border-gray-200'} rounded-lg border shadow-sm overflow-hidden space-y-0`}>
        {/* Bulk Action Bar */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-tiffany/5 border-b border-tiffany/20 px-8 py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-tiffany text-white flex items-center justify-center font-black text-sm shadow-lg shadow-tiffany/20">
                  {selectedIds.length}
                </span>
                <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Products Selected</p>
              </div>
              <button 
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-500 text-white text-[11px] font-black tracking-widest rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-200"
              >
                <Trash2 size={14} />
                Delete Selected
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search inventory..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-11 pr-4 py-2.5 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50/50 border-gray-200 text-gray-800'} rounded-lg text-[13px] font-bold outline-none focus:border-tiffany transition-all`}
                />
              </div>
              
              <div className="relative">
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
                  className={`appearance-none pl-4 pr-10 py-2.5 ${isDarkMode ? 'bg-[#1a2235] border-white/10 text-white focus:bg-white/10' : 'bg-gray-50/50 border-gray-200 text-gray-800 focus:bg-white'} rounded-lg text-[13px] font-bold outline-none focus:border-tiffany transition-all cursor-pointer min-w-[160px]`}
                >
                  <option value="All" className={isDarkMode ? 'bg-[#1a2235]' : ''}>All Categories</option>
                  {categories.map(c => <option key={c} value={c} className={isDarkMode ? 'bg-[#1a2235]' : ''}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'} rounded-xl border`}>
                <div className="w-2 h-2 bg-tiffany rounded-full animate-pulse" />
                <span className="text-[11px] font-black text-gray-400 tracking-widest">Inventory:</span>
                <span className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{products.length} Items</span>
              </div>
              
              {products.some(p => parseInt(p.stock) < 5) && (
                <div className={`flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl`}>
                  <AlertCircle size={14} className="text-red-500 animate-bounce" />
                  <span className="text-[11px] font-black text-red-500 tracking-widest">Low Stock:</span>
                  <span className="text-sm font-black text-red-500">{products.filter(p => parseInt(p.stock) < 5).length} Alerts</span>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`text-left border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                  <th className="pb-6 w-[5%] px-4">
                    <CustomCheckbox 
                      id="select-all"
                      checked={selectedIds.length === currentItems.length && currentItems.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className={`pb-6 text-[11px] font-black tracking-widest ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} w-[35%]`}>Product</th>
                  <th className={`pb-6 text-[11px] font-black tracking-widest ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} w-[15%]`}>Category</th>
                  <th className={`pb-6 text-[11px] font-black tracking-widest ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} w-[15%]`}>Price (MRP)</th>
                  <th className={`pb-6 text-[11px] font-black tracking-widest ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} w-[10%]`}>Stock</th>
                  <th className={`pb-6 text-[11px] font-black tracking-widest ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} w-[15%]`}>Status</th>
                  <th className={`pb-6 text-[11px] font-black tracking-widest ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} text-right w-[5%]`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {currentItems.map((p) => (
                    <motion.tr 
                      key={p.id} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className={`group transition-colors ${selectedIds.includes(p.id) ? (isDarkMode ? 'bg-tiffany/10' : 'bg-tiffany/5') : (isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50')}`}
                    >
                      <td className="py-5 px-4">
                        <CustomCheckbox 
                          id={`product-${p.id}`}
                          checked={selectedIds.includes(p.id)}
                          onChange={() => toggleSelectProduct(p.id)}
                        />
                      </td>
                    <td className="py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'} border flex items-center justify-center p-2 group-hover:border-tiffany transition-colors overflow-hidden`}>
                          <img src={p.image} alt="" className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-[14px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} truncate`}>{p.name}</p>
                          <p className="text-[11px] text-gray-400 font-medium mt-0.5 line-clamp-1">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5"><span className={`text-[11px] font-black tracking-widest ${isDarkMode ? 'text-gray-400 bg-white/5 border-white/10' : 'text-gray-500 bg-gray-50 border-gray-100'} px-2.5 py-1 rounded-lg border whitespace-nowrap`}>{p.category}</span></td>
                    <td className="py-5">
                      <div className="whitespace-nowrap">
                        <p className={`text-[14px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>₹{formatCurrency(p.price)}</p>
                        <p className="text-[11px] text-gray-400 font-bold line-through">₹{formatCurrency(p.mrp)}</p>
                      </div>
                    </td>
                    <td className="py-5">
                      <div className="flex flex-col gap-1">
                        <span className={`text-[13px] font-black ${parseInt(p.stock) < 5 ? 'text-red-500' : (isDarkMode ? 'text-gray-300' : 'text-gray-600')}`}>
                          {p.stock}
                        </span>
                        {parseInt(p.stock) < 5 && (
                          <span className="text-[8px] font-black uppercase tracking-tighter text-red-500/80 bg-red-500/5 px-1.5 py-0.5 rounded border border-red-500/10 w-fit">Refill Soon</span>
                        )}
                      </div>
                    </td>
                    <td className="py-5">
                      <span className={`text-[9px] font-black tracking-widest px-3 py-1.5 rounded-full border shadow-sm whitespace-nowrap inline-block ${p.status === "NEW ARRIVAL" ? "bg-tiffany/5 text-tiffany border-tiffany/20" : "bg-gray-50 text-gray-400 border-gray-200"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEditClick(p)} className="p-2 text-gray-400 hover:text-tiffany hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all"><Edit size={16} /></button>
                        <button onClick={() => initiateDelete(p)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="py-10 flex items-center justify-center border-t border-gray-100 bg-gray-50/20">
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className={`p-3 rounded-2xl border transition-all ${
                  currentPage === 1 ? 'border-gray-100 text-gray-200 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:border-tiffany hover:bg-tiffany/5 hover:text-tiffany active:scale-90'
                }`}
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-1.5 bg-gray-100/50 p-1.5 rounded-[1.5rem] border border-gray-200/50">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <motion.button 
                    key={i + 1}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative w-11 h-11 rounded-xl text-[12px] font-black transition-all ${
                      currentPage === i + 1 
                        ? 'text-white' 
                        : 'text-gray-400 hover:text-gray-600 hover:bg-white'
                    }`}
                  >
                    <span className="relative z-10">{i + 1}</span>
                    {currentPage === i + 1 && (
                      <motion.div 
                        layoutId="activePage"
                        className="absolute inset-0 bg-tiffany rounded-xl shadow-lg shadow-tiffany/30"
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className={`p-3 rounded-2xl border transition-all ${
                  currentPage === totalPages ? 'border-gray-100 text-gray-200 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:border-tiffany hover:bg-tiffany/5 hover:text-tiffany active:scale-90'
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="p-10 text-center space-y-6">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                  <Trash2 size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Delete Product?</h3>
                  <p className="text-gray-500 mt-2 font-medium">Are you sure you want to delete <span className="text-gray-800 font-bold">"{deleteConfirm.name}"</span>? This will sync to the live website.</p>
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all tracking-widest text-[10px]">No, Keep it</button>
                  <button onClick={confirmDelete} className="flex-1 py-4 bg-red-500 text-white font-bold rounded-2xl shadow-xl shadow-red-200 hover:bg-red-600 transition-all tracking-widest text-[10px]">Yes, Delete</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Undo Notifications Stack */}
      <div className="fixed bottom-10 right-10 z-[300] space-y-4">
        <AnimatePresence>
          {undoNotifications.map((notif) => (
            <UndoToast key={notif.id} notif={notif} onUndo={handleUndo} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const UndoToast = ({ notif, onUndo }) => {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50, scale: 0.9 }} 
      animate={{ opacity: 1, x: 0, scale: 1 }} 
      exit={{ opacity: 0, x: 50, scale: 0.9 }} 
      className="bg-gray-900/95 backdrop-blur-xl border border-white/10 text-white p-6 rounded-[2rem] shadow-2xl flex flex-col gap-4 min-w-[380px] overflow-hidden relative"
    >
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
          <img src={notif.image} alt="" className="max-w-full max-h-full object-contain p-1" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold truncate">"{notif.name}" Deleted</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <p className="text-[10px] text-gray-400 font-bold tracking-widest">Permanent in {seconds}s</p>
          </div>
        </div>
        <button 
          onClick={() => onUndo(notif)} 
          className="px-6 py-2.5 bg-tiffany text-white text-[11px] font-black tracking-widest rounded-full hover:scale-105 transition-all shadow-lg shadow-tiffany/20 whitespace-nowrap"
        >
          Undo
        </button>
      </div>

      {/* Animated Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1.5 bg-white/5 w-full">
        <motion.div 
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: 60, ease: "linear" }}
          className="h-full bg-tiffany shadow-[0_0_15px_rgba(20,255,236,0.5)]"
        />
      </div>
    </motion.div>
  );
};

export default Products;
