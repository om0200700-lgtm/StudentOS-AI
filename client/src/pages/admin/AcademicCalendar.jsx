import React, { useState, useEffect } from 'react';
import { calendarAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal';

export default function AcademicCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'holiday',
    startDate: '',
    endDate: '',
    audience: 'all'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await calendarAPI.getEvents();
      setEvents(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await calendarAPI.createEvent(formData);
      toast.success('Event added successfully');
      setIsModalOpen(false);
      setFormData({ title: '', type: 'holiday', startDate: '', endDate: '', audience: 'all' });
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this event?')) {
      try {
        await calendarAPI.deleteEvent(id);
        toast.success('Event deleted');
        fetchEvents();
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'holiday': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'exam': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'term': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Academic Calendar</h1>
          <p className="text-[var(--text-secondary)]">Manage holidays, exams, and term dates.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Add Event
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--text-secondary)]">Loading calendar...</div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-[var(--border-color)]">
                  <th className="p-4 font-semibold text-[var(--text-secondary)]">Event Title</th>
                  <th className="p-4 font-semibold text-[var(--text-secondary)]">Type</th>
                  <th className="p-4 font-semibold text-[var(--text-secondary)]">Date Range</th>
                  <th className="p-4 font-semibold text-[var(--text-secondary)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e._id} className="border-b border-[var(--border-color)] hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-medium text-[var(--text-primary)]">{e.title}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(e.type)} capitalize`}>
                        {e.type}
                      </span>
                    </td>
                    <td className="p-4 text-[var(--text-secondary)]">
                      {new Date(e.startDate).toLocaleDateString()} - {new Date(e.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(e._id)} className="text-red-500 hover:text-red-600 font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-[var(--text-secondary)]">No events scheduled.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Event" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Title</label>
            <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Type</label>
            <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none">
              <option value="holiday">Holiday</option>
              <option value="exam">Exam</option>
              <option value="term">Term/Semester</option>
              <option value="event">General Event</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Start Date</label>
              <input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">End Date</label>
              <input type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">{isSubmitting ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
