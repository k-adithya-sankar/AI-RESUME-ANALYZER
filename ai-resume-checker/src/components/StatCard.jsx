import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass-card p-6 flex items-center justify-between group hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-shadow duration-300 relative overflow-hidden"
    >
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/0 to-accent-purple/0 group-hover:from-accent-blue/10 group-hover:to-accent-purple/10 transition-colors duration-500" />
      
      <div className="relative z-10">
        <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      </div>
      
      <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
        <Icon size={24} className="text-accent-blue group-hover:text-accent-purple transition-colors" />
      </div>
    </motion.div>
  );
}
