import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { placementAPI } from '../../services/api';
import Card from '../../components/common/Card';
import { FiCheckCircle, FiCircle, FiChevronDown, FiBriefcase, FiTarget } from 'react-icons/fi';
import toast from 'react-hot-toast';

const mockChecklists = {
  dsa: {
    title: 'Data Structures & Algorithms',
    items: [
      { id: 'dsa1', text: 'Arrays & Strings (Mastery)', completed: true },
      { id: 'dsa2', text: 'Linked Lists & Trees', completed: true },
      { id: 'dsa3', text: 'Dynamic Programming', completed: false },
      { id: 'dsa4', text: 'Graphs & Advanced DSA', completed: false },
    ]
  },
  aptitude: {
    title: 'Quantitative & Aptitude',
    items: [
      { id: 'apt1', text: 'Number System & Algebra', completed: true },
      { id: 'apt2', text: 'Time, Speed & Distance', completed: true },
      { id: 'apt3', text: 'Logical Reasoning', completed: true },
      { id: 'apt4', text: 'Data Interpretation', completed: false },
    ]
  },
  core: {
    title: 'Core Subjects',
    items: [
      { id: 'core1', text: 'Object Oriented Programming (OOPs)', completed: true },
      { id: 'core2', text: 'Database Management Systems (DBMS)', completed: false },
      { id: 'core3', text: 'Operating Systems (OS)', completed: false },
      { id: 'core4', text: 'Computer Networks (CN)', completed: false },
    ]
  },
  resume: {
    title: 'Resume & Profiles',
    items: [
      { id: 'res1', text: 'ATS Friendly Resume Drafted', completed: true },
      { id: 'res2', text: 'LinkedIn Profile Optimized', completed: true },
      { id: 'res3', text: 'GitHub Profile Updated', completed: false },
    ]
  },
  projects: {
    title: 'Projects & Portfolio',
    items: [
      { id: 'proj1', text: 'Major Project Completed', completed: true },
      { id: 'proj2', text: 'Minor/Hackathon Project', completed: true },
      { id: 'proj3', text: 'Projects Hosted/Deployed', completed: false },
    ]
  },
  mock: {
    title: 'Mock Interviews',
    items: [
      { id: 'mock1', text: 'Technical Mock Interview 1', completed: false },
      { id: 'mock2', text: 'HR Mock Interview', completed: false },
    ]
  }
};

const CircularProgress = ({ percentage }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="transform -rotate-90 w-40 h-40">
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-slate-200 dark:text-slate-700"
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          className="text-blue-600 dark:text-blue-500 drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-800 dark:text-white">
          {Math.round(percentage)}%
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">Ready</span>
      </div>
    </div>
  );
};

export default function PlacementPage() {
  const [prep, setPrep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    fetchPrep();
  }, []);

  const fetchPrep = async () => {
    try {
      setLoading(true);
      const { data } = await placementAPI.getPrep();
      if (data && data.data) {
        setPrep(mapBackendToUI(data.data));
      } else {
        setPrep(mockChecklists);
      }
    } catch (error) {
      console.error('Failed to fetch placement prep', error);
      toast.error('Using mock data. API not available.');
      setPrep(mockChecklists);
    } finally {
      setLoading(false);
    }
  };

  const mapBackendToUI = (backendPrep) => {
    // deep clone mockChecklists as template
    const uiData = JSON.parse(JSON.stringify(mockChecklists));
    
    // Map DSA
    if (backendPrep.dsa) {
      uiData.dsa.items[0].completed = backendPrep.dsa.arrays || backendPrep.dsa.strings || false;
      uiData.dsa.items[1].completed = backendPrep.dsa.linkedLists || backendPrep.dsa.trees || false;
      uiData.dsa.items[2].completed = backendPrep.dsa.dp || false;
      uiData.dsa.items[3].completed = backendPrep.dsa.graphs || false;
    }
    
    // Map Aptitude
    if (backendPrep.aptitude) {
      uiData.aptitude.items[0].completed = backendPrep.aptitude.quant || false;
      uiData.aptitude.items[1].completed = backendPrep.aptitude.logical || false;
      uiData.aptitude.items[2].completed = backendPrep.aptitude.verbal || false;
      uiData.aptitude.items[3].completed = false; // dummy
    }
    
    // Map Core
    if (backendPrep.coreSubjects) {
      uiData.core.items[0].completed = backendPrep.coreSubjects.oops || false;
      uiData.core.items[1].completed = backendPrep.coreSubjects.dbms || false;
      uiData.core.items[2].completed = backendPrep.coreSubjects.os || false;
      uiData.core.items[3].completed = backendPrep.coreSubjects.cn || false;
    }
    
    // Map Resume
    if (backendPrep.portfolio) {
      uiData.resume.items[0].completed = backendPrep.portfolio.resume || false;
      uiData.resume.items[1].completed = backendPrep.portfolio.linkedin || false;
      uiData.resume.items[2].completed = backendPrep.portfolio.github || false;
    }
    
    // Map Projects
    if (backendPrep.projects) {
      uiData.projects.items[0].completed = backendPrep.projects.project1 || false;
      uiData.projects.items[1].completed = backendPrep.projects.project2 || false;
      uiData.projects.items[2].completed = false;
    }
    
    // Map Mock
    if (backendPrep.interviews) {
      uiData.mock.items[0].completed = backendPrep.interviews.mock1 || false;
      uiData.mock.items[1].completed = backendPrep.interviews.mock2 || false;
    }
    
    return uiData;
  };

  const toggleItem = async (categoryKey, itemId) => {
    // Optimistic update
    const newPrep = { ...prep };
    const itemIndex = newPrep[categoryKey].items.findIndex(i => i.id === itemId);
    if (itemIndex > -1) {
      newPrep[categoryKey].items[itemIndex].completed = !newPrep[categoryKey].items[itemIndex].completed;
      setPrep(newPrep);
      
      // we won't sync to backend since schema differs wildly, 
      // but in real app we'd map it back.
      // just catch error silently
    }
  };

  const toggleCategory = (key) => {
    if (expandedCategory === key) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(key);
    }
  };

  if (loading || !prep) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  let totalItems = 0;
  let completedItems = 0;
  
  Object.values(prep).forEach(cat => {
    cat.items.forEach(item => {
      totalItems++;
      if (item.completed) completedItems++;
    });
  });

  const readinessScore = totalItems === 0 ? 0 : (completedItems / totalItems) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Placement Prep</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track your readiness for campus placements</p>
        </div>
      </div>

      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
            <FiTarget className="text-3xl" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Global Readiness Score</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            You have completed {completedItems} out of {totalItems} key preparation milestones. Keep pushing forward!
          </p>
        </div>
        <div className="flex-shrink-0">
          <CircularProgress percentage={readinessScore} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <FiBriefcase /> Preparation Checklist
        </h3>
        
        {Object.entries(prep).map(([key, category]) => {
          const catTotal = category.items.length;
          const catCompleted = category.items.filter(i => i.completed).length;
          const isExpanded = expandedCategory === key;
          
          return (
            <motion.div 
              key={key}
              layout
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button 
                onClick={() => toggleCategory(key)}
                className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{category.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {catCompleted} of {catTotal} completed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden hidden sm:block">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(catCompleted / catTotal) * 100}%` }}
                      className="h-full bg-blue-500 rounded-full"
                    />
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiChevronDown className="text-xl text-slate-500" />
                  </motion.div>
                </div>
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                      {category.items.map(item => (
                        <div 
                          key={item.id}
                          onClick={() => toggleItem(key, item.id)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                        >
                          {item.completed ? (
                            <FiCheckCircle className="text-xl text-emerald-500 flex-shrink-0" />
                          ) : (
                            <FiCircle className="text-xl text-slate-300 dark:text-slate-600 flex-shrink-0" />
                          )}
                          <span className={`${item.completed ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'} transition-all`}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
