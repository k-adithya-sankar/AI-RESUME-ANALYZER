import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { File, Brain, CheckCircle, Lightbulb, Play, History, Download } from 'lucide-react';
import StatCard from '../components/StatCard';
import UploadCard from '../components/UploadCard';
import RecentAnalysisTable from '../components/RecentAnalysisTable';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { title: 'Resume Uploaded', value: '12', icon: File, delay: 0 },
    { title: 'AI Resume Score', value: '92%', icon: Brain, delay: 0.1 },
    { title: 'ATS Compatibility', value: '88%', icon: CheckCircle, delay: 0.2 },
    { title: 'Suggestions', value: '26', icon: Lightbulb, delay: 0.3 },
  ];

  const quickActions = [
    { name: 'Analyze Resume', icon: Play, color: 'from-accent-blue to-accent-purple' },
    { name: 'View History', icon: History, color: 'from-purple-500 to-pink-500' },
    { name: 'Download Report', icon: Download, color: 'from-cyan-500 to-blue-500' },
  ];

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
          Welcome Back, {user?.name || 'User'} <span className="animate-wave inline-block origin-bottom-right">👋</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Upload your resume and let AI help you build a stronger career.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upload & Actions */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <UploadCard />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="glass-card p-6 flex flex-col gap-4"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Quick Actions</h3>
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button 
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} p-[1px]`}>
                      <div className="w-full h-full bg-secondary rounded-lg flex items-center justify-center">
                        <Icon size={18} className="text-white" />
                      </div>
                    </div>
                    <span className="font-medium text-gray-200 group-hover:text-white transition-colors">{action.name}</span>
                  </div>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Right Column: Recent Analysis Table */}
        <div className="lg:col-span-2">
          <RecentAnalysisTable />
        </div>
      </div>
    </div>
  );
}
