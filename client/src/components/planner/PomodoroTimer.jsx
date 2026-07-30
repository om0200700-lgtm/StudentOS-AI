import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HiPlay, HiPause, HiRefresh } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Card from '../common/Card';

export default function PomodoroTimer({ onComplete }) {
  const [mode, setMode] = useState('25'); // '25' or '50'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      clearInterval(timerRef.current);
      setIsActive(false);
      handleComplete();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    // Play subtle sound (browser might block if no interaction, but we try)
    try {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(e => console.log('Audio play blocked'));
    } catch (e) {}

    toast.success(`Pomodoro completed! You studied for ${mode} minutes.`);
    if (onComplete) onComplete(parseInt(mode));
    resetTimer(mode);
  };

  const resetTimer = (newMode) => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(parseInt(newMode) * 60);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = 100 - (timeLeft / (parseInt(mode) * 60)) * 100;

  return (
    <Card className="p-8 flex flex-col items-center justify-center relative overflow-hidden group">
      {/* Background Progress Ring - CSS trick using radial gradient */}
      <div 
        className="absolute inset-0 opacity-10 transition-all duration-1000"
        style={{ background: `conic-gradient(from 0deg, #4f46e5 ${progress}%, transparent ${progress}%)` }}
      />
      
      <div className="z-10 w-full flex justify-center gap-4 mb-8">
        <button 
          onClick={() => resetTimer('25')} 
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${mode === '25' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          25 / 5
        </button>
        <button 
          onClick={() => resetTimer('50')} 
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${mode === '50' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          50 / 10
        </button>
      </div>

      <motion.div 
        key={mode + isActive}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="z-10 text-7xl font-bold text-slate-800 tracking-tight font-mono mb-8 drop-shadow-sm"
      >
        {formatTime(timeLeft)}
      </motion.div>

      <div className="z-10 flex gap-4">
        <button 
          onClick={toggleTimer}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all focus:ring-4 focus:ring-indigo-300"
        >
          {isActive ? <HiPause className="w-8 h-8" /> : <HiPlay className="w-8 h-8 ml-1" />}
        </button>
        <button 
          onClick={() => resetTimer(mode)}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-white text-slate-600 shadow-lg border border-slate-200 hover:bg-slate-50 hover:text-slate-800 hover:scale-105 transition-all"
        >
          <HiRefresh className="w-6 h-6" />
        </button>
      </div>
    </Card>
  );
}
