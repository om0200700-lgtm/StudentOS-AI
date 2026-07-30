import React, { useState, useEffect, useRef } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal';
import Papa from 'papaparse';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ department: '', semester: '' });
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getUsers({ role: 'student', ...filters });
      setStudents(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = (e) => {
    e.preventDefault();
    const file = fileInputRef.current?.files[0];
    if (!file) return toast.error('Please select a CSV file');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        setIsSubmitting(true);
        try {
          const res = await adminAPI.bulkUploadUsers({ users: results.data });
          toast.success(`Successfully added ${res.data.data.successful} students!`);
          if (res.data.data.failed > 0) {
            toast.error(`Failed to add ${res.data.data.failed} students.`);
          }
          setIsBulkModalOpen(false);
          fetchStudents();
        } catch (error) {
          toast.error(error.response?.data?.message || 'Bulk upload failed');
        } finally {
          setIsSubmitting(false);
        }
      },
      error: (err) => {
        toast.error('Error parsing CSV file');
      }
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await adminAPI.deleteUser(id);
        toast.success('Student deleted successfully');
        fetchStudents();
      } catch (error) {
        toast.error('Failed to delete student');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Student Management</h1>
          <p className="text-[var(--text-secondary)]">Manage all students across departments.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsBulkModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Bulk Import CSV
          </button>
        </div>
      </div>

      <div className="glass-card p-4 rounded-2xl flex gap-4">
        <select 
          value={filters.department} 
          onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
          className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
        >
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Electronics">Electronics</option>
        </select>
        <select 
          value={filters.semester} 
          onChange={(e) => setFilters(prev => ({ ...prev, semester: e.target.value }))}
          className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
        >
          <option value="">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--text-secondary)]">Loading students...</div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-[var(--border-color)]">
                  <th className="p-4 font-semibold text-[var(--text-secondary)]">Name</th>
                  <th className="p-4 font-semibold text-[var(--text-secondary)]">Email</th>
                  <th className="p-4 font-semibold text-[var(--text-secondary)]">Roll No</th>
                  <th className="p-4 font-semibold text-[var(--text-secondary)]">Dept & Sem</th>
                  <th className="p-4 font-semibold text-[var(--text-secondary)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="border-b border-[var(--border-color)] hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-medium text-[var(--text-primary)]">{student.name}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{student.email}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{student.rollNumber || 'N/A'}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{student.department || 'N/A'} - Sem {student.semester}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(student._id)} className="text-red-500 hover:text-red-600 font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-[var(--text-secondary)]">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      <Modal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} title="Bulk Import Students" size="md">
        <form onSubmit={handleBulkUpload} className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Upload a CSV file with the following headers:<br />
            <code>name, email, rollNumber, department, semester, section</code>
          </p>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 p-8 text-center rounded-xl">
            <input 
              type="file" 
              accept=".csv" 
              required
              ref={fileInputRef}
              className="w-full text-[var(--text-primary)]"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={() => setIsBulkModalOpen(false)}
              className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
            >
              {isSubmitting ? 'Uploading...' : 'Upload CSV'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
