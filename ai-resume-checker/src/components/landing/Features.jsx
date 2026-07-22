import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Target, Zap, ShieldCheck } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <FileSearch className="w-6 h-6 text-blue-400" />,
      title: 'Deep ATS Analysis',
      description: 'We simulate real Applicant Tracking Systems to see exactly how recruiter software reads and parses your resume.',
    },
    {
      icon: <Target className="w-6 h-6 text-purple-400" />,
      title: 'Keyword Optimization',
      description: 'Compare your resume directly against the job description to find missing keywords and critical skills.',
    },
    {
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
      title: 'Actionable Suggestions',
      description: 'Get AI-generated recommendations to rewrite bullet points for maximum impact and clarity.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-400" />,
      title: 'Privacy First',
      description: 'Your data is securely processed and never shared. We respect your privacy and career confidentiality.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-primary text-white relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Why Choose AI Resume Checker?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Everything you need to bypass the bots and get your resume into the hands of a real human being.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card p-6 rounded-2xl hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
