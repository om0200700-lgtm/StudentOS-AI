import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';

const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    const today = new Date();
    // Get start of current week (Sunday)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - today.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    setWeekDays(days);
  }, []);

  const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
          {monthName} {year}
        </h3>
        <button 
          onClick={() => setCurrentDate(new Date())}
          className="text-sm px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full font-medium border border-blue-500/20 transition-colors"
        >
          Today
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {weekDays.map((day, index) => {
          const isActive = isSameDay(day, currentDate);
          const dayName = day.toLocaleString('default', { weekday: 'short' });
          const dateNum = day.getDate();
          
          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {dayName}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`
                  w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
                  ${isActive 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }
                `}
                onClick={() => setCurrentDate(day)}
              >
                {dateNum}
              </motion.button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default CalendarWidget;
