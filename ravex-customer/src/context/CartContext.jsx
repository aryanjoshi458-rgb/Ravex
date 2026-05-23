import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shouldOpenCheckout, setShouldOpenCheckout] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Determine the storage key based on current auth state
  const storageKey = useMemo(() => {
    return `ravex-cart-${user?.mobile || 'guest'}`;
  }, [user?.mobile]);

  // Handle cart merging on login and basic loading
  useEffect(() => {
    if (user) {
      // Transitioning to a user account (Login)
      const guestKey = 'ravex-cart-guest';
      const guestCartJson = localStorage.getItem(guestKey);
      const guestCart = guestCartJson ? JSON.parse(guestCartJson) : [];

      const userKey = `ravex-cart-${user.mobile}`;
      const userCartJson = localStorage.getItem(userKey);
      const userCart = userCartJson ? JSON.parse(userCartJson) : [];

      if (guestCart.length > 0) {
        // Professional Merge: Guest items move to user account
        const mergedCart = [...userCart, ...guestCart];
        localStorage.setItem(userKey, JSON.stringify(mergedCart));
        localStorage.removeItem(guestKey); // Clear guest session
        setCart(mergedCart);
      } else {
        setCart(userCart);
      }
    } else {
      // Transitioning to guest (Logout)
      const savedCart = localStorage.getItem(storageKey); // 'ravex-cart-guest'
      setCart(savedCart ? JSON.parse(savedCart) : []);
    }
  }, [user, storageKey]);

  // Persist current cart to the specific storage key (for additions/removals)
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart, storageKey]);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const index = prevCart.findIndex((item) => item.id === productId);
      if (index !== -1) {
        const newCart = [...prevCart];
        newCart.splice(index, 1);
        return newCart;
      }
      return prevCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const applyCoupon = async (code) => {
    try {
      const res = await fetch(`http://localhost:3000/coupons?code=${code.toUpperCase()}`);
      const data = await res.json();
      const coupon = data[0];

      if (coupon && coupon.status === 'active') {
        if (subtotal >= (coupon.minOrder || 0)) {
          setAppliedCoupon(coupon);
          return { success: true, message: 'Coupon applied!' };
        } else {
          return { success: false, message: `Minimum order ₹${coupon.minOrder} required.` };
        }
      } else {
        return { success: false, message: 'Invalid or expired coupon.' };
      }
    } catch (err) {
      return { success: false, message: 'Error validating coupon.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const [storeSettings, setStoreSettings] = useState({ shippingFee: 0, freeShippingThreshold: 5000 });

  useEffect(() => {
    fetch('http://localhost:3000/settings')
      .then(res => res.json())
      .then(data => setStoreSettings(data))
      .catch(err => console.error("Error fetching settings in cart:", err));
  }, []);

  // Fix: Strip commas from price strings before calculating total
  const subtotal = cart.reduce((total, item) => {
    const price = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/,/g, '')) 
      : item.price;
    return total + (isNaN(price) ? 0 : price);
  }, 0);

  // Calculate discount based on applied coupon
  useEffect(() => {
    if (appliedCoupon) {
      let amount = 0;
      if (appliedCoupon.type === 'percentage') {
        amount = (subtotal * appliedCoupon.value) / 100;
      } else {
        amount = appliedCoupon.value;
      }
      setDiscountAmount(amount);
    } else {
      setDiscountAmount(0);
    }
  }, [appliedCoupon, subtotal]);

  const shipping = subtotal >= storeSettings.freeShippingThreshold ? 0 : storeSettings.shippingFee;
  const cartTotal = (subtotal + shipping - discountAmount).toLocaleString('en-IN', {
    maximumFractionDigits: 0
  });

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, clearCart, cartTotal, isCartOpen, setIsCartOpen,
      shouldOpenCheckout, setShouldOpenCheckout, subtotal, shipping, storeSettings,
      appliedCoupon, applyCoupon, removeCoupon, discountAmount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
