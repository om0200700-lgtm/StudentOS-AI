import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCpu, FiBookOpen, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AssistantPage() {
  const [loading, setLoading] = useState(false);
  const [studyPlan, setStudyPlan] = useState(null);

  const generatePlan = () => {
    setLoading(true);
    setTimeout(() => {
      setStudyPlan([
        { time: '09:00 AM - 11:00 AM', subject: 'Operating Systems', task: 'Revise virtual memory and paging.', icon: FiBookOpen },
        { time: '11:30 AM - 01:00 PM', subject: 'Data Structures', task: 'Solve 2 LeetCode Mediums on Graphs.', icon: FiCpu },
        { time: '03:00 PM - 05:00 PM', subject: 'Database Systems', task: 'Complete pending assignment on Normalization.', icon: FiCheckCircle },
        { time: '06:00 PM - 07:30 PM', subject: 'Placement Prep', task: 'Mock interview practice for system design.', icon: FiClock },
      ]);
      setLoading(false);
      toast.success('Generated new daily study plan!');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 p-8 rounded-3xl shadow-sm text-center"
      >
        <div className="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4">
          <FiCpu className="text-3xl" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">AI Academic Assistant</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-6">
          Your personalized AI coach. I analyze your attendance, grades, and goals to provide actionable study plans and insights to help you excel this semester.
        </p>
        <button 
          onClick={generatePlan}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing Data...
            </>
          ) : (
            'Generate Daily Study Plan'
          )}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Smart Alerts */}
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-rose-100 dark:border-rose-900/30 p-6 rounded-3xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <FiAlertCircle className="text-rose-500" /> Critical Insights
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded-2xl border border-rose-200 dark:border-rose-800/30">
                <p className="font-medium text-sm mb-1">Low Attendance: Operating Systems (68%)</p>
                <p className="text-xs opacity-80">You need to attend the next 4 consecutive lectures to reach the minimum 75% threshold. Set a reminder in your planner.</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-2xl border border-amber-200 dark:border-amber-800/30">
                <p className="font-medium text-sm mb-1">Upcoming Exam: Database Systems</p>
                <p className="text-xs opacity-80">Mid-term in 5 days. You haven't logged any study hours for this subject this week. Prioritize this today.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 p-6 rounded-3xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Subject Recommendations</h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Computer Networks</span>
                <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-lg">On Track</span>
              </li>
              <li className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Data Structures</span>
                <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 rounded-lg">Needs Practice</span>
              </li>
              <li className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Operating Systems</span>
                <span className="text-xs font-semibold px-2 py-1 bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 rounded-lg">High Risk</span>
              </li>
            </ul>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-indigo-950/30 backdrop-blur-xl border border-indigo-100 dark:border-indigo-800/30 p-6 rounded-3xl shadow-sm min-h-[400px]">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Today's Optimal Schedule</h3>
            
            {!studyPlan ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <FiClock className="w-12 h-12 text-indigo-300 dark:text-indigo-700 mb-3" />
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[200px]">Click the button above to generate a customized plan based on your academic data.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {studyPlan.map((item, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index}
                    className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
                  >
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="text-xl" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">{item.time}</p>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">{item.subject}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.task}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
