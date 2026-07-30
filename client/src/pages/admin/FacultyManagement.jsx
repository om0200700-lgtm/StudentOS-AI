import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal';

export default function FacultyManagement() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
  });

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getUsers({ role: 'faculty' });
      setFaculty(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load faculty');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // For creating a single faculty, we can just use the bulk API with one item
      await adminAPI.bulkUploadUsers({ users: [{ ...formData, role: 'faculty', password: 'Faculty@123' }] });
      toast.success('Faculty added successfully');
      setIsModalOpen(false);
      setFormData({ name: '', email: '', department: '' });
      fetchFaculty();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add faculty');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        await adminAPI.deleteUser(id);
        toast.success('Faculty deleted successfully');
        fetchFaculty();
      } catch (error) {
        toast.error('Failed to delete faculty');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Faculty Management</h1>
          <p className="text-[var(--text-secondary)]">Manage professors and teaching staff.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Add Faculty
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--text-secondary)]">Loading faculty...</div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-[var(--border-color)]">
                  <th className="p-4 font-semibold text-[var(--text-secondary)]">Name</th>
                  <th className="p-4 font-semibold text-[var(--text-secondary)]">Email</th>
                  <th className="p-4 font-semibold text-[var(--text-secondary)]">Department</th>
                  <th className="p-4 font-semibold text-[var(--text-secondary)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {faculty.map((f) => (
                  <tr key={f._id} className="border-b border-[var(--border-color)] hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-medium text-[var(--text-primary)]">{f.name}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{f.email}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{f.department || 'N/A'}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(f._id)} className="text-red-500 hover:text-red-600 font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
                {faculty.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-[var(--text-secondary)]">No faculty found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Faculty" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Full Name</label>
            <input 
              type="text" 
              required 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email</label>
            <input 
              type="email" 
              required 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Department</label>
            <input 
              type="text" 
              required 
              value={formData.department} 
              onChange={e => setFormData({...formData, department: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
            />
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
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
