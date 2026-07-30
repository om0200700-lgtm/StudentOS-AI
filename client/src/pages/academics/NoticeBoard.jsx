import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { academicAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal';
import { FiTrash2 } from 'react-icons/fi';

export default function NoticeBoard() {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetAudience: 'all',
    type: 'college',
    department: ''
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await academicAPI.getNotices();
      setNotices(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Faculty defaults to department notices automatically in backend, but we can set it here too
      const dataToSubmit = { ...formData };
      if (user?.role === 'faculty') {
        dataToSubmit.type = 'department';
      }
      
      await academicAPI.createNotice(dataToSubmit);
      toast.success('Notice posted successfully!');
      setIsModalOpen(false);
      setFormData({ title: '', content: '', targetAudience: 'all', type: 'college', department: '' });
      fetchNotices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post notice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await academicAPI.deleteNotice(id);
        toast.success('Notice deleted');
        fetchNotices();
      } catch (error) {
        toast.error('Failed to delete notice');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Notice Board</h1>
          <p className="text-[var(--text-secondary)]">Important announcements and updates.</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'faculty') && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Post Notice
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : notices.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl">
          <p className="text-[var(--text-secondary)]">No notices at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map(notice => (
            <motion.div key={notice._id} whileHover={{ x: 4 }} className="glass-card p-6 rounded-2xl flex flex-col gap-3 border-l-4 border-l-blue-500 relative group">
              {(user?.role === 'admin' || notice.author?._id === user?._id) && (
                <button 
                  onClick={() => handleDelete(notice._id)}
                  className="absolute top-4 right-4 p-2 bg-red-100 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50"
                  title="Delete Notice"
                >
                  <FiTrash2 />
                </button>
              )}
              
              <div className="flex justify-between items-center pr-12">
                <h3 className="font-bold text-lg text-[var(--text-primary)]">{notice.title}</h3>
                <span className="text-xs text-[var(--text-secondary)] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md capitalize">
                  {notice.type} Notice
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">{notice.content}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                <span>By {notice.author?.name}</span>
                <span>•</span>
                <span className="capitalize">To: {notice.targetAudience}</span>
                <span>•</span>
                <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Post Notice Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Post New Notice">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Title</label>
            <input 
              type="text" 
              required 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Notice title..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Content</label>
            <textarea 
              required 
              rows={4}
              value={formData.content} 
              onChange={e => setFormData({...formData, content: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 resize-none custom-scrollbar"
              placeholder="Write the full notice content here..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Target Audience</label>
              <select 
                value={formData.targetAudience} 
                onChange={e => setFormData({...formData, targetAudience: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="all">Everyone</option>
                <option value="students">Students Only</option>
                <option value="faculty">Faculty Only</option>
                <option value="department">Specific Department</option>
              </select>
            </div>
            
            {user?.role === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Notice Type</label>
                <select 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="college">College Level</option>
                  <option value="department">Department Level</option>
                </select>
              </div>
            )}
          </div>

          {(formData.targetAudience === 'department' || formData.type === 'department') && (
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Department Name</label>
              <input 
                type="text" 
                value={formData.department} 
                onChange={e => setFormData({...formData, department: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="e.g. Computer Science"
              />
            </div>
          )}

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
              {isSubmitting ? 'Posting...' : 'Post Notice'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
