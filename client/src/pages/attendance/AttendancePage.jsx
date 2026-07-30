import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiCheck, HiX, HiOutlineTrash, HiOutlinePencilAlt } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { attendanceAPI } from '../../services/api';
import Card from '../../components/common/Card';
import ProgressBar from '../../components/common/ProgressBar';
import Button from '../../components/common/Button';
import BarChart from '../../components/charts/BarChart';

export default function AttendancePage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ subjectName: '', targetPercentage: 75, totalClasses: 0, attendedClasses: 0 });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      // Fetch from backend, fallback to empty array if fail (e.g. backend error)
      const res = await attendanceAPI.getAll().catch(() => ({ data: { data: [] } }));
      setSubjects(res.data?.data || []);
    } catch (error) {
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.subjectName) return toast.error('Subject name is required');
    try {
      const res = await attendanceAPI.create(newSubject);
      setSubjects([res.data.data, ...subjects]);
      setShowModal(false);
      setNewSubject({ subjectName: '', targetPercentage: 75, totalClasses: 0, attendedClasses: 0 });
      toast.success('Subject added!');
    } catch (error) {
      toast.error('Failed to add subject');
    }
  };

  const handleDelete = async (id) => {
    try {
      await attendanceAPI.delete(id);
      setSubjects(subjects.filter(s => s._id !== id));
      toast.success('Subject deleted');
    } catch (error) {
      toast.error('Failed to delete subject');
    }
  };

  const handleLog = async (id, status) => {
    try {
      const res = await attendanceAPI.log(id, status);
      setSubjects(subjects.map(s => s._id === id ? res.data.data : s));
    } catch (error) {
      toast.error('Failed to log attendance');
    }
  };

  // Math Logic
  const getPercentage = (attended, total) => total === 0 ? 0 : Math.round((attended / total) * 100);
  
  const calculateClassesNeeded = (attended, total, target) => {
    const targetDec = target / 100;
    if (getPercentage(attended, total) >= target) return 0;
    // Formula: (attended + x) / (total + x) = targetDec
    // attended + x = targetDec * total + targetDec * x
    // x(1 - targetDec) = targetDec * total - attended
    // x = (targetDec * total - attended) / (1 - targetDec)
    const needed = (targetDec * total - attended) / (1 - targetDec);
    return Math.ceil(needed);
  };

  const calculateCanBunk = (attended, total, target) => {
    const targetDec = target / 100;
    if (getPercentage(attended, total) <= target) return 0;
    // Formula: attended / (total + x) = targetDec
    // x = (attended / targetDec) - total
    const bunk = (attended / targetDec) - total;
    return Math.floor(bunk);
  };

  // Overview Stats
  const totalClassesAttended = subjects.reduce((sum, s) => sum + s.attendedClasses, 0);
  const totalClassesConducted = subjects.reduce((sum, s) => sum + s.totalClasses, 0);
  const overallPercentage = getPercentage(totalClassesAttended, totalClassesConducted);
  const subjectsAtRisk = subjects.filter(s => getPercentage(s.attendedClasses, s.totalClasses) < s.targetPercentage).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Attendance Tracker</h1>
          <p className="text-slate-500">Monitor your classes and maintain your targets</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <HiPlus className="w-5 h-5 mr-2" /> Add Subject
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-slate-500 text-sm font-medium mb-1">Overall Attendance</h3>
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-bold ${overallPercentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
              {overallPercentage}%
            </span>
          </div>
          <ProgressBar percentage={overallPercentage} className="mt-4" color={overallPercentage >= 75 ? 'bg-green-500' : 'bg-red-500'} />
        </Card>
        
        <Card className="p-6">
          <h3 className="text-slate-500 text-sm font-medium mb-1">Total Classes</h3>
          <div className="text-4xl font-bold text-slate-800">{totalClassesConducted}</div>
          <p className="text-sm text-slate-500 mt-2">Attended: {totalClassesAttended} classes</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-slate-500 text-sm font-medium mb-1">Subjects at Risk</h3>
          <div className="text-4xl font-bold text-red-600">{subjectsAtRisk}</div>
          <p className="text-sm text-slate-500 mt-2">Subjects below target percentage</p>
        </Card>
      </div>

      {/* Analytics Chart */}
      {subjects.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Subject Analytics</h3>
          <div className="h-64">
            <BarChart 
              labels={subjects.map(s => s.subjectName)} 
              values={subjects.map(s => getPercentage(s.attendedClasses, s.totalClasses))} 
            />
          </div>
        </Card>
      )}

      {/* Subject Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {loading ? (
             <div className="col-span-full py-10 text-center text-slate-500">Loading subjects...</div>
          ) : subjects.length === 0 ? (
             <div className="col-span-full py-10 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
               No subjects added yet. Click "Add Subject" to get started.
             </div>
          ) : (
            subjects.map(subject => {
              const currentP = getPercentage(subject.attendedClasses, subject.totalClasses);
              const isSafe = currentP >= subject.targetPercentage;
              const needed75 = calculateClassesNeeded(subject.attendedClasses, subject.totalClasses, 75);
              const needed85 = calculateClassesNeeded(subject.attendedClasses, subject.totalClasses, 85);
              const bunk = calculateCanBunk(subject.attendedClasses, subject.totalClasses, subject.targetPercentage);
              
              return (
                <motion.div key={subject._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                  <Card className="p-5 flex flex-col h-full relative group">
                    <button onClick={() => handleDelete(subject._id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-1 pr-6 truncate">{subject.subjectName}</h3>
                    <p className="text-sm text-slate-500 mb-4">Target: {subject.targetPercentage}% • Attended: {subject.attendedClasses}/{subject.totalClasses}</p>
                    
                    <div className="flex items-end justify-between mb-2">
                      <span className={`text-3xl font-bold ${isSafe ? 'text-green-600' : 'text-red-500'}`}>{currentP}%</span>
                    </div>
                    <ProgressBar percentage={currentP} color={isSafe ? 'bg-green-500' : 'bg-red-500'} className="mb-6" />

                    <div className="bg-slate-50 p-3 rounded-lg mb-6 text-sm">
                      {!isSafe ? (
                        <p className="text-red-600 font-medium">Attend next {calculateClassesNeeded(subject.attendedClasses, subject.totalClasses, subject.targetPercentage)} classes to reach target.</p>
                      ) : (
                        <p className="text-green-600 font-medium">Safe! You can miss {bunk} class(es).</p>
                      )}
                      <p className="text-slate-600 mt-1 text-xs">Classes to 75%: {needed75} | To 85%: {needed85}</p>
                    </div>

                    <div className="mt-auto flex gap-2">
                      <button onClick={() => handleLog(subject._id, 'present')} className="flex-1 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors flex items-center justify-center">
                        <HiCheck className="w-5 h-5 mr-1" /> Present
                      </button>
                      <button onClick={() => handleLog(subject._id, 'absent')} className="flex-1 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors flex items-center justify-center">
                        <HiX className="w-5 h-5 mr-1" /> Absent
                      </button>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Add Subject</h2>
            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject Name</label>
                <input type="text" value={newSubject.subjectName} onChange={(e) => setNewSubject({...newSubject, subjectName: e.target.value})} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Operating Systems" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Total Classes</label>
                  <input type="number" min="0" value={newSubject.totalClasses} onChange={(e) => setNewSubject({...newSubject, totalClasses: parseInt(e.target.value) || 0})} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Attended Classes</label>
                  <input type="number" min="0" value={newSubject.attendedClasses} onChange={(e) => setNewSubject({...newSubject, attendedClasses: parseInt(e.target.value) || 0})} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target %</label>
                <input type="number" min="0" max="100" value={newSubject.targetPercentage} onChange={(e) => setNewSubject({...newSubject, targetPercentage: parseInt(e.target.value) || 75})} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" onClick={() => setShowModal(false)} type="button" className="flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200">Cancel</Button>
                <Button variant="primary" type="submit" className="flex-1">Add Subject</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
