import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, FiClock, FiBook, FiTarget, FiAward, FiCheckCircle, 
  FiPlus, FiCalendar, FiBell, FiBriefcase, FiFileText, FiUpload, FiCpu
} from 'react-icons/fi';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { analyticsAPI } from '../../services/api';
import StatsCard from '../../components/common/StatsCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Attempt to fetch, with fallback
        const response = await analyticsAPI.getDashboardOverview().catch(() => null);
        if (response && response.data) {
          setData(response.data.data || response.data);
        } else {
          // Fallback dummy data if backend endpoint is not ready
          setData({
            stats: {
              cgpa: 8.5,
              attendance: 85,
              codingStreak: 12,
              studyHours: 45,
              placementReadiness: 70,
              tasksCompleted: 24,
              credits: 120
            },
            studyHoursData: [
              { name: 'Mon', hours: 3 },
              { name: 'Tue', hours: 4 },
              { name: 'Wed', hours: 2 },
              { name: 'Thu', hours: 5 },
              { name: 'Fri', hours: 6 },
              { name: 'Sat', hours: 4 },
              { name: 'Sun', hours: 5 }
            ],
            gpaTrendData: [
              { sem: 'Sem 1', sgpa: 8.2 },
              { sem: 'Sem 2', sgpa: 8.4 },
              { sem: 'Sem 3', sgpa: 8.1 },
              { sem: 'Sem 4', sgpa: 8.6 },
              { sem: 'Sem 5', sgpa: 8.5 }
            ],
            goals: [
              { id: 1, text: 'Complete DSA Assignment', completed: false },
              { id: 2, text: 'Revise Operating Systems', completed: true },
              { id: 3, text: 'Solve 2 LeetCode problems', completed: false }
            ],
            notifications: [
              { id: 1, text: 'Attendance updated: OS Lecture', time: '1h ago', type: 'info' },
              { id: 2, text: 'Reminder: Submit Web Dev Project', time: '3h ago', type: 'warning' }
            ],
            upcomingEvents: [
              { id: 1, title: 'Mid-term Exams', date: 'Oct 15' },
              { id: 2, title: 'Hackathon', date: 'Oct 20' }
            ],
            todayTimetable: [
              { time: '09:00 AM', subject: 'Data Structures' },
              { time: '10:00 AM', subject: 'Operating Systems' },
              { time: '11:00 AM', subject: 'Computer Networks' }
            ],
            aiRecommendations: [
              { id: 1, text: 'Your OS attendance is dropping (72%). Attend the next 3 classes to get back on track.', type: 'danger' },
              { id: 2, text: 'Great job maintaining a 12-day coding streak!', type: 'success' },
              { id: 3, text: 'Consider revising Network Protocols before the upcoming mid-terms.', type: 'warning' },
              { id: 4, text: 'New placement opportunities matched your profile.', type: 'info' }
            ]
          });
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[600px] text-center">
        <p className="text-rose-500 text-lg mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
          Retry
        </button>
      </div>
    );
  }

  const { 
    stats, 
    studyHoursData = [], 
    gpaTrendData = [], 
    goals = [], 
    notifications = [], 
    upcomingEvents = [], 
    todayTimetable = [], 
    aiRecommendations = [] 
  } = data || {};
  
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.name || 'Student';
  const userAvatar = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=6366f1&color=fff`;

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden"
      >
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <img src={userAvatar} alt="Profile" className="w-24 h-24 rounded-2xl shadow-md object-cover z-10" />
        <div className="flex-1 text-center md:text-left z-10">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Welcome back, {userName}! 👋</h1>
          <p className="text-[var(--text-secondary)] mt-1">Ready to crush your goals today?</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
            <span className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium border border-blue-100 dark:border-blue-800">
              B.Tech {user?.branch || 'CSE'}
            </span>
            <span className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg text-sm font-medium border border-purple-100 dark:border-purple-800">
              Sem {user?.semester || '5'}
            </span>
            <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700">
              Reg: {user?.registrationNumber || 'N/A'}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatsCard title="Current CGPA" value={stats?.cgpa || '0.0'} icon={FiTrendingUp} color="green" trend={0.2} />
        <StatsCard title="Attendance" value={`${stats?.attendance || 0}%`} icon={FiCheckCircle} color="blue" trend={2.0} />
        <StatsCard title="Earned Credits" value={`${stats?.credits || 0}`} icon={FiAward} color="purple" trend={0} />
        <StatsCard title="Coding Streak" value={`${stats?.codingStreak || 0} days`} icon={FiTarget} color="orange" trend={-1.0} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Content Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* AI Recommendations */}
          {aiRecommendations && aiRecommendations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2 px-1">
                <FiCpu className="text-blue-500" /> AI Recommendations
              </h3>
              {aiRecommendations.map((rec, index) => {
                let colorClasses = '';
                switch (rec.type) {
                  case 'success':
                    colorClasses = 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30';
                    break;
                  case 'warning':
                    colorClasses = 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800/30';
                    break;
                  case 'danger':
                    colorClasses = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/30';
                    break;
                  case 'info':
                  default:
                    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30';
                    break;
                }
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={rec.id || rec._id || `rec-${index}`} 
                    className={`p-4 rounded-xl border flex items-start gap-3 shadow-sm ${colorClasses}`}
                  >
                    <div className="mt-0.5"><FiBell size={16} /></div>
                    <p className="text-sm font-medium leading-relaxed">{rec.text}</p>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Quick Actions */}
          <div className="glass-card rounded-3xl p-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <ActionButton icon={FiPlus} label="Add Task" onClick={() => toast.success('Add task clicked')} />
              <ActionButton icon={FiCheckCircle} label="Add Attendance" onClick={() => toast.success('Attendance clicked')} />
              <ActionButton icon={FiTrendingUp} label="Update CGPA" onClick={() => toast.success('Update CGPA clicked')} />
              <ActionButton icon={FiClock} label="Study Session" onClick={() => toast.success('Study session clicked')} />
              <ActionButton icon={FiUpload} label="Upload Resume" onClick={() => toast.success('Upload Resume clicked')} />
              <ActionButton icon={FiBook} label="Placement Prep" onClick={() => toast.success('Placement Prep clicked')} />
            </div>
          </div>

          {/* Charts Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] text-center mb-4">Weekly Study Hours</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={studyHoursData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                    <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] text-center mb-4">GPA Trend</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={gpaTrendData}>
                    <defs>
                      <linearGradient id="colorSgpa" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="sem" stroke="var(--text-secondary)" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="sgpa" stroke="#10b981" fillOpacity={1} fill="url(#colorSgpa)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar Area */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6 lg:sticky lg:top-6"
        >
          {/* Daily Goals & Tasks */}
          <div className="glass-card rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Daily Goals</h3>
              <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors">View All</button>
            </div>
            <ul className="space-y-3">
              {goals?.map((goal, index) => (
                <li key={goal.id || goal._id || `goal-${index}`} className="flex items-center gap-3 group">
                  <div className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-colors ${goal.completed ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 group-hover:border-blue-400'}`}>
                    {goal.completed && <FiCheckCircle className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-sm flex-1 transition-colors ${goal.completed ? 'text-[var(--text-secondary)] line-through opacity-70' : 'text-[var(--text-primary)]'}`}>
                    {goal.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Today's Timetable */}
          <div className="glass-card rounded-3xl p-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <FiClock className="text-blue-500" /> Today's Timetable
            </h3>
            <ul className="space-y-3">
              {todayTimetable?.map((item, index) => (
                <li key={index} className="flex flex-col bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-blue-500">{item.time}</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">{item.subject}</span>
                </li>
              ))}
              {(!todayTimetable || todayTimetable.length === 0) && (
                <li className="text-sm text-[var(--text-secondary)]">No classes today.</li>
              )}
            </ul>
          </div>

          {/* Calendar Widget */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-500">
              <FiCalendar className="w-32 h-32" />
            </div>
            <h3 className="text-lg font-bold mb-4 relative z-10 flex items-center gap-2">
              <FiCalendar className="w-5 h-5" />
              Upcoming Events
            </h3>
            <ul className="space-y-3 relative z-10">
              {upcomingEvents?.map((event, index) => (
                <li key={event.id || event._id || `event-${index}`} className="flex justify-between items-center bg-white/10 hover:bg-white/20 transition-colors rounded-xl p-3 backdrop-blur-md border border-white/10">
                  <span className="text-sm font-medium">{event.title}</span>
                  <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-md">{event.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 glass-card hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl transition-all duration-200 gap-3 shadow-sm hover:shadow"
    >
      <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
        <Icon className="text-xl" />
      </div>
      <span className="text-xs font-medium text-[var(--text-primary)] text-center">{label}</span>
    </motion.button>
  );
}
