import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2, FiCalendar } from 'react-icons/fi';
import { examAPI, academicAPI } from '../../services/api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import { formatDate } from '../../utils/helpers';

export default function ExamManagement() {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Internal',
    semester: 1,
    branch: 'CSE',
    startDate: '',
    endDate: '',
    subjects: [] // { subject, date, startTime, endTime, room, maxMarks }
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsRes, subjectsRes] = await Promise.all([
        examAPI.getAll(),
        academicAPI.getSubjects()
      ]);
      setExams(examsRes.data);
      setSubjects(subjectsRes.data.data);
    } catch (error) {
      toast.error('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSubject = () => {
    setFormData({
      ...formData,
      subjects: [
        ...formData.subjects,
        { subject: '', date: '', startTime: '09:00', endTime: '12:00', room: '', maxMarks: 100 }
      ]
    });
  };

  const handleRemoveSubject = (index) => {
    const newSubjects = [...formData.subjects];
    newSubjects.splice(index, 1);
    setFormData({ ...formData, subjects: newSubjects });
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index][field] = value;
    setFormData({ ...formData, subjects: newSubjects });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await examAPI.create(formData);
      toast.success('Exam scheduled successfully');
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to schedule exam');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Examination Management</h1>
          <p className="text-[var(--text-secondary)]">Schedule and manage exams</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<FiPlus />}>Schedule Exam</Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-center py-12 text-[var(--text-secondary)]">Loading exams...</div>
        ) : exams.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-xl">
            No exams scheduled.
          </div>
        ) : (
          exams.map((exam) => (
            <Card key={exam._id} className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">{exam.title}</h2>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {exam.type}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        exam.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        exam.status === 'Upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {exam.status}
                      </span>
                  </div>
                  <p className="text-[var(--text-secondary)]">
                    Branch: {exam.branch} | Semester: {exam.semester} | {formatDate(exam.startDate)} - {formatDate(exam.endDate)}
                  </p>
                </div>
                <Button variant="danger" size="sm" icon={<FiTrash2 />} onClick={() => {
                  examAPI.delete(exam._id).then(() => fetchData()).catch(() => toast.error('Failed to delete'));
                }}>Delete</Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] text-[var(--text-secondary)]">
                      <th className="py-2 px-4">Subject</th>
                      <th className="py-2 px-4">Date</th>
                      <th className="py-2 px-4">Time</th>
                      <th className="py-2 px-4">Room</th>
                      <th className="py-2 px-4">Max Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exam.subjects.map((sub, i) => (
                      <tr key={i} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors">
                        <td className="py-2 px-4 font-medium text-[var(--text-primary)]">
                          {sub.subject?.name} ({sub.subject?.code})
                        </td>
                        <td className="py-2 px-4">{formatDate(sub.date)}</td>
                        <td className="py-2 px-4">{sub.startTime} - {sub.endTime}</td>
                        <td className="py-2 px-4">{sub.room}</td>
                        <td className="py-2 px-4">{sub.maxMarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Exam" size="xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Exam Title" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Type</label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Internal">Internal</option>
                <option value="External">External</option>
                <option value="Practical">Practical</option>
              </select>
            </div>
            <Input label="Branch" required value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value})} />
            <Input label="Semester" type="number" required min="1" max="8" value={formData.semester} onChange={(e) => setFormData({...formData, semester: e.target.value})} />
            <Input label="Start Date" type="date" required value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
            <Input label="End Date" type="date" required value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
          </div>

          <div className="border-t border-[var(--border-color)] pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[var(--text-primary)]">Subjects & Timetable</h3>
              <Button type="button" size="sm" variant="outline" onClick={handleAddSubject} icon={<FiPlus />}>Add Subject</Button>
            </div>
            
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {formData.subjects.map((sub, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end bg-[var(--bg-secondary)] p-3 rounded-lg">
                  <div className="col-span-3">
                    <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Subject</label>
              <select
                required
                value={sub.subject}
                onChange={(e) => handleSubjectChange(index, 'subject', e.target.value)}
                className="w-full bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
              </select>
            </div>
                  </div>
                  <div className="col-span-2">
                    <Input label="Date" type="date" required value={sub.date} onChange={(e) => handleSubjectChange(index, 'date', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <Input label="Start Time" type="time" required value={sub.startTime} onChange={(e) => handleSubjectChange(index, 'startTime', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <Input label="End Time" type="time" required value={sub.endTime} onChange={(e) => handleSubjectChange(index, 'endTime', e.target.value)} />
                  </div>
                  <div className="col-span-1">
                    <Input label="Room" value={sub.room} onChange={(e) => handleSubjectChange(index, 'room', e.target.value)} />
                  </div>
                  <div className="col-span-1">
                    <Input label="Marks" type="number" value={sub.maxMarks} onChange={(e) => handleSubjectChange(index, 'maxMarks', e.target.value)} />
                  </div>
                  <div className="col-span-1 pb-2 flex justify-center">
                    <button type="button" onClick={() => handleRemoveSubject(index)} className="text-red-500 hover:text-red-700 p-2"><FiTrash2 /></button>
                  </div>
                </div>
              ))}
              {formData.subjects.length === 0 && (
                <p className="text-sm text-[var(--text-secondary)] text-center py-4">No subjects added yet.</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[var(--border-color)]">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Schedule Exam</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
