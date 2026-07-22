import React from 'react';

export default function InputField({ label, id, type = 'text', icon: Icon, ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="relative input-glow rounded-xl transition-all duration-300">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-colors duration-300 ${
            Icon ? 'pl-10' : ''
          }`}
          {...props}
        />
      </div>
    </div>
  );
}
