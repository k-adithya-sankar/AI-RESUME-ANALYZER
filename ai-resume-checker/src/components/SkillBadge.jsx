import React from 'react';
import { motion } from 'framer-motion';

export default function SkillBadge({ name, delay = 0 }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-accent-purple/50 hover:text-white transition-all cursor-default shadow-[0_0_15px_rgba(255,255,255,0.02)] hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
    >
      {name}
    </motion.span>
  );
}
