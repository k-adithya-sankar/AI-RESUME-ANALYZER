import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Product Manager',
      content: "I applied to 50+ jobs with no response. After using AI Resume Checker, my ATS score went from 42% to 89%, and I landed interviews at three top tech companies in a week.",
      image: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      content: "The AI suggestions were incredibly accurate. It caught missing keywords I didn't even realize were in the job description. Worth every penny.",
      image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
    },
    {
      name: 'Jessica Walsh',
      role: 'Marketing Director',
      content: "I thought my resume was perfect until I saw how bots were misreading my columns. The formatting fixes alone saved my job hunt.",
      image: 'https://i.pravatar.cc/150?u=a04258a2462d826712d'
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-primary text-white relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Don't Just Take Our Word For It
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card p-8 rounded-2xl flex flex-col"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-gray-300 italic mb-8 flex-grow">"{testimonial.content}"</p>
              <div className="flex items-center gap-4">
                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full border border-white/20" />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
