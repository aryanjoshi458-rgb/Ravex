import { useState } from 'react';
import ProductCard from './ProductCard';
import QuickView from './QuickView';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const FeaturedProducts = () => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const { setIsQuickViewOpen } = useAuth();
  const { products } = useProducts();

  const sortedProducts = [...products].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onQuickView={(p) => {
              setQuickViewProduct(p);
              setIsQuickViewOpen(true);
            }}
          />
        ))}
      </div>
      <AnimatePresence>
        {quickViewProduct && (
          <QuickView 
            product={quickViewProduct} 
            onClose={() => {
              setQuickViewProduct(null);
              setIsQuickViewOpen(false);
            }} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default FeaturedProducts;
