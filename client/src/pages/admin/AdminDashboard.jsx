import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeStudents: 0,
    activeFaculty: 0,
    totalDepartments: 0,
    totalCourses: 0,
    totalSubjects: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAPI.getDashboardStats();
        setStats(res.data.data);
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Dashboard</h1>
        <p className="text-[var(--text-secondary)]">Overview of system operations and user activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl">
          <h3 className="text-[var(--text-secondary)] font-medium">Total Users</h3>
          <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">
            {loading ? '...' : stats.totalUsers}
          </p>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl">
          <h3 className="text-[var(--text-secondary)] font-medium">Active Students</h3>
          <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">
            {loading ? '...' : stats.activeStudents}
          </p>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl">
          <h3 className="text-[var(--text-secondary)] font-medium">Active Faculty</h3>
          <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">
            {loading ? '...' : stats.activeFaculty}
          </p>
        </motion.div>
        
        {/* Phase 13 Stats */}
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20">
          <h3 className="text-[var(--text-secondary)] font-medium">Total Departments</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            {loading ? '...' : stats.totalDepartments}
          </p>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-900/20">
          <h3 className="text-[var(--text-secondary)] font-medium">Total Courses</h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
            {loading ? '...' : stats.totalCourses}
          </p>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl bg-gradient-to-br from-green-50 to-transparent dark:from-green-900/20">
          <h3 className="text-[var(--text-secondary)] font-medium">Total Subjects</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
            {loading ? '...' : stats.totalSubjects}
          </p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">User Demographics</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Students', value: stats.activeStudents || 0 },
                    { name: 'Faculty', value: stats.activeFaculty || 0 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#8b5cf6" />
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div>Students</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div>Faculty</div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Academic Structure</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Depts', count: stats.totalDepartments || 0 },
                { name: 'Courses', count: stats.totalCourses || 0 },
                { name: 'Subjects', count: stats.totalSubjects || 0 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
