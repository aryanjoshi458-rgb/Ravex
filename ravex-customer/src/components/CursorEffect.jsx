import { useEffect, useRef } from 'react';

const CursorEffect = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;

    const moveCursor = (e) => {
      const { clientX: x, clientY: y } = e;
      
      // Main cursor follow with smooth delay
      cursor.animate(
        {
          left: `${x}px`,
          top: `${y}px`,
        },
        { duration: 500, fill: 'forwards' }
      );

      // Dot follow immediate
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <>
      {/* Outer Circle - Tiffany Glow */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[1000] h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-tiffany/40 pointer-events-none transition-transform duration-150 ease-out hidden md:block"
        style={{ 
          boxShadow: '0 0 20px rgba(10, 186, 181, 0.15)',
          backdropFilter: 'blur(1px)'
        }}
      ></div>
      {/* Inner Dot - Solid Tiffany */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[1000] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-tiffany pointer-events-none hidden md:block"
        style={{ 
          boxShadow: '0 0 15px rgba(10, 186, 181, 0.8)' 
        }}
      ></div>
    </>
  );
};

export default CursorEffect;
