import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import CursorEffect from './components/CursorEffect';
import Loader from './components/Loader';
import Contact from './pages/Contact';
import Warranty from './pages/Warranty';
import Downloads from './pages/Downloads';
import FAQ from './pages/FAQ';
import TrackOrder from './pages/TrackOrder';
import Comparison from './pages/Comparison';
import Customizer from './pages/Customizer';
import Orders from './pages/Orders';
import Addresses from './pages/Addresses';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { useEffect } from 'react';
import './styles/global.css';

function App() {
  useEffect(() => {
    // Track first visit time for auto-expiring badges
    const firstVisit = localStorage.getItem('ravex_first_visit');
    if (!firstVisit) {
      localStorage.setItem('ravex_first_visit', Date.now().toString());
    }
  }, []);

  return (
    <ThemeProvider>
      <ProductProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Router>
                <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                  {/* <Loader /> */}
                  <CursorEffect />
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/warranty" element={<Warranty />} />
                    <Route path="/downloads" element={<Downloads />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/track-order" element={<TrackOrder />} />
                    <Route path="/compare" element={<Comparison />} />
                    <Route path="/customizer" element={<Customizer />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/addresses" element={<Addresses />} />
                  </Routes>
                  <Footer />
                </div>
              </Router>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ProductProvider>
    </ThemeProvider>
  );
}

export default App;
