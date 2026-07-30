import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiBell, FiShield, FiMonitor, FiTarget, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const { theme, toggleTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    notifications: true,
    weeklyReports: false,
    privacyMode: 'public',
    targetCgpa: 8.5
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: <FiUser /> },
    { id: 'theme', label: 'Appearance', icon: <FiMonitor /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { id: 'privacy', label: 'Privacy', icon: <FiShield /> },
    { id: 'goals', label: 'Goals', icon: <FiTarget /> },
    { id: 'about', label: 'About Developer', icon: <FiUser /> },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Settings</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage your account preferences and application settings.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FiSave />
          Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-[var(--text-secondary)] hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full"
                  initial={false}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-card rounded-2xl p-8 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4 border-b border-[var(--border-color)] pb-2">Profile Information</h2>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email Address</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'theme' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4 border-b border-[var(--border-color)] pb-2">Appearance</h2>
                  <div className="flex items-center justify-between p-4 border border-[var(--border-color)] rounded-xl">
                    <div>
                      <h3 className="font-medium">Dark Mode</h3>
                      <p className="text-sm text-[var(--text-secondary)]">Toggle dark mode interface</p>
                    </div>
                    <button 
                      onClick={toggleTheme}
                      className={`w-12 h-6 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-blue-600' : 'bg-slate-300'}`}
                    >
                      <motion.div 
                        className="w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm"
                        animate={{ left: theme === 'dark' ? '28px' : '4px' }}
                      />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4 border-b border-[var(--border-color)] pb-2">Notification Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-[var(--text-secondary)]">Receive notifications on your device</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={formData.notifications}
                        onChange={(e) => setFormData({...formData, notifications: e.target.checked})}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Weekly Reports</h3>
                        <p className="text-sm text-[var(--text-secondary)]">Get weekly summary via email</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={formData.weeklyReports}
                        onChange={(e) => setFormData({...formData, weeklyReports: e.target.checked})}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4 border-b border-[var(--border-color)] pb-2">Privacy Settings</h2>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Profile Visibility</label>
                    <select 
                      value={formData.privacyMode}
                      onChange={(e) => setFormData({...formData, privacyMode: e.target.value})}
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="public" className="bg-[var(--bg-primary)] text-[var(--text-primary)]">Public</option>
                      <option value="private" className="bg-[var(--bg-primary)] text-[var(--text-primary)]">Private</option>
                      <option value="friends" className="bg-[var(--bg-primary)] text-[var(--text-primary)]">Friends Only</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'goals' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4 border-b border-[var(--border-color)] pb-2">Academic Goals</h2>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Target CGPA</label>
                    <input 
                      type="number" 
                      step="0.1"
                      min="0"
                      max="10"
                      value={formData.targetCgpa}
                      onChange={(e) => setFormData({...formData, targetCgpa: e.target.value})}
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4 border-b border-[var(--border-color)] pb-2">About Developer</h2>
                  <div className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-[var(--border-color)]">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                      OK
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--text-primary)]">Om Sundarrao Khandare</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">Founder & Developer of StudentOS AI</p>
                    <p className="text-[var(--text-secondary)] max-w-lg leading-relaxed">
                      "StudentOS AI is designed and developed by Om Sundarrao Khandare to help students manage academics, attendance, CGPA, coding practice, placement preparation, AI-powered study assistance, and smart analytics through one modern platform."
                    </p>
                    <div className="mt-8 pt-6 border-t border-[var(--border-color)] w-full">
                      <p className="text-sm font-medium text-[var(--text-secondary)]">StudentOS AI</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 opacity-75">
                        © 2026 StudentOS AI. All Rights Reserved.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
