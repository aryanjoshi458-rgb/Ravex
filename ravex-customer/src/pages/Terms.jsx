import { useEffect } from 'react';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-40 pb-20 bg-background min-h-screen">
      <div className="container-tight max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12">Terms & <span className="text-tiffany">Conditions</span></h1>
        
        <div className="space-y-12 text-foreground/80 leading-relaxed font-medium text-sm md:text-base">
          <section>
            <h2 className="text-xl font-black uppercase tracking-widest text-tiffany mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using the RAVEX website and purchasing our pro-gaming gear, you agree to be bound by these Terms and Conditions. These terms apply to all visitors, users, and others who access or use our service.</p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-widest text-tiffany mb-4">2. Product Information</h2>
            <p>We strive to display our products as accurately as possible. However, we do not warrant that product descriptions or other content are accurate, complete, reliable, current, or error-free. Technical specifications are subject to change for product improvement.</p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-widest text-tiffany mb-4">3. Pricing and Payments</h2>
            <p>All prices are listed in INR (₹) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to change prices at any time. Payments must be made in full at the time of purchase through our secure payment gateways.</p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-widest text-tiffany mb-4">4. Shipping and Delivery</h2>
            <p>RAVEX offers shipping across India. Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers or customs. Risk of loss passes to you upon delivery to the carrier.</p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-widest text-tiffany mb-4">5. Intellectual Property</h2>
            <p>All content on this site, including text, graphics, logos, images, and software, is the property of RAVEX GEARS and is protected by international copyright laws. Unauthorized use of our branding is strictly prohibited.</p>
          </section>

          <section className="pt-10 border-t border-border">
            <p className="text-[10px] uppercase tracking-[0.3em] font-black">Last Updated: May 2026 | RAVEX GEARS PRIVATE LIMITED</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
