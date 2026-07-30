import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { codingAPI } from '../../services/api';
import StatsCard from '../../components/common/StatsCard';
import ProgressBar from '../../components/common/ProgressBar';
import RadarChart from '../../components/charts/RadarChart';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { FiCode, FiAward, FiBarChart2, FiRefreshCw, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const mockProfile = {
  totalSolved: 342,
  difficulty: {
    easy: 120,
    medium: 180,
    hard: 42,
  },
  topics: {
    'Arrays': 80,
    'Strings': 60,
    'DP': 40,
    'Trees': 50,
    'Graphs': 30,
    'Math': 20,
  },
  platforms: {
    leetcode: { solved: 250, handle: 'coder123' },
    hackerrank: { solved: 92, handle: 'coder_hr' }
  }
};

export default function CodingPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncData, setSyncData] = useState({
    leetcodeSolved: '',
    hackerrankSolved: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await codingAPI.getProfile();
      if (data && data.data) {
        setProfile(data.data);
      } else {
        setProfile(mockProfile);
      }
    } catch (error) {
      console.error('Failed to fetch coding profile', error);
      toast.error('Using mock data. API not available.');
      setProfile(mockProfile);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (e) => {
    e.preventDefault();
    try {
      const updatePayload = {
        platforms: {
          leetcode: { solved: parseInt(syncData.leetcodeSolved) || profile.platforms.leetcode.solved },
          hackerrank: { solved: parseInt(syncData.hackerrankSolved) || profile.platforms.hackerrank.solved }
        },
        totalSolved: (parseInt(syncData.leetcodeSolved) || profile.platforms.leetcode.solved) + (parseInt(syncData.hackerrankSolved) || profile.platforms.hackerrank.solved)
      };
      // Optimistic update for mock data
      setProfile(prev => ({
        ...prev,
        ...updatePayload,
      }));
      await codingAPI.updateProfile(updatePayload);
      toast.success('Profile synced successfully');
      setIsSyncModalOpen(false);
    } catch (error) {
      toast.error('Failed to sync via API, updated locally');
      setIsSyncModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const topicLabels = Object.keys(profile?.topics || {});
  const topicData = Object.values(profile?.topics || {});

  const totalPossibleEasy = 800; // estimated
  const totalPossibleMedium = 1500;
  const totalPossibleHard = 600;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Coding Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track your problem-solving progress</p>
        </div>
        <Button onClick={() => setIsSyncModalOpen(true)} className="flex items-center gap-2">
          <FiRefreshCw />
          Sync Profiles
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Solved" 
          value={profile.totalSolved || ((profile.stats?.easy || profile.difficulty?.easy || 0) + (profile.stats?.medium || profile.difficulty?.medium || 0) + (profile.stats?.hard || profile.difficulty?.hard || 0))} 
          icon={FiCode} 
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          trend="up"
          trendValue="12"
        />
        <StatsCard 
          title="LeetCode" 
          value={profile.platforms?.leetcode?.solved || profile.platforms?.leetcode?.rating || 0} 
          icon={FiAward} 
          colorClass="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
        />
        <StatsCard 
          title="HackerRank" 
          value={profile.platforms?.hackerrank?.solved || profile.platforms?.hackerrank?.badges || 0} 
          icon={FiBarChart2} 
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Difficulty Breakdown" className="h-[400px]">
          <div className="flex flex-col justify-center h-full space-y-8 p-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Easy</span>
                <span className="text-slate-600 dark:text-slate-300 font-bold">{profile.stats?.easy || profile.difficulty?.easy || 0}</span>
              </div>
              <ProgressBar 
                percentage={((profile.stats?.easy || profile.difficulty?.easy || 0) / totalPossibleEasy) * 100} 
                color="bg-emerald-500" 
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-yellow-500 dark:text-yellow-400 font-medium">Medium</span>
                <span className="text-slate-600 dark:text-slate-300 font-bold">{profile.stats?.medium || profile.difficulty?.medium || 0}</span>
              </div>
              <ProgressBar 
                percentage={((profile.stats?.medium || profile.difficulty?.medium || 0) / totalPossibleMedium) * 100} 
                color="bg-yellow-500" 
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-rose-500 dark:text-rose-400 font-medium">Hard</span>
                <span className="text-slate-600 dark:text-slate-300 font-bold">{profile.stats?.hard || profile.difficulty?.hard || 0}</span>
              </div>
              <ProgressBar 
                percentage={((profile.stats?.hard || profile.difficulty?.hard || 0) / totalPossibleHard) * 100} 
                color="bg-rose-500" 
              />
            </div>
          </div>
        </Card>

        <Card title="Topic Distribution" className="h-[400px]">
          <div className="h-full w-full pb-8">
            <RadarChart 
              labels={topicLabels}
              data={topicData}
              label="Problems Solved"
              backgroundColor="rgba(99, 102, 241, 0.2)"
              borderColor="rgba(99, 102, 241, 1)"
            />
          </div>
        </Card>
      </div>

      {/* Sync Modal */}
      <AnimatePresence>
        {isSyncModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Sync Profiles</h3>
                <button onClick={() => setIsSyncModalOpen(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                  <FiX className="text-xl" />
                </button>
              </div>
              <form onSubmit={handleSync} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">LeetCode Solved</label>
                  <input
                    type="number"
                    value={syncData.leetcodeSolved}
                    onChange={(e) => setSyncData({...syncData, leetcodeSolved: e.target.value})}
                    placeholder={profile.platforms?.leetcode?.solved || "0"}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">HackerRank Solved</label>
                  <input
                    type="number"
                    value={syncData.hackerrankSolved}
                    onChange={(e) => setSyncData({...syncData, hackerrankSolved: e.target.value})}
                    placeholder={profile.platforms?.hackerrank?.solved || "0"}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsSyncModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
