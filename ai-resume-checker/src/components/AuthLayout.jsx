import React from 'react';
import LiquidEther from './LiquidEther';

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* LiquidEther Animation Layer */}
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={['#000000', '#8B5CF6', '#3B82F6']} // Black, Purple, Blue to match theme
          mouseForce={20}
          cursorSize={60}
          isViscous={true} // Add viscosity for a smoother liquid look
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      <div className="relative z-10 w-full max-w-md p-6 animate-fade-in">
        <div className="glass-card p-8 flex flex-col gap-6">
          {children}
        </div>
      </div>
    </div>
  );
}
