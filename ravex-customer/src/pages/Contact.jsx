import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="container-tight">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-16">
            <h1 className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter mb-6">
              Get in <span className="text-tiffany italic">Touch</span>
            </h1>
            <p className="text-xl text-foreground/60 max-w-2xl leading-relaxed">
              Have a question about our high-end gaming hardware? Our team is ready to help you build your ultimate setup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-tiffany/10 flex items-center justify-center text-tiffany group-hover:bg-tiffany group-hover:text-white transition-all duration-300">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/40 mb-2">Email Us</h3>
                    <p className="text-xl font-bold">tech@ravex.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-tiffany/10 flex items-center justify-center text-tiffany group-hover:bg-tiffany group-hover:text-white transition-all duration-300">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/40 mb-2">Call Us</h3>
                    <p className="text-xl font-bold">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-tiffany/10 flex items-center justify-center text-tiffany group-hover:bg-tiffany group-hover:text-white transition-all duration-300">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/40 mb-2">Office</h3>
                    <p className="text-xl font-bold leading-snug">
                      Coming<br />
                      Soon
                    </p>
                  </div>
                </div>
              </div>

              {/* Socials placeholder or more info */}
              <div className="pt-8 border-t border-border">
                <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-4">Support Hours</p>
                <p className="text-lg font-medium">Mon - Fri: 10:00 AM - 7:00 PM</p>
                <p className="text-lg font-medium text-foreground/60">Weekend: Closed</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card p-8 md:p-10 rounded-2xl border border-border">
              <form className="space-y-8">
                <div className="relative pt-3 group">
                  <input 
                    type="text" 
                    id="contact-name"
                    placeholder=" "
                    className="peer w-full bg-background border border-border px-6 py-4 rounded-xl focus:outline-none focus:border-tiffany transition-all font-medium placeholder-transparent"
                  />
                  <label 
                    htmlFor="contact-name"
                    className="absolute left-6 top-[1.1rem] text-[11px] font-bold uppercase tracking-widest text-foreground/40 transition-all peer-focus:top-0 peer-focus:text-[10px] peer-focus:font-black peer-focus:text-tiffany peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px] pointer-events-none"
                  >
                    Name
                  </label>
                </div>

                <div className="relative pt-3 group">
                  <input 
                    type="email" 
                    id="contact-email"
                    placeholder=" "
                    className="peer w-full bg-background border border-border px-6 py-4 rounded-xl focus:outline-none focus:border-tiffany transition-all font-medium placeholder-transparent"
                  />
                  <label 
                    htmlFor="contact-email"
                    className="absolute left-6 top-[1.1rem] text-[11px] font-bold uppercase tracking-widest text-foreground/40 transition-all peer-focus:top-0 peer-focus:text-[10px] peer-focus:font-black peer-focus:text-tiffany peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px] pointer-events-none"
                  >
                    Email Address
                  </label>
                </div>

                <div className="relative pt-3 group">
                  <textarea 
                    id="contact-message"
                    rows="4"
                    placeholder=" "
                    className="peer w-full bg-background border border-border px-6 py-4 rounded-xl focus:outline-none focus:border-tiffany transition-all font-medium placeholder-transparent resize-none"
                  ></textarea>
                  <label 
                    htmlFor="contact-message"
                    className="absolute left-6 top-[1.1rem] text-[11px] font-bold uppercase tracking-widest text-foreground/40 transition-all peer-focus:top-0 peer-focus:text-[10px] peer-focus:font-black peer-focus:text-tiffany peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px] pointer-events-none"
                  >
                    Your Message
                  </label>
                </div>

                <button className="w-full bg-tiffany text-white font-black uppercase tracking-[0.2em] py-5 rounded-xl hover:bg-tiffany-light transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] shadow-[0_10px_20px_rgba(10,186,181,0.15)]">
                  <span>Send Message</span>
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
