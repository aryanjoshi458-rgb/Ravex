import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle, Shield, Truck, CreditCard } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: "Warranty", icon: <Shield size={18} /> },
    { name: "Shipping", icon: <Truck size={18} /> },
    { name: "Payment", icon: <CreditCard size={18} /> }
  ];

  const faqs = [
    { q: "How long is the warranty period?", a: "Most Ravex products come with a 1-year limited warranty covering manufacturing defects.", category: "Warranty" },
    { q: "How do I claim warranty?", a: "Visit our Warranty page, fill the form with your invoice, and our team will guide you through the RMA process.", category: "Warranty" },
    { q: "What is the delivery time?", a: "Standard delivery takes 3-5 business days across India. Express shipping is available in select cities.", category: "Shipping" },
    { q: "Can I pay via EMI?", a: "Yes, we support major credit card EMIs and No-cost EMI options at checkout.", category: "Payment" }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20 min-h-screen bg-background">
      <div className="container-tight max-w-3xl mx-auto">
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter mb-6">
            Got <span className="text-tiffany italic">Questions?</span>
          </h1>
          <p className="text-xl text-foreground/60 leading-relaxed">
            Everything you need to know about your gear and our service.
          </p>
        </div>

        <div className="relative mb-12">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20" size={20} />
          <input 
            type="text" 
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border py-6 px-16 rounded-2xl outline-none focus:border-tiffany transition-all font-bold uppercase tracking-widest text-xs"
          />
        </div>

        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className={`border rounded-2xl transition-all duration-300 ${
                  isOpen ? 'bg-card border-tiffany/30' : 'bg-transparent border-border hover:border-foreground/20'
                }`}
              >
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                >
                  <span className="text-lg font-black tracking-tight uppercase">{faq.q}</span>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    <ChevronDown size={20} className={isOpen ? 'text-tiffany' : 'text-foreground/20'} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 md:px-8 pb-8 text-foreground/60 leading-relaxed font-medium">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
