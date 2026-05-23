import { useEffect } from 'react';

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-40 pb-20 bg-background min-h-screen">
      <div className="container-tight max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12">Privacy <span className="text-tiffany">Policy</span></h1>
        
        <div className="space-y-12 text-foreground/80 leading-relaxed font-medium text-sm md:text-base">
          <section>
            <h2 className="text-xl font-black uppercase tracking-widest text-tiffany mb-4">Data Collection</h2>
            <p>We collect information that you provide directly to us when you make a purchase, create an account, or contact us. This includes your name, email address, shipping address, and payment information.</p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-widest text-tiffany mb-4">How We Use Your Data</h2>
            <p>We use your information to process orders, provide customer support, and improve our products. We may also send you marketing communications if you have opted in to receive them.</p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-widest text-tiffany mb-4">Security</h2>
            <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-widest text-tiffany mb-4">Cookies</h2>
            <p>Our website uses cookies to enhance your browsing experience and analyze site traffic. You can choose to disable cookies through your browser settings, but this may affect site functionality.</p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-widest text-tiffany mb-4">Third-Party Services</h2>
            <p>We may share your data with trusted third-party service providers (such as payment processors and shipping carriers) only as necessary to fulfill your orders and improve our services.</p>
          </section>

          <section className="pt-10 border-t border-border">
            <p className="text-[10px] uppercase tracking-[0.3em] font-black">RAVEX GEARS | Committed to your digital privacy</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
