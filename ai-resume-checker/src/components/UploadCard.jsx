import React, { useState } from 'react';
import { Upload, File } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UploadCard() {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="glass-card p-8 text-center relative overflow-hidden group"
    >
      <div 
        className={`absolute inset-0 border-2 border-dashed rounded-2xl transition-all duration-300 pointer-events-none
          ${isDragging ? 'border-accent-blue bg-accent-blue/5' : 'border-white/10 group-hover:border-accent-purple/50'}`}
      />
      
      <div 
        className="relative z-10 py-8 flex flex-col items-center justify-center gap-4"
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          <Upload size={28} className="text-white" />
        </div>
        
        <h3 className="text-xl font-semibold text-white">Upload Your Resume</h3>
        <p className="text-gray-400 text-sm max-w-sm">
          Drag and drop your resume file here or click to browse.
        </p>

        <div className="flex items-center gap-4 mt-2">
          <span className="flex items-center gap-1 text-xs text-gray-500 font-medium bg-white/5 px-2 py-1 rounded"><File size={12}/> PDF</span>
          <span className="flex items-center gap-1 text-xs text-gray-500 font-medium bg-white/5 px-2 py-1 rounded"><File size={12}/> DOC</span>
          <span className="flex items-center gap-1 text-xs text-gray-500 font-medium bg-white/5 px-2 py-1 rounded"><File size={12}/> DOCX</span>
        </div>

        <button className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold shadow-lg shadow-accent-blue/20 hover:shadow-accent-purple/40 transition-all hover:-translate-y-0.5">
          Browse Files
        </button>
      </div>
    </motion.div>
  );
}
