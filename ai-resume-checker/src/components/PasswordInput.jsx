import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function PasswordInput({ label, id, showStrength = false, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);

  const togglePassword = () => setShowPassword(!showPassword);

  const handlePasswordChange = (e) => {
    if (props.onChange) props.onChange(e);
    
    // Simple mock strength indicator logic
    const val = e.target.value;
    let s = 0;
    if (val.length > 5) s += 1;
    if (val.length > 8) s += 1;
    if (/[A-Z]/.test(val)) s += 1;
    if (/[0-9]/.test(val)) s += 1;
    if (/[^A-Za-z0-9]/.test(val)) s += 1;
    setStrength(Math.min(4, s));
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-accent-cyan';
      case 4: return 'bg-accent-purple';
      default: return 'bg-gray-700';
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="relative input-glow rounded-xl transition-all duration-300">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Lock size={18} />
        </div>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          onChange={handlePasswordChange}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-colors duration-300"
          {...props}
        />
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      
      {showStrength && (
        <div className="mt-2 flex gap-1 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`flex-1 transition-all duration-500 ${
                strength >= level ? getStrengthColor() : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
