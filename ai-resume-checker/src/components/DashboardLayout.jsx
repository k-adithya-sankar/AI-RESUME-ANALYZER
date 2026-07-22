import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopNavbar from './TopNavbar';

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen w-full bg-primary text-white overflow-x-hidden font-sans flex flex-col">
      {/* Image Background Layer */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/theme.png")' }}
      />

      <TopNavbar />

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col w-full min-h-screen relative z-10 pt-20">
        <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
