import { motion } from "framer-motion";

const Logo = ({ className = "h-8", variant = "dark", iconOnly = false }) => {
  const textColor = variant === "white" ? "text-white" : "text-gray-800";
  
  return (
    <div className={`flex items-center gap-1 cursor-pointer group ${className}`}>
      {!iconOnly && (
        <span className={`text-3xl font-bold tracking-widest ${textColor} font-brand group-hover:text-tiffany transition-colors duration-300`}>
          RAVE
        </span>
      )}
      <svg viewBox="0 0 60 60" className="h-8 w-auto overflow-visible">
        <g fill="#0ABAB5">
          <motion.path 
            initial={{ opacity: 1, pathLength: 1 }}
            whileHover={{ pathLength: [0, 1], opacity: [0, 1] }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            d="M0 0 L18 20 H28 L10 0 Z" 
          />
          <motion.path 
            initial={{ opacity: 1, pathLength: 1 }}
            whileHover={{ pathLength: [0, 1], opacity: [0, 1] }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeInOut" }}
            d="M50 50 L32 32 H22 L40 50 Z" 
          />
          <motion.path 
            initial={{ opacity: 1, pathLength: 1 }}
            whileHover={{ pathLength: [0, 1], opacity: [0, 1] }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
            d="M50 0 L32 20 H22 L40 0 Z" 
          />
          <motion.path 
            initial={{ opacity: 1, pathLength: 1 }}
            whileHover={{ pathLength: [0, 1], opacity: [0, 1] }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeInOut" }}
            d="M0 50 L18 32 H28 L10 50 Z" 
          />
        </g>
      </svg>
    </div>
  );
};

export default Logo;
