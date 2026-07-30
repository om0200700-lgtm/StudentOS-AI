import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { academicAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ResultsPage() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await academicAPI.getResults();
      setResults(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    // Demo calculation for semester 1 for current student (usually admin does this for everyone)
    try {
      await academicAPI.calculateResult({ studentId: user._id, semester: 1 });
      toast.success('Result calculated successfully');
      fetchResults();
    } catch (error) {
      toast.error('Failed to calculate result');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Academic Results</h1>
          <p className="text-[var(--text-secondary)]">View SGPA, CGPA, and semester status.</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'faculty') && (
          <button onClick={handleCalculate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Calculate Results
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : results.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl">
          <p className="text-[var(--text-secondary)]">No results published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <motion.div key={result._id} whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl text-center">
              <h3 className="font-bold text-xl text-[var(--text-primary)] mb-2">Semester {result.semester}</h3>
              
              {user?.role !== 'student' && (
                <p className="text-sm text-[var(--text-secondary)] mb-4">{result.student?.name} ({result.student?.rollNumber})</p>
              )}

              <div className="flex justify-center gap-8 my-6">
                <div>
                  <p className="text-[var(--text-secondary)] text-sm mb-1">SGPA</p>
                  <p className="text-3xl font-bold text-blue-500">{result.sgpa}</p>
                </div>
                <div>
                  <p className="text-[var(--text-secondary)] text-sm mb-1">CGPA</p>
                  <p className="text-3xl font-bold text-purple-500">{result.cgpa}</p>
                </div>
              </div>
              
              <div className={`py-2 px-4 rounded-lg inline-block font-semibold uppercase tracking-wider text-sm ${
                result.status === 'pass' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {result.status}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
