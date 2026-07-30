import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { academicAPI, adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal';

export default function AttendanceManager() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [formData, setFormData] = useState({
    subject: '',
    date: new Date().toISOString().split('T')[0],
    semester: 1,
    section: 'A',
    records: []
  });

  useEffect(() => {
    fetchAttendance();
    if (user?.role === 'admin' || user?.role === 'faculty') {
      fetchFormData();
    }
  }, [user]);

  const fetchAttendance = async () => {
    try {
      const res = await academicAPI.getAttendance();
      setAttendance(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const fetchFormData = async () => {
    try {
      const [subjRes, usersRes] = await Promise.all([
        academicAPI.getSubjects(),
        adminAPI.getUsers()
      ]);
      setSubjects(subjRes.data.data || []);
      const allUsers = usersRes.data.data || [];
      const studentList = allUsers.filter(u => u.role === 'student');
      setStudents(studentList);
      
      // Initialize records array with absent status for all students
      setFormData(prev => ({
        ...prev,
        records: studentList.map(s => ({ student: s._id, status: 'absent' }))
      }));
    } catch (error) {
      console.error('Failed to fetch form data', error);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setFormData(prev => ({
      ...prev,
      records: prev.records.map(r => r.student === studentId ? { ...r, status } : r)
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await academicAPI.markAttendance(formData);
      toast.success('Attendance marked successfully!');
      setIsModalOpen(false);
      fetchAttendance();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Class Attendance</h1>
          <p className="text-[var(--text-secondary)]">
            {user?.role === 'student' ? 'View your academic attendance records.' : 'Manage class attendance.'}
          </p>
        </div>
        {(user?.role === 'admin' || user?.role === 'faculty') && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Mark Attendance
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : attendance.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl">
          <p className="text-[var(--text-secondary)]">No attendance records found.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden rounded-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-[var(--border-color)]">
                <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Date</th>
                <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Subject</th>
                <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Faculty</th>
                {user?.role !== 'student' && (
                  <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Semester / Section</th>
                )}
                <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Status/Stats</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record, idx) => {
                const dateStr = new Date(record.date).toLocaleDateString();
                
                let studentStatus = null;
                if (user?.role === 'student') {
                  const myRecord = record.records.find(r => r.student?._id === user._id);
                  studentStatus = myRecord ? myRecord.status : 'unknown';
                }

                const presentCount = record.records.filter(r => r.status === 'present').length;
                const totalCount = record.records.length;

                return (
                  <tr key={record._id || idx} className="border-b border-[var(--border-color)] hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 text-sm text-[var(--text-primary)]">{dateStr}</td>
                    <td className="p-4 text-sm text-[var(--text-primary)] font-medium">
                      {record.subject?.name} <span className="text-xs text-[var(--text-secondary)]">({record.subject?.subjectCode})</span>
                    </td>
                    <td className="p-4 text-sm text-[var(--text-secondary)]">{record.faculty?.name}</td>
                    
                    {user?.role !== 'student' && (
                      <td className="p-4 text-sm text-[var(--text-secondary)]">Sem {record.semester} - Sec {record.section}</td>
                    )}

                    <td className="p-4 text-sm">
                      {user?.role === 'student' ? (
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                          studentStatus === 'present' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : studentStatus === 'absent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-slate-100 text-slate-700'
                        }`}>
                          {studentStatus.toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-[var(--text-secondary)]">
                          {presentCount} / {totalCount} Present
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Mark Attendance Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Mark Class Attendance" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Subject</label>
              <select 
                required
                value={formData.subject} 
                onChange={e => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Subject...</option>
                {subjects.map(sub => (
                  <option key={sub._id} value={sub._id}>{sub.name} ({sub.subjectCode})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Date</label>
              <input 
                type="date" 
                required 
                value={formData.date} 
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Semester</label>
              <input 
                type="number" 
                required 
                min="1"
                value={formData.semester} 
                onChange={e => setFormData({...formData, semester: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Section</label>
              <input 
                type="text" 
                required 
                value={formData.section} 
                onChange={e => setFormData({...formData, section: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="e.g. A"
              />
            </div>
          </div>

          <div className="mt-6 border-t border-[var(--border-color)] pt-4">
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">Student List</h3>
            <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2">
              {students.map(student => {
                const currentRecord = formData.records.find(r => r.student === student._id);
                const isPresent = currentRecord?.status === 'present';
                
                return (
                  <div key={student._id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-[var(--border-color)]">
                    <div>
                      <p className="font-medium text-[var(--text-primary)] text-sm">{student.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{student.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student._id, 'present')}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${isPresent ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-[var(--text-secondary)]'}`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student._id, 'absent')}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${!isPresent ? 'bg-red-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-[var(--text-secondary)]'}`}
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                );
              })}
              {students.length === 0 && (
                <p className="text-sm text-[var(--text-secondary)] text-center py-4">No students found.</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || formData.records.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
