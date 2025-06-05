import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className = '', disabled = false, whileHover, whileTap, type = 'button' }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`transition-colors duration-200 ${className}`}
      disabled={disabled}
      whileHover={whileHover}
      whileTap={whileTap}
    >
      {children}
    </motion.button>
  );
};

export default Button;