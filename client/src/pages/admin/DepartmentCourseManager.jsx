import React, { useState, useEffect } from 'react';
import { departmentAPI, courseAPI, adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal';

export default function DepartmentCourseManager() {
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deptForm, setDeptForm] = useState({ name: '', code: '', hod: '', description: '' });
  const [courseForm, setCourseForm] = useState({ name: '', code: '', department: '', totalSemesters: 8, creditsRequired: 160 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deptRes, courseRes, facRes] = await Promise.all([
        departmentAPI.getDepartments(),
        courseAPI.getCourses(),
        adminAPI.getUsers({ role: 'faculty' })
      ]);
      setDepartments(deptRes.data.data || []);
      setCourses(courseRes.data.data || []);
      setFaculty(facRes.data.data || []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDept = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...deptForm };
      if (!payload.hod) delete payload.hod; // Don't send empty string if no HOD selected
      
      await departmentAPI.createDepartment(payload);
      toast.success('Department created successfully');
      setIsDeptModalOpen(false);
      setDeptForm({ name: '', code: '', hod: '', description: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create department');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDept = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentAPI.deleteDepartment(id);
        toast.success('Department deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete department');
      }
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await courseAPI.createCourse(courseForm);
      toast.success('Course created successfully');
      setIsCourseModalOpen(false);
      setCourseForm({ name: '', code: '', department: '', totalSemesters: 8, creditsRequired: 160 });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseAPI.deleteCourse(id);
        toast.success('Course deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete course');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Departments & Courses</h1>
          <p className="text-[var(--text-secondary)]">Manage the academic structure.</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'departments' ? (
            <button 
              onClick={() => setIsDeptModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Add Department
            </button>
          ) : (
            <button 
              onClick={() => setIsCourseModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Add Course
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-4 border-b border-[var(--border-color)]">
        <button
          className={`pb-2 px-1 font-medium transition-colors ${activeTab === 'departments' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          onClick={() => setActiveTab('departments')}
        >
          Departments
        </button>
        <button
          className={`pb-2 px-1 font-medium transition-colors ${activeTab === 'courses' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          onClick={() => setActiveTab('courses')}
        >
          Courses
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--text-secondary)]">Loading...</div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          {activeTab === 'departments' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-[var(--border-color)]">
                    <th className="p-4 font-semibold text-[var(--text-secondary)]">Name</th>
                    <th className="p-4 font-semibold text-[var(--text-secondary)]">Code</th>
                    <th className="p-4 font-semibold text-[var(--text-secondary)]">HOD</th>
                    <th className="p-4 font-semibold text-[var(--text-secondary)] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((d) => (
                    <tr key={d._id} className="border-b border-[var(--border-color)] hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-medium text-[var(--text-primary)]">{d.name}</td>
                      <td className="p-4 text-[var(--text-secondary)]">{d.code}</td>
                      <td className="p-4 text-[var(--text-secondary)]">{d.hod ? d.hod.name : 'Not Assigned'}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDeleteDept(d._id)} className="text-red-500 hover:text-red-600 font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {departments.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-[var(--text-secondary)]">No departments found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-[var(--border-color)]">
                    <th className="p-4 font-semibold text-[var(--text-secondary)]">Name</th>
                    <th className="p-4 font-semibold text-[var(--text-secondary)]">Code</th>
                    <th className="p-4 font-semibold text-[var(--text-secondary)]">Department</th>
                    <th className="p-4 font-semibold text-[var(--text-secondary)]">Semesters</th>
                    <th className="p-4 font-semibold text-[var(--text-secondary)] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c._id} className="border-b border-[var(--border-color)] hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-medium text-[var(--text-primary)]">{c.name}</td>
                      <td className="p-4 text-[var(--text-secondary)]">{c.code}</td>
                      <td className="p-4 text-[var(--text-secondary)]">{c.department ? c.department.name : 'N/A'}</td>
                      <td className="p-4 text-[var(--text-secondary)]">{c.totalSemesters}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDeleteCourse(c._id)} className="text-red-500 hover:text-red-600 font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {courses.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-[var(--text-secondary)]">No courses found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Dept Modal */}
      <Modal isOpen={isDeptModalOpen} onClose={() => setIsDeptModalOpen(false)} title="Add Department" size="md">
        <form onSubmit={handleCreateDept} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Name</label>
            <input type="text" required value={deptForm.name} onChange={e => setDeptForm({...deptForm, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Code</label>
            <input type="text" required value={deptForm.code} onChange={e => setDeptForm({...deptForm, code: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none" placeholder="e.g. CSE" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">HOD (Optional)</label>
            <select value={deptForm.hod} onChange={e => setDeptForm({...deptForm, hod: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none">
              <option value="">Select Faculty...</option>
              {faculty.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsDeptModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">{isSubmitting ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      {/* Course Modal */}
      <Modal isOpen={isCourseModalOpen} onClose={() => setIsCourseModalOpen(false)} title="Add Course" size="md">
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Name</label>
            <input type="text" required value={courseForm.name} onChange={e => setCourseForm({...courseForm, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Code</label>
            <input type="text" required value={courseForm.code} onChange={e => setCourseForm({...courseForm, code: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none" placeholder="e.g. BTECH-CSE" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Department</label>
            <select required value={courseForm.department} onChange={e => setCourseForm({...courseForm, department: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none">
              <option value="">Select Department...</option>
              {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsCourseModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">{isSubmitting ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
