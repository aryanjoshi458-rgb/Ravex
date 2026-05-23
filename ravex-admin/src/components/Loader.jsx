import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Logo from './Logo';

const Loader = ({ onComplete }) => {
  const loaderRef = useRef(null);
  const logoRef = useRef(null);
  const progressContainerRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // 1. Logo fades and scales in
    tl.to(logoRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power4.out',
    })
    // 2. Progress container appears
    .to(progressContainerRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    }, "-=0.4")
    // 3. Progress bar fills
    .to(progressRef.current, {
      width: '100%',
      duration: 1.5,
      ease: 'power3.inOut',
    })
    // 4. Everything slides up professionally
    .to(loaderRef.current, {
      y: '-100%',
      duration: 1,
      ease: 'expo.inOut',
      delay: 0.1,
    });
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
    >
      <div className="relative flex flex-col items-center">
        <div 
          ref={logoRef} 
          className="opacity-0 translate-y-8 scale-95"
        >
          <Logo className="h-16" />
        </div>
        
        <div 
          ref={progressContainerRef}
          className="mt-8 w-48 h-[2px] bg-gray-100 rounded-full overflow-hidden opacity-0"
        >
          <div 
            ref={progressRef} 
            className="h-full w-0 bg-tiffany shadow-[0_0_15px_rgba(10,186,181,0.5)]"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
