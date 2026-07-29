import React from 'react';
import { Mail, Phone, GraduationCap, MapPin, Link, GitBranch, Award, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function ProfileCard() {
  const { user } = useAuth();

  const details = [
    { icon: Mail, label: 'Email', value: user?.email || 'jane.doe@example.com' },
    { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
    { icon: GraduationCap, label: 'Education', value: 'Stanford University (B.S. Computer Science)' },
    { icon: MapPin, label: 'Location', value: 'San Francisco, CA' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card overflow-hidden"
    >
      {/* Banner */}
      <div className="h-32 bg-gradient-to-r from-accent-blue/30 via-accent-purple/30 to-accent-blue/30 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="px-6 pb-6 relative">
        {/* Avatar */}
        <div className="absolute -top-16 left-6">
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple p-1 shadow-2xl shadow-accent-purple/30">
            <div className="w-full h-full bg-secondary rounded-xl flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {user?.name ? user.name.charAt(0) : 'J'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-20 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {user?.name || 'Jane Doe'}
              <Award size={20} className="text-accent-blue" />
            </h2>
            <p className="text-accent-purple font-medium mt-1">Software Engineer</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mt-6">
              {details.map((detail, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                  <detail.icon size={16} className="text-gray-500" />
                  <span>{detail.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links & Mini Stats */}
          <div className="flex flex-col gap-4 min-w-[200px]">
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-[#0077b5] transition-colors border border-white/10 hover:border-transparent">
                <Link size={20} />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] transition-colors border border-white/10 hover:border-transparent">
                <GitBranch size={20} />
              </a>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <FileText size={16} className="text-accent-blue" />
                <span className="text-sm font-medium text-gray-300">Current Resume</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-white leading-none">92</span>
                <span className="text-sm text-gray-400 mb-0.5">/ 100 Score</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
