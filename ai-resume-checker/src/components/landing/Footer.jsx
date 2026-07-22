import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, MessageCircle, GitBranch, Briefcase } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-purple-400" />
            <span className="font-bold text-lg text-white">AI Resume Checker</span>
          </Link>
          <p className="text-sm">
            Empowering job seekers with advanced AI to bypass Applicant Tracking Systems and land their dream roles.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
            <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
            <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/contact" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Connect</h4>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-white">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-white">
              <GitBranch className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-white">
              <Briefcase className="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-sm text-center">
        <p>&copy; {new Date().getFullYear()} AI Resume Checker. All rights reserved.</p>
      </div>
    </footer>
  );
}
