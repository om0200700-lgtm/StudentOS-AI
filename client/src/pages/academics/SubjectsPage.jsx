import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { academicAPI, adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal';
import { FiTrash2 } from 'react-icons/fi';

export default function SubjectsPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subjectCode: '',
    name: '',
    credits: 3,
    semester: 1,
    department: '',
    faculty: ''
  });

  useEffect(() => {
    fetchSubjects();
    if (user?.role === 'admin') {
      fetchFaculty();
    }
  }, [user]);

  const fetchSubjects = async () => {
    try {
      const res = await academicAPI.getSubjects();
      setSubjects(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculty = async () => {
    try {
      const res = await adminAPI.getUsers();
      const users = res.data.data || [];
      setFacultyList(users.filter(u => u.role === 'faculty'));
    } catch (error) {
      console.error('Failed to fetch faculty list', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await academicAPI.createSubject(formData);
      toast.success('Subject created successfully!');
      setIsModalOpen(false);
      setFormData({ subjectCode: '', name: '', credits: 3, semester: 1, department: '', faculty: '' });
      fetchSubjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await academicAPI.deleteSubject(id);
        toast.success('Subject deleted successfully');
        fetchSubjects();
      } catch (error) {
        toast.error('Failed to delete subject');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Subjects</h1>
          <p className="text-[var(--text-secondary)]">Manage academic subjects and faculty assignments.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Add Subject
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : subjects.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl">
          <p className="text-[var(--text-secondary)]">No subjects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(subject => (
            <motion.div key={subject._id} whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl relative group">
              {user?.role === 'admin' && (
                <button 
                  onClick={() => handleDelete(subject._id)}
                  className="absolute top-4 right-4 p-2 bg-red-100 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50"
                  title="Delete Subject"
                >
                  <FiTrash2 />
                </button>
              )}
              <div className="flex justify-between items-start mb-4 pr-8">
                <h3 className="font-semibold text-lg text-[var(--text-primary)]">{subject.name}</h3>
                <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-md shrink-0">{subject.subjectCode}</span>
              </div>
              <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                <p>Credits: <span className="text-[var(--text-primary)] font-medium">{subject.credits}</span></p>
                <p>Semester: <span className="text-[var(--text-primary)] font-medium">{subject.semester}</span></p>
                {subject.department && <p>Department: <span className="text-[var(--text-primary)] font-medium">{subject.department}</span></p>}
                <p>Faculty: <span className="text-[var(--text-primary)] font-medium">{subject.faculty?.name || 'Unassigned'}</span></p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Subject Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Subject">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Subject Code</label>
              <input 
                type="text" 
                required 
                value={formData.subjectCode} 
                onChange={e => setFormData({...formData, subjectCode: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="e.g. CS101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Subject Name</label>
              <input 
                type="text" 
                required 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Introduction to Programming"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Credits</label>
              <input 
                type="number" 
                required 
                min="1"
                value={formData.credits} 
                onChange={e => setFormData({...formData, credits: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
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
          
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Department</label>
            <input 
              type="text" 
              value={formData.department} 
              onChange={e => setFormData({...formData, department: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="e.g. Computer Science"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Assign Faculty</label>
            <select 
              value={formData.faculty} 
              onChange={e => setFormData({...formData, faculty: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Faculty...</option>
              {facultyList.map(faculty => (
                <option key={faculty._id} value={faculty._id}>{faculty.name}</option>
              ))}
            </select>
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
              {isSubmitting ? 'Saving...' : 'Save Subject'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
