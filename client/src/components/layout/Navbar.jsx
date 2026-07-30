import React, { useState, useEffect } from 'react';
import { FiMenu, FiSearch, FiBell, FiMoon, FiSun, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { notificationsAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function Navbar({ setMobileOpen }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await notificationsAPI.getAll();
      const notifs = res.data.data || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    
    try {
      await notificationsAPI.markAllAsRead();
      const updatedNotifs = notifications.map(n => ({ ...n, isRead: true }));
      setNotifications(updatedNotifs);
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await notificationsAPI.markAsRead(notif._id);
        const updatedNotifs = notifications.map(n => 
          n._id === notif._id ? { ...n, isRead: true } : n
        );
        setNotifications(updatedNotifs);
        setUnreadCount(Math.max(0, unreadCount - 1));
      } catch (error) {
        console.error('Failed to mark as read', error);
      }
    }
    // Optionally navigate based on notification type
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass-panel sticky top-0 z-10 px-4 md:px-6 py-3 flex justify-between items-center transition-colors">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 text-[var(--text-secondary)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          <FiMenu size={24} />
        </button>
        
        <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full border border-transparent focus-within:border-blue-500 transition-colors w-64 lg:w-96">
          <FiSearch className="text-[var(--text-secondary)]" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 text-[var(--text-secondary)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-[var(--text-secondary)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative"
          >
            <FiBell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--bg-primary)]"></span>
            )}
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-80 bg-slate-900 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden z-50 border border-[rgba(255,255,255,0.08)]"
              >
                <div className="p-4 border-b border-[rgba(255,255,255,0.08)] font-semibold flex justify-between items-center bg-slate-900">
                  <span className="text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span onClick={handleMarkAllRead} className="text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer">Mark all read</span>
                  )}
                </div>
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2 bg-slate-900">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-400">No notifications</div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif._id} 
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-4 mb-2 border border-transparent rounded-xl cursor-pointer transition-all flex flex-col gap-1.5 ${notif.isRead ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-800 hover:bg-slate-700'}`}
                      >
                        <div className="flex items-center gap-2">
                          {notif.type === 'success' && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                          {notif.type === 'warning' && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                          {notif.type === 'error' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                          {notif.type === 'info' && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                          <p className={`text-sm ${notif.isRead ? 'text-slate-400' : 'font-semibold text-white'}`}>
                            {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)} Notification
                          </p>
                        </div>
                        <p className={`text-xs ${notif.isRead ? 'text-slate-500' : 'text-slate-300'} leading-relaxed`}>{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-px bg-[var(--border-color)] hidden md:block mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold">{user?.firstName || user?.name || 'Student'}</p>
            <p className="text-xs text-[var(--text-secondary)]">Pro Member</p>
          </div>
          <div 
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            onClick={() => navigate('/dashboard/profile')}
          >
            {(user?.firstName || user?.name || 'S')[0].toUpperCase()}
          </div>
          <button 
            onClick={handleLogout} 
            className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors ml-2"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
