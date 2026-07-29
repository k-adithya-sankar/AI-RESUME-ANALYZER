import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, User, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopNavbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 h-20 glass-card rounded-none border-t-0 border-x-0 border-b border-white/10 px-6 flex items-center justify-between">
        
        {/* Left side: Logo & Desktop Links */}
        <div className="flex items-center gap-10">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center font-bold text-white shadow-lg shadow-accent-blue/20">
              AI
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block text-white">Resume Checker</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all relative group ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 border border-white/10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon size={18} className={`relative z-10 ${isActive ? 'text-accent-blue' : 'group-hover:text-accent-purple transition-colors'}`} />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Right side items (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors group">
            <Bell size={20} className="group-hover:text-accent-blue transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-secondary shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse" />
          </button>
          
          <div className="w-px h-8 bg-white/10" />

          <button className="flex items-center gap-3 group hover:bg-white/5 p-2 pr-4 rounded-xl transition-colors border border-transparent hover:border-white/5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-accent-purple to-accent-blue p-[2px]">
              <div className="w-full h-full bg-secondary rounded-full flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={18} className="text-gray-300" />
                )}
              </div>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-white leading-none">{user?.name || 'Jane Doe'}</span>
              <span className="text-xs text-gray-400 mt-1 leading-none">Pro Plan</span>
            </div>
          </button>
          
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-secondary/95 backdrop-blur-xl md:hidden flex flex-col p-6"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center font-bold text-white shadow-lg">
                  AI
                </div>
                <span className="font-bold text-xl tracking-tight text-white">Resume Checker</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-xl bg-white/5"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-4 rounded-xl text-lg font-medium transition-all ${
                      isActive ? 'text-white bg-white/10 border border-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={22} className={isActive ? 'text-accent-blue' : ''} />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <button
              onClick={handleLogout}
              className="mt-auto flex items-center justify-center gap-3 w-full p-4 text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 rounded-xl font-medium transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
