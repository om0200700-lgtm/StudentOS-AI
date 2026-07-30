import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPieChart, FiTrendingUp, FiActivity, FiTarget } from 'react-icons/fi';
import BarChart from '../../components/charts/BarChart';
import LineChart from '../../components/charts/LineChart';
import RadarChart from '../../components/charts/RadarChart';

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState('weekly');

  const codingDataWeekly = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Problems Solved',
      data: [2, 5, 3, 6, 4, 8, 5],
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderRadius: 4,
    }]
  };

  const codingDataMonthly = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Problems Solved',
      data: [15, 22, 18, 25],
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderRadius: 4,
    }]
  };

  const attendanceDataWeekly = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{
      label: 'Attendance %',
      data: [80, 85, 75, 90, 85],
      borderColor: 'rgba(34, 197, 94, 1)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const attendanceDataMonthly = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Attendance %',
      data: [78, 82, 85, 88],
      borderColor: 'rgba(34, 197, 94, 1)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const placementData = {
    labels: ['DSA', 'System Design', 'Web Dev', 'Aptitude', 'Communication', 'CS Core'],
    datasets: [{
      label: 'Skill Level',
      data: [85, 60, 90, 75, 80, 70],
      backgroundColor: 'rgba(168, 85, 247, 0.2)',
      borderColor: 'rgba(168, 85, 247, 1)',
      pointBackgroundColor: 'rgba(168, 85, 247, 1)',
    }]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FiPieChart className="text-indigo-500" /> Smart Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Deep dive into your academic and placement metrics.</p>
        </div>

        <div className="bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl flex gap-1 shadow-inner">
          <button 
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${timeframe === 'weekly' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${timeframe === 'monthly' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coding Consistency */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 p-6 rounded-3xl shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FiActivity className="text-indigo-500" /> Coding Consistency
            </h3>
            <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-lg">Top 15%</span>
          </div>
          <div className="h-[300px]">
            <BarChart 
              data={timeframe === 'weekly' ? codingDataWeekly : codingDataMonthly} 
            />
          </div>
        </motion.div>

        {/* Attendance Trends */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 p-6 rounded-3xl shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FiTrendingUp className="text-emerald-500" /> Attendance Trends
            </h3>
            <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-lg">+5% from last month</span>
          </div>
          <div className="h-[300px]">
            <LineChart 
              data={timeframe === 'weekly' ? attendanceDataWeekly : attendanceDataMonthly} 
            />
          </div>
        </motion.div>

        {/* Placement Readiness Radar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 p-6 rounded-3xl shadow-sm lg:col-span-2 flex flex-col md:flex-row gap-8 items-center"
        >
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <FiTarget className="text-purple-500" /> Placement Readiness
              </h3>
            </div>
            <div className="h-[350px] w-full flex justify-center">
              <RadarChart data={placementData} />
            </div>
          </div>
          
          <div className="w-full md:w-1/3 space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Strongest Area</p>
              <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Web Development</h4>
              <p className="text-xs mt-1">You're highly proficient. Focus on building 1 more complex project.</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Needs Improvement</p>
              <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400">System Design</h4>
              <p className="text-xs mt-1">Start reading Grokking the System Design Interview.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
