import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiCheck, HiOutlineClock, HiOutlineCalendar, HiOutlineTrash, HiFire } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { plannerAPI } from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import PomodoroTimer from '../../components/planner/PomodoroTimer';
import BarChart from '../../components/charts/BarChart';

export default function PlannerPage() {
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '', subject: '', type: 'Task', dueDate: '', priority: 'Medium'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, analyticsRes] = await Promise.all([
        plannerAPI.getTasks().catch(() => ({ data: { data: [] } })),
        plannerAPI.getAnalytics().catch(() => ({ data: { data: { totalHours: 0, streak: 0, chart: { labels: [], data: [] } } } }))
      ]);
      setTasks(tasksRes.data?.data || []);
      setAnalytics(analyticsRes.data?.data);
    } catch (error) {
      toast.error('Failed to load planner data');
    } finally {
      setLoading(false);
    }
  };

  const handlePomodoroComplete = async (durationMinutes) => {
    try {
      await plannerAPI.logSession({ durationMinutes, subject: 'General' });
      // Refresh analytics
      const res = await plannerAPI.getAnalytics();
      setAnalytics(res.data.data);
    } catch (error) {
      console.error('Failed to log session');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.dueDate) return toast.error('Title and Due Date required');
    try {
      await plannerAPI.createTask(newTask);
      setShowModal(false);
      setNewTask({ title: '', subject: '', type: 'Task', dueDate: '', priority: 'Medium' });
      fetchData();
      toast.success('Task added');
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await plannerAPI.updateTask(task._id, { status: newStatus });
      setTasks(tasks.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await plannerAPI.deleteTask(id);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Study Planner</h1>
          <p className="text-slate-500">Manage tasks and track your study sessions</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <HiPlus className="w-5 h-5 mr-2" /> Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Timer & Analytics */}
        <div className="space-y-6">
          <PomodoroTimer onComplete={handlePomodoroComplete} />
          
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-800 font-bold">Study Analytics</h3>
              <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-3 py-1 rounded-full text-sm font-bold">
                <HiFire className="w-4 h-4" /> {analytics?.streak || 0} Day Streak
              </div>
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold text-slate-800">{analytics?.totalHours || 0}</span>
              <span className="text-slate-500 ml-2">hours this week</span>
            </div>
            
            {analytics?.chart?.labels?.length > 0 && (
              <div className="h-48">
                <BarChart 
                  labels={analytics.chart.labels} 
                  values={analytics.chart.data} 
                />
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Task Board */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-full min-h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <HiOutlineCalendar className="w-6 h-6 text-indigo-500" /> Task Board
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              <AnimatePresence>
                {loading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-10 text-slate-500">
                    Loading tasks...
                  </motion.div>
                ) : tasks.length === 0 ? (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-10 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
                    No tasks found. Click "Add Task" to plan your study schedule.
                  </motion.div>
                ) : (
                  tasks.map(task => {
                    const isCompleted = task.status === 'Completed';
                    const dueDate = new Date(task.dueDate).toLocaleDateString();
                    
                    return (
                      <motion.div 
                        key={task._id} 
                        layout 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`p-4 rounded-xl border ${isCompleted ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 shadow-sm'} group transition-all flex gap-4`}
                      >
                        <button 
                          onClick={() => toggleTaskStatus(task)}
                          className={`mt-1 w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-colors ${isCompleted ? 'bg-green-500 border-green-500' : 'border-slate-300 hover:border-indigo-500'}`}
                        >
                          {isCompleted && <HiCheck className="text-white w-4 h-4" />}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`font-bold truncate pr-4 ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600">
                                {task.type}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center text-xs text-slate-500 gap-4 mt-2">
                            <span>{task.subject || 'General'}</span>
                            <span className="flex items-center gap-1">
                              <HiOutlineClock className="w-3.5 h-3.5" /> {dueDate}
                            </span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleDeleteTask(task._id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all flex-shrink-0"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl my-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Add Task</h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                <input type="text" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select value={newTask.type} onChange={(e) => setNewTask({...newTask, type: e.target.value})} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option>Task</option>
                    <option>Assignment</option>
                    <option>Exam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input type="text" value={newTask.subject} onChange={(e) => setNewTask({...newTask, subject: e.target.value})} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Operating Systems" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <Button variant="secondary" onClick={() => setShowModal(false)} type="button" className="flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200">Cancel</Button>
                <Button variant="primary" type="submit" className="flex-1">Save Task</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
