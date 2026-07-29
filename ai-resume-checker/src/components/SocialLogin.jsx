import React from 'react';

export default function SocialLogin({ provider, icon: Icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
    >
      <Icon size={20} />
      <span className="text-sm font-medium text-gray-200">{provider}</span>
    </button>
  );
}
