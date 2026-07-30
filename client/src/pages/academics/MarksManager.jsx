import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { academicAPI, adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal';

export default function MarksManager() {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    student: '',
    subject: '',
    examType: 'internal',
    marksObtained: '',
    maxMarks: 100,
    semester: 1
  });

  useEffect(() => {
    fetchMarks();
    if (user?.role === 'admin' || user?.role === 'faculty') {
      fetchFormData();
    }
  }, [user]);

  const fetchMarks = async () => {
    try {
      const res = await academicAPI.getMarks();
      setMarks(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load marks');
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
      setStudents(allUsers.filter(u => u.role === 'student'));
    } catch (error) {
      console.error('Failed to fetch form data', error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await academicAPI.uploadMark({
        ...formData,
        marksObtained: Number(formData.marksObtained),
        maxMarks: Number(formData.maxMarks),
        semester: Number(formData.semester)
      });
      toast.success('Marks uploaded successfully!');
      setIsModalOpen(false);
      setFormData({ student: '', subject: '', examType: 'internal', marksObtained: '', maxMarks: 100, semester: 1 });
      fetchMarks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload marks');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Marks & Grades</h1>
          <p className="text-[var(--text-secondary)]">
            {user?.role === 'student' ? 'View your academic performance.' : 'Upload and manage student marks.'}
          </p>
        </div>
        {(user?.role === 'admin' || user?.role === 'faculty') && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Upload Marks
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : marks.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl">
          <p className="text-[var(--text-secondary)]">No marks found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marks.map((mark, idx) => (
            <motion.div key={mark._id || idx} whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl border-t-4 border-t-blue-500">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-[var(--text-primary)]">{mark.subject?.name}</h3>
                <span className="bg-blue-500/10 text-blue-500 text-xs px-2 py-1 rounded-md uppercase font-bold">{mark.examType}</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-4">{mark.subject?.subjectCode} • Sem {mark.semester}</p>
              
              {user?.role !== 'student' && (
                <div className="mb-4 pb-4 border-b border-[var(--border-color)]">
                  <p className="text-sm text-[var(--text-secondary)]">Student: <span className="text-[var(--text-primary)] font-medium">{mark.student?.name}</span></p>
                  <p className="text-xs text-[var(--text-secondary)]">Roll No: {mark.student?.rollNumber}</p>
                </div>
              )}

              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-[var(--text-primary)]">{mark.marksObtained}</span>
                <span className="text-[var(--text-secondary)] mb-1">/ {mark.maxMarks}</span>
              </div>
              
              <div className="mt-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, (mark.marksObtained / mark.maxMarks) * 100)}%` }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Marks Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Student Marks">
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Student</label>
            <select 
              required
              value={formData.student} 
              onChange={e => setFormData({...formData, student: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Student...</option>
              {students.map(s => (
                <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
              ))}
            </select>
          </div>

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
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Exam Type</label>
              <select 
                required
                value={formData.examType} 
                onChange={e => setFormData({...formData, examType: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="internal">Internal</option>
                <option value="external">External</option>
                <option value="practical">Practical</option>
              </select>
            </div>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Marks Obtained</label>
              <input 
                type="number" 
                required 
                min="0"
                step="0.1"
                value={formData.marksObtained} 
                onChange={e => setFormData({...formData, marksObtained: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Max Marks</label>
              <input 
                type="number" 
                required 
                min="1"
                value={formData.maxMarks} 
                onChange={e => setFormData({...formData, maxMarks: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
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
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
            >
              {isSubmitting ? 'Uploading...' : 'Upload Marks'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
