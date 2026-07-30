import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { academicAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal';

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjects, setSubjects] = useState([]);
  
  const [activeAssignmentId, setActiveAssignmentId] = useState(null);
  const [submitFileUrl, setSubmitFileUrl] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    subject: '',
    semester: 1,
    section: 'A'
  });

  useEffect(() => {
    fetchAssignments();
    if (user?.role === 'admin' || user?.role === 'faculty') {
      fetchSubjects();
    }
  }, [user]);

  const fetchAssignments = async () => {
    try {
      const res = await academicAPI.getAssignments();
      setAssignments(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await academicAPI.getSubjects();
      setSubjects(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch subjects', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await academicAPI.createAssignment(formData);
      toast.success('Assignment created successfully!');
      setIsModalOpen(false);
      setFormData({ title: '', description: '', dueDate: '', subject: '', semester: 1, section: 'A' });
      fetchAssignments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenSubmit = (id) => {
    setActiveAssignmentId(id);
    setSubmitFileUrl('');
    setIsSubmitModalOpen(true);
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!submitFileUrl) return toast.error('Please provide a submission link');
    
    setIsSubmitting(true);
    try {
      await academicAPI.submitAssignment(activeAssignmentId, { fileUrl: submitFileUrl });
      toast.success('Assignment submitted successfully');
      setIsSubmitModalOpen(false);
      fetchAssignments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Assignments</h1>
          <p className="text-[var(--text-secondary)]">Manage and submit academic assignments.</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'faculty') && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Create Assignment
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : assignments.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl">
          <p className="text-[var(--text-secondary)]">No assignments found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map(assignment => {
            const isOverdue = new Date(assignment.dueDate) < new Date();
            
            return (
              <motion.div key={assignment._id} whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-[var(--text-primary)]">{assignment.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-md ${isOverdue ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                    {isOverdue ? 'Overdue' : 'Active'}
                  </span>
                </div>
                
                <p className="text-sm font-medium text-blue-500 mb-2">{assignment.subject?.name} ({assignment.subject?.subjectCode})</p>
                <p className="text-sm text-[var(--text-secondary)] mb-4 flex-grow">{assignment.description}</p>
                
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-[var(--border-color)]">
                  <div className="text-xs text-[var(--text-secondary)]">
                    <p>Faculty: {assignment.faculty?.name}</p>
                    <p className={`font-semibold ${isOverdue ? 'text-red-500' : 'text-slate-500'}`}>
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {user?.role === 'student' && !isOverdue && (
                    <button 
                      onClick={() => handleOpenSubmit(assignment._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg font-medium transition-colors"
                    >
                      Submit
                    </button>
                  )}
                  {user?.role === 'student' && isOverdue && (
                    <button disabled className="bg-slate-300 dark:bg-slate-700 text-slate-500 text-sm px-4 py-1.5 rounded-lg font-medium cursor-not-allowed">
                      Closed
                    </button>
                  )}
                  {user?.role !== 'student' && (
                    <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                      View Submissions
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Assignment Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Assignment">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Title</label>
            <input 
              type="text" 
              required 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="e.g. Assignment 1: React Basics"
            />
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
          
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Description</label>
            <textarea 
              required 
              rows={3}
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 resize-none custom-scrollbar"
              placeholder="Assignment instructions..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Due Date</label>
              <input 
                type="datetime-local" 
                required 
                value={formData.dueDate} 
                onChange={e => setFormData({...formData, dueDate: e.target.value})}
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
              {isSubmitting ? 'Creating...' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Submit Assignment Modal */}
      <Modal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} title="Submit Assignment">
        <form onSubmit={handleSubmitAssignment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Submission File URL</label>
            <input 
              type="url" 
              required 
              value={submitFileUrl} 
              onChange={e => setSubmitFileUrl(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="e.g. https://github.com/my-submission"
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1">Provide a link to your code repository or PDF drive link.</p>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={() => setIsSubmitModalOpen(false)}
              className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
