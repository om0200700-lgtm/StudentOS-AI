import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { facultyAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function FacultyDashboard() {
  const [stats, setStats] = useState({
    classes: 0,
    pendingApprovals: 0,
    upcomingAssignments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await facultyAPI.getDashboardStats();
        if (res.data && res.data.data) {
          setStats(res.data.data);
        }
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
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Faculty Dashboard</h1>
        <p className="text-[var(--text-secondary)]">Manage your classes, attendance, and student performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20">
          <h3 className="text-[var(--text-secondary)] font-medium">Assigned Subjects</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            {loading ? '...' : (stats.assignedSubjects || 0)}
          </p>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl">
          <h3 className="text-[var(--text-secondary)] font-medium">My Classes</h3>
          <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">
            {loading ? '...' : stats.classes}
          </p>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl">
          <h3 className="text-[var(--text-secondary)] font-medium">Pending Approvals</h3>
          <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">
            {loading ? '...' : stats.pendingApprovals}
          </p>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl">
          <h3 className="text-[var(--text-secondary)] font-medium">Upcoming Assignments</h3>
          <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">
            {loading ? '...' : stats.upcomingAssignments}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Class Attendance Trend</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { name: 'Week 1', attendance: 85 },
                { name: 'Week 2', attendance: 88 },
                { name: 'Week 3', attendance: 92 },
                { name: 'Week 4', attendance: 84 },
                { name: 'Week 5', attendance: 90 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Subject Average Marks</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { subject: 'Data Structs', avg: 75 },
                { subject: 'Operating Sys', avg: 82 },
                { subject: 'Web Dev', avg: 88 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="subject" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Bar dataKey="avg" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
