'use client';

import { Check } from 'lucide-react';

type ConsentItemProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  text: string;
};

export default function ConsentItem({ checked, onChange, text }: ConsentItemProps) {
  // Generate a unique ID for accessibility
  const id = text.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

  return (
    <div 
      className="flex items-center space-x-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700 cursor-pointer transition-all hover:bg-slate-800"
      onClick={() => onChange(!checked)}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => e.key === ' ' && onChange(!checked)}
    >
      {/* Visually hidden but accessible input */}
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only" // Screen-reader only
      />
      
      {/* Custom Checkbox Visual */}
      <div 
        className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border-2 transition-all
          ${checked ? 'bg-white border-white' : 'border-slate-400 bg-transparent'}`}
      >
        {checked && <Check className="w-4 h-4 text-slate-900" strokeWidth={3} />}
      </div>
      
      {/* Label */}
      <label htmlFor={id} className="text-slate-200 text-sm cursor-pointer select-none">
        {text}
      </label>
    </div>
  );
}
