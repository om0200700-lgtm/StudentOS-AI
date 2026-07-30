import React from 'react';
import { motion } from 'framer-motion';

export function Card({ children, className = '', hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' } : {}}
      className={`glass-card rounded-2xl p-6 transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default Card;
