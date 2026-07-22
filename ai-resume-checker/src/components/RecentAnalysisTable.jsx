import React from 'react';
import { motion } from 'framer-motion';
import { FileText, MoreHorizontal } from 'lucide-react';

const dummyData = [
  { id: 1, name: 'Frontend_Dev_Resume.pdf', aiScore: 92, atsScore: 88, date: 'Oct 24, 2023', status: 'Excellent' },
  { id: 2, name: 'Software_Engineer_v2.docx', aiScore: 78, atsScore: 72, date: 'Oct 20, 2023', status: 'Good' },
  { id: 3, name: 'UI_UX_Designer_Draft.pdf', aiScore: 45, atsScore: 50, date: 'Oct 15, 2023', status: 'Needs Improvement' },
  { id: 4, name: 'React_Developer_Resume.pdf', aiScore: 89, atsScore: 85, date: 'Oct 10, 2023', status: 'Excellent' },
  { id: 5, name: 'Old_Resume_2022.pdf', aiScore: 60, atsScore: 55, date: 'Sep 28, 2023', status: 'Needs Improvement' },
];

export default function RecentAnalysisTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="glass-card overflow-hidden"
    >
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Recent Analysis</h3>
        <button className="text-sm font-medium text-accent-blue hover:text-accent-purple transition-colors">
          View All
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Resume Name</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Score</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">ATS Score</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Upload Date</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {dummyData.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                      <FileText size={16} className="text-gray-300 group-hover:text-accent-blue transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-gray-200">{item.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{item.aiScore}%</span>
                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent-blue rounded-full"
                        style={{ width: `${item.aiScore}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{item.atsScore}%</span>
                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent-purple rounded-full"
                        style={{ width: `${item.atsScore}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-400">
                  {item.date}
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                    item.status === 'Excellent' 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : item.status === 'Good'
                      ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-right">
                  <button className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
