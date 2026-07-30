import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[var(--bg-secondary)] overflow-hidden transition-colors">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar setMobileOpen={setMobileOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-7xl mx-auto h-full"
          >
            <Outlet />
            
            {/* Dashboard Footer */}
            <footer className="mt-12 pt-6 border-t border-[var(--border-color)] text-center pb-8">
              <p className="text-sm font-medium text-[var(--text-secondary)]">StudentOS AI</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1 opacity-75">
                Developed by Om Sundarrao Khandare<br />
                © 2026 StudentOS AI. All Rights Reserved.
              </p>
            </footer>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
