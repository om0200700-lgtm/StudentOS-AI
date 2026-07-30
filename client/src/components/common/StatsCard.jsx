import React from 'react';
import Card from './Card';
import { motion } from 'framer-motion';

export default function StatsCard({ title, value, icon: Icon, trend, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  };

  const trendColor = trend && trend > 0 ? 'text-green-500' : 'text-red-500';

  return (
    <Card hover={true} className="flex flex-col justify-between overflow-hidden relative group">
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-transparent to-current opacity-5 rounded-full group-hover:scale-150 transition-transform duration-500" style={{ color: 'var(--text-primary)' }} />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">{title}</p>
          <motion.h3 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)]"
          >
            {value}
          </motion.h3>
        </div>
        <div className={`p-3 rounded-2xl ${colors[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-2 mt-2 text-sm relative z-10">
          <span className={`font-semibold ${trendColor}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-[var(--text-secondary)]">vs last month</span>
        </div>
      )}
    </Card>
  );
}
