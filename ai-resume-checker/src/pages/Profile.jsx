import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Lock, Upload, Download, CheckCircle, Brain, Target, Calendar, User as UserIcon, Phone, MapPin } from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import SkillBadge from '../components/SkillBadge';
import ActivityTimeline from '../components/ActivityTimeline';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  const profileStats = [
    { title: 'Total Analyses', value: '47', icon: Target, delay: 0 },
    { title: 'Highest AI Score', value: '96%', icon: Brain, delay: 0.1 },
    { title: 'Avg ATS Score', value: '88%', icon: CheckCircle, delay: 0.2 },
  ];

  const skills = [
    'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'C++', 'SQL', 'MongoDB', 'Tailwind CSS'
  ];

  const profileActions = [
    { name: 'Edit Profile', icon: Edit2, color: 'from-accent-blue to-accent-purple' },
    { name: 'Change Password', icon: Lock, color: 'from-gray-600 to-gray-400' },
    { name: 'Upload New Resume', icon: Upload, color: 'from-accent-purple to-pink-500' },
    { name: 'Download Resume', icon: Download, color: 'from-cyan-500 to-blue-500' },
  ];

  const accountInfo = [
    { label: 'Username', value: '@janedoe', icon: UserIcon },
    { label: 'Email', value: user?.email || 'jane.doe@example.com', icon: Calendar },
    { label: 'Mobile Number', value: '+1 (555) 123-4567', icon: Phone },
    { label: 'Location', value: 'San Francisco, CA', icon: MapPin },
    { label: 'Account Created', value: 'January 15, 2023', icon: Calendar },
    { label: 'Last Login', value: 'Today, 10:42 AM', icon: Calendar },
  ];

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      
      <ProfileCard />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Profile Actions */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {profileActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <motion.button 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group w-full text-left"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg`}>
                  <Icon size={18} className="text-white" />
                </div>
                <span className="font-medium text-gray-200 group-hover:text-white transition-colors">{action.name}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Stats & Account Info */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {profileStats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-6">Account Information</h3>
              <div className="flex flex-col gap-5">
                {accountInfo.map((info, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <span className="text-gray-400 text-sm">{info.label}</span>
                    <span className="text-white font-medium text-sm text-right">{info.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Skills & Timeline */}
            <div className="flex flex-col gap-6">
              
              {/* Skills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <SkillBadge key={idx} name={skill} delay={0.5 + idx * 0.05} />
                  ))}
                </div>
              </motion.div>

              {/* Timeline */}
              <ActivityTimeline />
              
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
