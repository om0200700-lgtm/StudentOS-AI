import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiOutlineTrash, HiCalculator, HiOutlineTrendingUp, HiOutlineLightBulb } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { cgpaAPI } from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LineChart from '../../components/charts/LineChart';

const GRADES = ['O', 'A+', 'A', 'B+', 'B', 'C', 'D', 'F'];

export default function CgpaPage() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cgpa, setCgpa] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  
  // Predictor state
  const [targetCgpa, setTargetCgpa] = useState(9.0);
  const [nextSemCredits, setNextSemCredits] = useState(20);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [newSem, setNewSem] = useState({
    semesterNumber: 1,
    subjects: [{ name: '', credits: 3, grade: 'A' }]
  });

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const res = await cgpaAPI.getAll().catch(() => ({ data: { data: [], cgpa: 0, totalCredits: 0 } }));
      setSemesters(res.data?.data || []);
      setCgpa(res.data?.cgpa || 0);
      setTotalCredits(res.data?.totalCredits || 0);
      
      // Auto-set next semester number in form
      if (res.data?.data?.length > 0) {
        setNewSem(prev => ({ ...prev, semesterNumber: res.data.data.length + 1 }));
      }
    } catch (error) {
      toast.error('Failed to load CGPA data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubjectRow = () => {
    setNewSem({
      ...newSem,
      subjects: [...newSem.subjects, { name: '', credits: 3, grade: 'A' }]
    });
  };

  const handleRemoveSubjectRow = (index) => {
    const updated = [...newSem.subjects];
    updated.splice(index, 1);
    setNewSem({ ...newSem, subjects: updated });
  };

  const handleSubjectChange = (index, field, value) => {
    const updated = [...newSem.subjects];
    updated[index][field] = value;
    setNewSem({ ...newSem, subjects: updated });
  };

  const handleAddSemester = async (e) => {
    e.preventDefault();
    if (newSem.subjects.some(s => !s.name)) return toast.error('All subjects must have a name');
    try {
      await cgpaAPI.create(newSem);
      setShowModal(false);
      fetchSemesters();
      toast.success('Semester added successfully!');
      // Reset form
      setNewSem({
        semesterNumber: newSem.semesterNumber + 1,
        subjects: [{ name: '', credits: 3, grade: 'A' }]
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add semester');
    }
  };

  const handleDelete = async (id) => {
    try {
      await cgpaAPI.delete(id);
      fetchSemesters();
      toast.success('Semester deleted');
    } catch (error) {
      toast.error('Failed to delete semester');
    }
  };

  // Math Logic for prediction
  // Target CGPA = ((Current CGPA * Current Credits) + (Required SGPA * Next Credits)) / (Current Credits + Next Credits)
  // Required SGPA = (Target CGPA * (Current Credits + Next Credits) - (Current CGPA * Current Credits)) / Next Credits
  const calculateRequiredSgpa = () => {
    if (totalCredits === 0 || nextSemCredits === 0) return 0;
    const required = ((targetCgpa * (totalCredits + nextSemCredits)) - (cgpa * totalCredits)) / nextSemCredits;
    return required.toFixed(2);
  };

  const requiredSgpa = calculateRequiredSgpa();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">CGPA Tracker & Predictor</h1>
          <p className="text-slate-500">Track your academic progress and predict future requirements</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <HiPlus className="w-5 h-5 mr-2" /> Add Semester
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-0">
            <h3 className="text-indigo-100 font-medium mb-2 flex items-center gap-2">
              <HiCalculator className="w-5 h-5" /> Overall CGPA
            </h3>
            <div className="text-6xl font-bold mb-2">{cgpa.toFixed(2)}</div>
            <p className="text-indigo-200">Total Credits Earned: {totalCredits}</p>
          </Card>
          
          <Card className="p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-slate-500 font-medium mb-1 flex items-center gap-2">
                <HiOutlineTrendingUp className="w-5 h-5" /> Equivalent Percentage
              </h3>
              <div className="text-4xl font-bold text-slate-800 mt-2">
                {cgpa > 0 ? (cgpa * 9.5).toFixed(2) : 0}%
              </div>
              <p className="text-sm text-slate-400 mt-1">Based on standard CGPA * 9.5 formula</p>
            </div>
            
            {semesters.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-600">
                  Latest SGPA: <strong className="text-slate-800">{semesters[semesters.length - 1].sgpa.toFixed(2)}</strong> (Sem {semesters[semesters.length - 1].semesterNumber})
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Predictor */}
        <Card className="p-6 bg-slate-50 border-slate-200">
          <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
            <HiOutlineLightBulb className="w-5 h-5 text-yellow-500" /> Target Predictor
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Target CGPA</label>
              <input type="number" step="0.1" max="10" value={targetCgpa} onChange={(e) => setTargetCgpa(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Next Semester Credits</label>
              <input type="number" value={nextSemCredits} onChange={(e) => setNextSemCredits(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            
            <div className={`p-4 rounded-xl mt-4 ${requiredSgpa > 10 ? 'bg-red-100 text-red-800' : requiredSgpa <= 0 ? 'bg-slate-200 text-slate-700' : 'bg-green-100 text-green-800'}`}>
              <p className="text-sm mb-1">Required SGPA to hit target:</p>
              <div className="text-2xl font-bold">
                {requiredSgpa > 10 ? 'Impossible (>10)' : requiredSgpa <= 0 ? 'Target achieved' : requiredSgpa}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Trend Chart */}
      {semesters.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">SGPA Trend</h3>
          <div className="h-72">
            <LineChart 
              labels={semesters.map(s => `Sem ${s.semesterNumber}`)}
              values={semesters.map(s => s.sgpa)}
              label="SGPA"
            />
          </div>
        </Card>
      )}

      {/* Semester Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {loading ? (
            <div className="col-span-full py-10 text-center text-slate-500">Loading semesters...</div>
          ) : semesters.length === 0 ? (
            <div className="col-span-full py-10 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
              No semesters added yet. Click "Add Semester" to calculate your CGPA.
            </div>
          ) : (
            semesters.map(sem => (
              <motion.div key={sem._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
                <Card className="p-5 relative group h-full flex flex-col">
                  <button onClick={() => handleDelete(sem._id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                  
                  <div className="flex justify-between items-end mb-4 pr-6">
                    <h3 className="text-xl font-bold text-slate-800">Semester {sem.semesterNumber}</h3>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-indigo-600">{sem.sgpa.toFixed(2)}</span>
                      <p className="text-xs text-slate-400">SGPA</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-3 flex-1 overflow-y-auto max-h-48 custom-scrollbar">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-100">
                        <tr>
                          <th className="px-2 py-1 rounded-l-md">Subject</th>
                          <th className="px-2 py-1 text-center">Cr</th>
                          <th className="px-2 py-1 text-center rounded-r-md">Gr</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sem.subjects.map((sub, idx) => (
                          <tr key={idx} className="border-b border-slate-100 last:border-0">
                            <td className="px-2 py-2 font-medium text-slate-700 truncate max-w-[120px]" title={sub.name}>{sub.name}</td>
                            <td className="px-2 py-2 text-center text-slate-500">{sub.credits}</td>
                            <td className="px-2 py-2 text-center font-bold text-slate-800">{sub.grade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-sm text-slate-500">
                    <span>Total Credits: {sem.totalCredits}</span>
                    <span>{sem.subjects.length} Subjects</span>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Add Semester Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl my-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Add Semester Record</h2>
            <form onSubmit={handleAddSemester}>
              <div className="mb-6 w-1/3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Semester Number</label>
                <input type="number" min="1" max="10" value={newSem.semesterNumber} onChange={(e) => setNewSem({...newSem, semesterNumber: parseInt(e.target.value) || 1})} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>

              <div className="mb-4 flex justify-between items-center">
                <h3 className="font-bold text-slate-700">Subjects</h3>
                <button type="button" onClick={handleAddSubjectRow} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center">
                  <HiPlus className="w-4 h-4 mr-1" /> Add Row
                </button>
              </div>

              <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {newSem.subjects.map((sub, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="block text-xs text-slate-500 mb-1">Subject Name</label>
                      <input type="text" value={sub.name} onChange={(e) => handleSubjectChange(index, 'name', e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="e.g. Data Structures" required />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs text-slate-500 mb-1">Credits</label>
                      <input type="number" min="1" max="10" value={sub.credits} onChange={(e) => handleSubjectChange(index, 'credits', parseInt(e.target.value) || 1)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" required />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs text-slate-500 mb-1">Grade</label>
                      <select value={sub.grade} onChange={(e) => handleSubjectChange(index, 'grade', e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm cursor-pointer">
                        {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    {newSem.subjects.length > 1 && (
                      <button type="button" onClick={() => handleRemoveSubjectRow(index)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mb-[2px]">
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <Button variant="secondary" onClick={() => setShowModal(false)} type="button" className="flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200">Cancel</Button>
                <Button variant="primary" type="submit" className="flex-1">Save Semester</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
