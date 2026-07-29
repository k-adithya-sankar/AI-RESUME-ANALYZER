import React from 'react';
import { motion } from 'framer-motion';
import { Upload, BrainCircuit, Download, Edit3 } from 'lucide-react';

const activities = [
  { id: 1, title: 'Resume Uploaded', time: '2 hours ago', icon: Upload, color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
  { id: 2, title: 'AI Analysis Completed', time: '2 hours ago', icon: BrainCircuit, color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
  { id: 3, title: 'Report Downloaded', time: '1 day ago', icon: Download, color: 'text-green-400', bg: 'bg-green-400/10' },
  { id: 4, title: 'Profile Updated', time: '3 days ago', icon: Edit3, color: 'text-orange-400', bg: 'bg-orange-400/10' },
];

export default function ActivityTimeline() {
  return (
    <div className="glass-card p-6 h-full">
      <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
      
      <div className="relative border-l border-white/10 ml-4 space-y-8">
        {activities.map((activity, idx) => {
          const Icon = activity.icon;
          return (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="relative pl-6"
            >
              <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full ${activity.bg} flex items-center justify-center border border-white/10 shadow-lg backdrop-blur-md`}>
                <Icon size={14} className={activity.color} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{activity.title}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
