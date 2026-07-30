import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiCalendar, FiBookOpen, FiClock, FiCode, FiBriefcase, 
  FiCpu, FiPieChart, FiMap, FiUser, FiSettings, FiChevronLeft, FiChevronRight, FiMenu
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const STUDENT_NAV = [
  { path: '/dashboard', label: 'Dashboard', icon: FiHome },
  { path: '/dashboard/attendance', label: 'My Tracker', icon: FiCalendar },
  { path: '/dashboard/cgpa', label: 'My CGPA', icon: FiBookOpen },
  { path: '/dashboard/planner', label: 'Planner', icon: FiClock },
  { path: '/dashboard/coding', label: 'Coding', icon: FiCode },
  { path: '/dashboard/placement', label: 'Placement', icon: FiBriefcase },
  
  // Phase 12 Academics
  { path: '/dashboard/academics/subjects', label: 'Subjects', icon: FiBookOpen },
  { path: '/dashboard/academics/timetable', label: 'Timetable', icon: FiCalendar },
  { path: '/dashboard/academics/assignments', label: 'Assignments', icon: FiClock },
  { path: '/dashboard/academics/attendance', label: 'Class Attendance', icon: FiUser },
  { path: '/dashboard/academics/marks', label: 'Marks', icon: FiPieChart },
  { path: '/dashboard/academics/results', label: 'Results', icon: FiBookOpen },
  { path: '/dashboard/academics/notices', label: 'Notice Board', icon: FiHome },
  
  // Phase 15 Portals
  { path: '/dashboard/fees', label: 'Fee Portal', icon: FiBriefcase },

  { path: '/dashboard/assistant', label: 'AI Assistant', icon: FiCpu },
  { path: '/dashboard/analytics', label: 'Analytics', icon: FiPieChart },
  { path: '/dashboard/roadmap', label: 'Roadmap', icon: FiMap },
  { path: '/dashboard/profile', label: 'Profile', icon: FiUser },
  { path: '/dashboard/settings', label: 'Settings', icon: FiSettings },
];

const FACULTY_NAV = [
  { path: '/faculty', label: 'Dashboard', icon: FiHome },
  { path: '/faculty/academics/subjects', label: 'Subjects', icon: FiBookOpen },
  { path: '/faculty/academics/timetable', label: 'Timetable', icon: FiCalendar },
  { path: '/faculty/academics/assignments', label: 'Assignments', icon: FiClock },
  { path: '/faculty/academics/attendance', label: 'Attendance', icon: FiUser },
  { path: '/faculty/academics/marks', label: 'Marks', icon: FiPieChart },
  { path: '/faculty/academics/notices', label: 'Notices', icon: FiHome },
  { path: '/faculty/profile', label: 'Profile', icon: FiUser },
  { path: '/faculty/settings', label: 'Settings', icon: FiSettings },
];

const ADMIN_NAV = [
  { path: '/admin', label: 'Dashboard', icon: FiHome },
  
  // Phase 13 Management
  { path: '/admin/management/students', label: 'Students', icon: FiUser },
  { path: '/admin/management/faculty', label: 'Faculty', icon: FiUser },
  { path: '/admin/management/departments', label: 'Departments', icon: FiBookOpen },
  { path: '/admin/management/calendar', label: 'Calendar', icon: FiCalendar },
  { path: '/admin/management/reports', label: 'Reports', icon: FiPieChart },
  
  // Phase 12 Academics
  { path: '/admin/academics/subjects', label: 'Subjects', icon: FiBookOpen },
  { path: '/admin/academics/timetable', label: 'Timetable', icon: FiCalendar },
  { path: '/admin/academics/notices', label: 'Notices', icon: FiHome },
  { path: '/admin/academics/results', label: 'Results', icon: FiBookOpen },
  
  // Phase 15 Enterprise
  { path: '/admin/fees', label: 'Fee Mgmt', icon: FiBriefcase },
  { path: '/admin/exams', label: 'Exam Mgmt', icon: FiBookOpen },
  { path: '/admin/audit-logs', label: 'Audit Logs', icon: FiCpu },
  
  // Basic
  { path: '/admin/profile', label: 'Profile', icon: FiUser },
  { path: '/admin/settings', label: 'Settings', icon: FiSettings },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  
  let navItems = STUDENT_NAV;
  if (user?.role === 'admin') navItems = ADMIN_NAV;
  if (user?.role === 'faculty') navItems = FACULTY_NAV;

  const sidebarVariants = {
    expanded: { width: '16rem' },
    collapsed: { width: '5rem' }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        variants={sidebarVariants}
        initial="expanded"
        animate={collapsed ? "collapsed" : "expanded"}
        className={`fixed md:relative z-30 flex flex-col h-full bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] shrink-0 transition-transform duration-300 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 flex items-center justify-between h-16 shrink-0">
          <AnimatePresence>
            {!collapsed && (
              <motion.h1 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap overflow-hidden"
              >
                StudentOS<span className="text-blue-400">AI</span>
              </motion.h1>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-secondary)] transition-colors"
          >
            {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium group relative ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-[var(--text-secondary)] hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-[var(--text-primary)]'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <span className="text-lg shrink-0 flex items-center justify-center"><item.icon /></span>
              
              <AnimatePresence>
                {!collapsed && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {collapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 mt-auto shrink-0">
          {!collapsed ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 blur-2xl group-hover:bg-white/30 transition-colors" />
              <div className="relative z-10 text-white">
                <h4 className="text-sm font-bold mb-1">Upgrade to Pro</h4>
                <p className="text-xs text-blue-100 mb-3">Premium AI features.</p>
                <button className="w-full py-2 px-4 bg-white text-blue-600 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors shadow-sm">
                  Upgrade
                </button>
              </div>
            </motion.div>
          ) : (
            <button className="w-full p-3 flex justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow" title="Upgrade to Pro">
              <span className="font-bold">PRO</span>
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
}
