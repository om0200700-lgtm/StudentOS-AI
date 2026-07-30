import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { academicAPI, adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal';

export default function TimetablePage() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const [formData, setFormData] = useState({
    department: 'Computer Science',
    semester: 1,
    section: 'A',
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    subject: '',
    faculty: '',
    room: ''
  });

  useEffect(() => {
    fetchTimetable();
    if (user?.role === 'admin' || user?.role === 'faculty') {
      fetchFormData();
    }
  }, [user]);

  const fetchTimetable = async () => {
    try {
      const res = await academicAPI.getTimetable();
      setTimetable(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load timetable');
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
      setFaculty(allUsers.filter(u => u.role === 'faculty'));
    } catch (error) {
      console.error('Failed to fetch form data', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        department: formData.department,
        semester: Number(formData.semester),
        section: formData.section,
        dayOfWeek: formData.dayOfWeek,
        periods: [{
          startTime: formData.startTime,
          endTime: formData.endTime,
          subject: formData.subject,
          faculty: formData.faculty,
          room: formData.room
        }]
      };
      
      await academicAPI.createTimetable(payload);
      toast.success('Timetable period added successfully!');
      setIsModalOpen(false);
      // Reset only time/subject specific fields
      setFormData(prev => ({ ...prev, startTime: '', endTime: '', subject: '', faculty: '', room: '' }));
      fetchTimetable();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add timetable period');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDaySchedule = (day) => {
    return timetable.filter(t => t.dayOfWeek === day);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Class Timetable</h1>
          <p className="text-[var(--text-secondary)]">Weekly schedule of classes and labs.</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'faculty') && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Add Period
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : timetable.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl">
          <p className="text-[var(--text-secondary)]">No timetable created yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {days.map(day => {
            const daySchedule = getDaySchedule(day);
            if (daySchedule.length === 0) return null;
            
            return (
              <div key={day} className="glass-card p-6 rounded-2xl">
                <h3 className="font-bold text-lg text-[var(--text-primary)] mb-4 pb-2 border-b border-[var(--border-color)]">{day}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {daySchedule.map((t) => (
                    t.periods.map((period, idx) => (
                      <div key={`${t._id}-${idx}`} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-[var(--border-color)]">
                        <div className="text-blue-500 font-semibold text-sm mb-1">
                          {period.startTime} - {period.endTime}
                        </div>
                        <h4 className="font-bold text-[var(--text-primary)]">{period.subject?.name}</h4>
                        <div className="mt-2 text-xs text-[var(--text-secondary)] space-y-1">
                          <p>Faculty: {period.faculty?.name}</p>
                          <p>Room: {period.room}</p>
                          {user?.role !== 'student' && (
                            <p className="text-blue-400 mt-2 block">Sem {t.semester} - Sec {t.section}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Period Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Timetable Period" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-[var(--border-color)]">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Department</label>
              <input 
                type="text" 
                required 
                value={formData.department} 
                onChange={e => setFormData({...formData, department: e.target.value})}
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
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Section</label>
              <input 
                type="text" 
                required 
                value={formData.section} 
                onChange={e => setFormData({...formData, section: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Day</label>
              <select 
                required
                value={formData.dayOfWeek} 
                onChange={e => setFormData({...formData, dayOfWeek: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Start Time</label>
              <input 
                type="time" 
                required 
                value={formData.startTime} 
                onChange={e => setFormData({...formData, startTime: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">End Time</label>
              <input 
                type="time" 
                required 
                value={formData.endTime} 
                onChange={e => setFormData({...formData, endTime: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Subject</label>
              <select 
                required
                value={formData.subject} 
                onChange={e => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Select...</option>
                {subjects.map(sub => (
                  <option key={sub._id} value={sub._id}>{sub.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Faculty</label>
              <select 
                required
                value={formData.faculty} 
                onChange={e => setFormData({...formData, faculty: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Select...</option>
                {faculty.map(f => (
                  <option key={f._id} value={f._id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Room</label>
              <input 
                type="text" 
                required 
                value={formData.room} 
                onChange={e => setFormData({...formData, room: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="e.g. Room 101"
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
              {isSubmitting ? 'Adding...' : 'Add Period'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
