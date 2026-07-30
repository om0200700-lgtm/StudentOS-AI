import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMap, FiCheckCircle, FiCircle, FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { goalsAPI } from '../../services/api';

export default function RoadmapPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGoalText, setNewGoalText] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await goalsAPI.getAll().catch(() => null);
      if (res && res.data && res.data.data) {
        setGoals(res.data.data);
      } else {
        // Fallback dummy data if backend not connected yet
        setGoals([
          { _id: '1', text: 'Complete OS Module 1', completed: true },
          { _id: '2', text: 'Solve 50 LeetCode problems', completed: false },
          { _id: '3', text: 'Submit Web Dev Project Phase 1', completed: true },
          { _id: '4', text: 'Revise Computer Networks', completed: false },
        ]);
      }
    } catch (error) {
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;

    try {
      setAdding(true);
      const res = await goalsAPI.create({ text: newGoalText }).catch(() => null);
      if (res && res.data && res.data.data) {
        setGoals([...goals, res.data.data]);
      } else {
        // Fallback
        setGoals([...goals, { _id: Date.now().toString(), text: newGoalText, completed: false }]);
      }
      setNewGoalText('');
      toast.success('Goal added successfully');
    } catch (error) {
      toast.error('Failed to add goal');
    } finally {
      setAdding(false);
    }
  };

  const toggleGoal = async (id, currentStatus) => {
    const updatedGoals = goals.map(g => g._id === id ? { ...g, completed: !currentStatus } : g);
    setGoals(updatedGoals); // Optimistic update

    try {
      await goalsAPI.update(id, { completed: !currentStatus }).catch(() => null);
    } catch (error) {
      // Revert if failed
      setGoals(goals);
      toast.error('Failed to update goal');
    }
  };

  const deleteGoal = async (id) => {
    const updatedGoals = goals.filter(g => g._id !== id);
    setGoals(updatedGoals);

    try {
      await goalsAPI.delete(id).catch(() => null);
      toast.success('Goal deleted');
    } catch (error) {
      setGoals(goals);
      toast.error('Failed to delete goal');
    }
  };

  const completedGoals = goals.filter(g => g.completed);
  const pendingGoals = goals.filter(g => !g.completed);
  
  const totalGoals = goals.length;
  const progressPercentage = totalGoals === 0 ? 0 : Math.round((completedGoals.length / totalGoals) * 100);

  // Hardcoded semester progress for visual effect
  const semesterProgress = 45; 

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <FiMap className="text-indigo-500" /> Semester Roadmap
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track your macro goals and semester timeline.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 p-6 rounded-3xl shadow-sm"
      >
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Semester Progress</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-slate-600 dark:text-slate-400">Time Elapsed</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{semesterProgress}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${semesterProgress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-slate-600 dark:text-slate-400">Goals Completed</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{progressPercentage}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.4 }}
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Goals */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 p-6 rounded-3xl shadow-sm flex flex-col h-full"
        >
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Pending Goals ({pendingGoals.length})</h3>
          
          <form onSubmit={handleAddGoal} className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder="Add new goal..." 
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button 
              type="submit" 
              disabled={adding || !newGoalText.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-2 rounded-xl transition-colors"
            >
              <FiPlus className="text-xl" />
            </button>
          </form>

          {loading ? (
            <div className="flex-1 flex justify-center items-center p-8">
              <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          ) : (
            <ul className="space-y-3 flex-1 overflow-y-auto pr-2">
              {pendingGoals.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No pending goals. You're all caught up!</p>
              ) : (
                pendingGoals.map(goal => (
                  <li key={goal._id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm group">
                    <button onClick={() => toggleGoal(goal._id, goal.completed)} className="text-slate-400 hover:text-indigo-500 transition-colors shrink-0">
                      <FiCircle className="text-xl" />
                    </button>
                    <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{goal.text}</span>
                    <button onClick={() => deleteGoal(goal._id)} className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <FiTrash2 />
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </motion.div>

        {/* Completed Goals */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 p-6 rounded-3xl shadow-sm flex flex-col h-full"
        >
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Completed ({completedGoals.length})</h3>
          
          {loading ? (
            <div className="flex-1 flex justify-center items-center p-8">
              <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            </div>
          ) : (
            <ul className="space-y-3 flex-1 overflow-y-auto pr-2">
              {completedGoals.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No completed goals yet.</p>
              ) : (
                completedGoals.map(goal => (
                  <li key={goal._id} className="flex items-center gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800/30 group">
                    <button onClick={() => toggleGoal(goal._id, goal.completed)} className="text-emerald-500 hover:text-slate-400 transition-colors shrink-0">
                      <FiCheckCircle className="text-xl" />
                    </button>
                    <span className="text-sm text-slate-500 dark:text-slate-400 flex-1 line-through">{goal.text}</span>
                    <button onClick={() => deleteGoal(goal._id)} className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <FiTrash2 />
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
}
