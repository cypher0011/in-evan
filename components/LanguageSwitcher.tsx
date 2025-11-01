'use client';

import { useState, useRef, useEffect } from 'react';

export type Language = {
  code: string;
  name: string;
  flag: string;
  dir: 'ltr' | 'rtl';
};

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'kr', name: '한국인', flag: '🇰🇷', dir: 'ltr' },
];

type LanguageSwitcherProps = {
  currentLanguage?: string;
  onLanguageChange?: (language: Language) => void;
};

export default function LanguageSwitcher({
  currentLanguage = 'en',
  onLanguageChange,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLanguage = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (language: Language) => {
    if (onLanguageChange) {
      onLanguageChange(language);
    }
    // Update HTML dir attribute
    document.documentElement.dir = language.dir;
    // Store in localStorage
    localStorage.setItem('preferredLanguage', language.code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Language Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/20 shadow-xl hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <span className="text-2xl">{selectedLanguage.flag}</span>
        <span className="text-white font-medium text-sm hidden sm:inline">
          {selectedLanguage.name}
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 backdrop-blur-xl bg-gray-900/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                type="button"
                onClick={() => handleSelect(language)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:translate-x-1 ${
                  currentLanguage === language.code
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                <span className="text-2xl">{language.flag}</span>
                <span className="text-left flex-1 font-medium">
                  {language.name}
                </span>
                {currentLanguage === language.code && (
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-in zoom-in duration-200" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
