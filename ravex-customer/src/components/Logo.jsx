import { motion } from "framer-motion";

const Logo = ({ className = "h-8", iconOnly = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Original Stylized "R" Brand Mark */}
      {/* <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        <path 
          d="M25 20H55C70 20 80 30 80 42.5C80 55 70 65 55 65H40V80H25V20ZM40 35V50H55C59 50 62 48 62 42.5C62 37 59 35 55 35H40Z" 
          fill="#0ABAB5" 
        />
        <path 
          d="M55 65L75 80H55L40 68V58L55 65Z" 
          fill="#0ABAB5" 
        />
      </svg> */}
      
      {!iconOnly && (
        <motion.div 
          className="flex items-center h-full gap-1 cursor-pointer group"
          whileHover="hover"
        >
          {/* Custom PNG Text Logo (RAVE) */}
          <span className="text-3xl font-bold tracking-widest font-brand text-foreground -mt-1 group-hover:text-tiffany transition-colors duration-300">
            RAVE
          </span>

          {/* Signature SVG X (Tiffany Blue) */}
          <svg viewBox="0 0 60 60" className="h-8 w-auto overflow-visible">
            <g fill="#0ABAB5">
              {/* Path 1: Top-Left */}
              <motion.path 
                initial={{ opacity: 1, pathLength: 1 }}
                whileHover={{ 
                  pathLength: [0, 1],
                  opacity: [0, 1],
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                d="M0 0 L18 20 H28 L10 0 Z" 
              />
              {/* Path 2: Bottom-Right */}
              <motion.path 
                initial={{ opacity: 1, pathLength: 1 }}
                whileHover={{ 
                  pathLength: [0, 1],
                  opacity: [0, 1],
                }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeInOut" }}
                d="M50 50 L32 32 H22 L40 50 Z" 
              />
              {/* Path 3: Top-Right */}
              <motion.path 
                initial={{ opacity: 1, pathLength: 1 }}
                whileHover={{ 
                  pathLength: [0, 1],
                  opacity: [0, 1],
                }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
                d="M50 0 L32 20 H22 L40 0 Z" 
              />
              {/* Path 4: Bottom-Left */}
              <motion.path 
                initial={{ opacity: 1, pathLength: 1 }}
                whileHover={{ 
                  pathLength: [0, 1],
                  opacity: [0, 1],
                }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeInOut" }}
                d="M0 50 L18 32 H28 L10 50 Z" 
              />
            </g>
          </svg>
        </motion.div>
      )}
    </div>
  );
};

export default Logo;
