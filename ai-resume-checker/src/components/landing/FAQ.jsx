import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'How does the ATS scoring work?',
      answer: 'Our AI simulates popular Applicant Tracking Systems (like Workday, Greenhouse, and Lever) to parse your resume. It then compares the extracted data against the job description to calculate a match percentage based on keywords, skills, and formatting.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We do not store your resumes or job descriptions permanently. All data is processed securely and deleted from our servers immediately after your session.'
    },
    {
      question: 'Will this write my resume for me?',
      answer: 'We provide actionable, line-by-line suggestions to improve your bullet points and impact, but we believe your resume should remain in your own authentic voice. We guide you, rather than just generating generic text.'
    },
    {
      question: 'Can I check unlimited resumes?',
      answer: 'Yes! Once you create an account, you can run as many scans as you need to perfect your resume for every single job application.'
    }
  ];

  return (
    <section id="faq" className="py-24 bg-black text-white relative">
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              <button
                className="w-full px-6 py-6 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
