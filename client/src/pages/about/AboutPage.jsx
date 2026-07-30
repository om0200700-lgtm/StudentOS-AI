import React from 'react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">About Developer</h1>
          <p className="text-[var(--text-secondary)] mt-1">Information about the creator of StudentOS AI.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-10 text-center flex flex-col items-center mt-8"
      >
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-5xl font-bold mb-6 shadow-2xl">
          OK
        </div>
        
        <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-2">Om Sundarrao Khandare</h2>
        <div className="px-4 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full font-semibold text-sm mb-6">
          Founder & Developer of StudentOS AI
        </div>
        
        <p className="text-[var(--text-secondary)] max-w-2xl text-lg leading-relaxed mb-12">
          "StudentOS AI is designed and developed by Om Sundarrao Khandare to help students manage academics, attendance, CGPA, coding practice, placement preparation, AI-powered study assistance, and smart analytics through one modern platform."
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-8">
          <div className="p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)]">
            <h3 className="font-bold text-xl mb-2">Vision</h3>
            <p className="text-sm text-[var(--text-secondary)]">To revolutionize how students manage their academic and professional journey through AI.</p>
          </div>
          <div className="p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)]">
            <h3 className="font-bold text-xl mb-2">Design</h3>
            <p className="text-sm text-[var(--text-secondary)]">Premium UI/UX tailored for maximum focus, productivity, and an exceptional user experience.</p>
          </div>
          <div className="p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)]">
            <h3 className="font-bold text-xl mb-2">Innovation</h3>
            <p className="text-sm text-[var(--text-secondary)]">Continuously integrating modern tech stacks to stay ahead of the curve.</p>
          </div>
        </div>

        <div className="w-full pt-8 border-t border-[var(--border-color)]">
          <p className="text-sm font-medium text-[var(--text-primary)]">StudentOS AI</p>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            © 2026 StudentOS AI. All Rights Reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
