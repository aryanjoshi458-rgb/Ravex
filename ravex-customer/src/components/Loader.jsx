import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Logo from './Logo';

const Loader = () => {
  const loaderRef = useRef(null);
  const logoRef = useRef(null);
  const progressContainerRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (loaderRef.current) {
          loaderRef.current.style.display = 'none';
        }
      }
    });

    // 1. Logo fades and scales in
    tl.to(logoRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: 'power4.out',
    })
    // 2. Progress container appears
    .to(progressContainerRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    }, "-=0.5")
    // 3. Progress bar fills with high visibility
    .to(progressRef.current, {
      width: '100%',
      duration: 2,
      ease: 'power3.inOut',
    })
    // 4. Everything slides up professionally
    .to(loaderRef.current, {
      y: '-100%',
      duration: 1.2,
      ease: 'expo.inOut',
      delay: 0.2,
    });
  }, []);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
    >
      <div className="relative flex flex-col items-center">
        {/* Professional Branding */}
        <div 
          ref={logoRef} 
          className="opacity-0 translate-y-8 scale-95 transition-all"
        >
          <Logo className="h-12 md:h-16" />
        </div>
        
        {/* Enhanced Progress Bar - Moved Up */}
        <div 
          ref={progressContainerRef}
          className="mt-6 w-48 h-[2px] bg-foreground/10 rounded-full overflow-hidden opacity-0"
        >
          <div 
            ref={progressRef} 
            className="h-full w-0 bg-tiffany shadow-[0_0_15px_rgba(10,186,181,0.8)]"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
