import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, AlertCircle, TrendingUp, Search } from 'lucide-react';

export default function ResumeChecker() {
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [file, setFile] = useState(null);

  const handleScan = (e) => {
    e.preventDefault();
    if (!file) return;
    
    setIsScanning(true);
    // Simulate API call
    setTimeout(() => {
      setIsScanning(false);
      setShowResults(true);
    }, 2000);
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent mb-4">
          AI Resume Analyzer
        </h1>
        <p className="text-gray-400 text-lg">
          Upload your resume and paste the job description. Our AI will analyze your match and suggest improvements.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.form 
            key="upload-form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            onSubmit={handleScan}
          >
            {/* Upload Area */}
            <div 
              className={`glass-card p-8 flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed transition-all cursor-pointer ${file ? 'border-accent-blue bg-accent-blue/5' : 'border-white/20 hover:border-accent-blue/50 hover:bg-white/5'}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('resume-upload').click()}
            >
              <input 
                type="file" 
                id="resume-upload" 
                className="hidden" 
                accept=".pdf,.doc,.docx"
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
              />
              
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${file ? 'bg-accent-blue/20 text-accent-blue' : 'bg-white/5 text-gray-400'}`}>
                {file ? <FileText size={32} /> : <UploadCloud size={32} />}
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">
                {file ? 'File Selected' : 'Upload Resume'}
              </h3>
              <p className="text-gray-400 text-center text-sm px-4">
                {file ? file.name : 'Drag & drop your PDF or DOCX file here, or click to browse.'}
              </p>
              
              {file && (
                <button 
                  type="button" 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="mt-6 text-sm text-red-400 hover:text-red-300"
                >
                  Remove file
                </button>
              )}
            </div>

            {/* Job Description Area */}
            <div className="glass-card p-6 flex flex-col h-full min-h-[300px]">
              <label htmlFor="jd" className="text-white font-semibold mb-2 block">
                Job Description
              </label>
              <p className="text-xs text-gray-400 mb-4">
                Paste the job description here for targeted feedback.
              </p>
              <textarea 
                id="jd" 
                className="flex-1 w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple/50 resize-none transition-all placeholder:text-white/20"
                placeholder="We are looking for a highly skilled Software Engineer..."
                required
              ></textarea>
            </div>

            {/* Action Button */}
            <div className="lg:col-span-2 flex justify-center mt-4">
              <button 
                type="submit"
                disabled={!file || isScanning}
                className={`flex items-center gap-2 px-12 py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 ${
                  (!file || isScanning) 
                    ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-accent-blue to-accent-purple hover:shadow-lg hover:shadow-accent-blue/25 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isScanning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Search size={22} />
                    Analyze Resume
                  </>
                )}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-8"
          >
            {/* Score Overview */}
            <div className="glass-card p-8 flex flex-col md:flex-row items-center gap-10 justify-center">
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Simulated Circular Progress */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="80" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-white/10" />
                  <motion.circle 
                    cx="96" cy="96" r="80" 
                    fill="transparent" 
                    stroke="currentColor" 
                    strokeWidth="12" 
                    strokeDasharray="502" 
                    initial={{ strokeDashoffset: 502 }}
                    animate={{ strokeDashoffset: 502 - (502 * 0.85) }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    className="text-accent-blue drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-white">85</span>
                  <span className="text-sm text-gray-400">/ 100</span>
                </div>
              </div>
              <div className="max-w-md text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-4">Great Match!</h2>
                <p className="text-gray-300 leading-relaxed">
                  Your resume is strongly aligned with the job description. With a few minor tweaks to highlight your leadership experience, you'll be a top candidate.
                </p>
                <button 
                  onClick={() => setShowResults(false)}
                  className="mt-6 px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-colors"
                >
                  Scan Another Resume
                </button>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle className="text-green-400" size={24} />
                  <h3 className="text-xl font-bold text-white">Strengths</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Strong match for 'React.js' and 'Frontend Architecture'.",
                    "Good use of action verbs in your recent roles.",
                    "Formatting is parseable by ATS systems."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="text-yellow-400" size={24} />
                  <h3 className="text-xl font-bold text-white">To Improve</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Missing keyword: 'GraphQL'. Consider adding it if you have experience.",
                    "Quantify your achievements in your latest role (e.g. 'Improved performance by 20%').",
                    "Summary section is slightly too long. Keep it under 3 sentences."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
