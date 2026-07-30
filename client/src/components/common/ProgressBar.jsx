import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ label, percentage, color = 'bg-blue-500', className = '' }) => {
  // Ensure percentage is between 0 and 100
  const validPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{validPercentage}%</span>
        </div>
      )}
      <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden shadow-inner border border-slate-300/50 dark:border-slate-600/30 backdrop-blur-sm">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${validPercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${color} shadow-[0_0_10px_rgba(255,255,255,0.3)] relative`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 rounded-full"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressBar;
