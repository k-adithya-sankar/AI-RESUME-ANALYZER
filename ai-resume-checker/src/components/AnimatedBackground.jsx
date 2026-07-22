import React from 'react';

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Soft blurred gradient circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/20 rounded-full mix-blend-screen filter blur-[100px] animate-float"></div>
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent-blue/20 rounded-full mix-blend-screen filter blur-[100px] animate-float-delayed"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[30rem] h-[30rem] bg-accent-cyan/10 rounded-full mix-blend-screen filter blur-[120px] animate-float"></div>
      
      {/* Floating particles (optional touch of detail) */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full animate-float"></div>
      <div className="absolute bottom-40 right-20 w-3 h-3 bg-white/20 rounded-full animate-float-delayed"></div>
    </div>
  );
}
