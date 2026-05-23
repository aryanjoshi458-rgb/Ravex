import { Link } from 'react-router-dom';
import { Mail, Globe, Share2, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { user, setShowLoginDrawer } = useAuth();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: <InstagramIcon />, href: "https://instagram.com", label: "Instagram" },
    { icon: <TwitterIcon />, href: "https://twitter.com", label: "Twitter" },
    { icon: <LinkedinIcon />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <YoutubeIcon />, href: "https://youtube.com", label: "YouTube" }
  ];

  return (
    <footer className="bg-background border-t border-border pt-20 pb-10">
      <div className="container-tight">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-12 mb-20">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link 
              to="/" 
              onClick={scrollToTop}
              className="inline-block"
            >
              <Logo className="h-6" />
            </Link>
            <p className="text-foreground/90 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed">
              Dominate Every Key <br/><br/>
              Control the Game <br /><br/>
              Control Everything. <br />
            </p>
          </div>

          {/* Collection */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-foreground/50">Collection</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-foreground/90">
              <li><Link to="/shop?category=Keyboards" onClick={scrollToTop} className="hover:text-tiffany transition-colors nav-bracket">Keyboards</Link></li>
              <li><Link to="/shop?category=Mouse" onClick={scrollToTop} className="hover:text-tiffany transition-colors nav-bracket">Mouse</Link></li>
              <li><Link to="/shop?category=Headphones" onClick={scrollToTop} className="hover:text-tiffany transition-colors nav-bracket">Headphones</Link></li>
              <li><Link to="/shop?category=Desk Pad" onClick={scrollToTop} className="hover:text-tiffany transition-colors nav-bracket">Desk Pad</Link></li>
              <li><Link to="/shop?category=Gamer Bundle Packs" onClick={scrollToTop} className="hover:text-tiffany transition-colors nav-bracket">Gamer Bundle Packs</Link></li>
            </ul>
          </div>

          {/* Customer Hub */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-foreground/50">Customer Hub</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-foreground/90">
              <li>
                {user ? (
                  <Link to="/orders" onClick={scrollToTop} className="hover:text-tiffany transition-colors nav-bracket">ORDER HISTORY</Link>
                ) : (
                  <button 
                    onClick={() => {
                      setShowLoginDrawer(true);
                      scrollToTop();
                    }} 
                    className="hover:text-tiffany transition-colors nav-bracket text-left"
                  >
                    ORDER HISTORY
                  </button>
                )}
              </li>
              <li>
                <Link to="/track-order" onClick={scrollToTop} className="hover:text-tiffany transition-colors nav-bracket">Track Order</Link>
              </li>
              <li><Link to="/faq" onClick={scrollToTop} className="hover:text-tiffany transition-colors nav-bracket">FAQ</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-foreground/50">Support</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-foreground/90">
              <li><Link to="/downloads" onClick={scrollToTop} className="hover:text-tiffany transition-colors nav-bracket">Downloads</Link></li>
              <li><Link to="/warranty" onClick={scrollToTop} className="hover:text-tiffany transition-colors nav-bracket">Warranty</Link></li>
              <li><Link to="/contact" onClick={scrollToTop} className="hover:text-tiffany transition-colors nav-bracket">Contact</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-foreground/50">Social</h4>
            <div className="flex flex-wrap items-center gap-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, scale: 1.1 }}
                   className="text-foreground/70 hover:text-tiffany transition-colors duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-175 text-[9px] font-bold uppercase tracking-widest text-foreground/80 md:pl-6">
            <Link 
              to="/" 
              onClick={scrollToTop}
              className="hover:text-tiffany transition-colors tracking-[0.3em]"
            >
              &copy; {currentYear} RAVEX Pvt
            </Link>
            <div className="flex items-center gap-0">
              <Link to="/terms" onClick={scrollToTop} className="hover:text-tiffany transition-colors nav-bracket">Terms</Link>
              <Link to="/privacy" onClick={scrollToTop} className="hover:text-tiffany transition-colors nav-bracket">Privacy</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[9px] font-black tracking-[0.3em] text-foreground/70 italic">
            <span>RAIPUR INDIA</span>
            <div className="w-8 h-[1px] bg-foreground/40"></div>
            <span>EST 2024</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
);
const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
);

export default Footer;
