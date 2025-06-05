import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', initial = {}, animate = {}, transition = {} }) => {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      className={`bg-white rounded-xl p-4 sm:p-6 shadow-card hover:shadow-soft transition-shadow duration-200 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;