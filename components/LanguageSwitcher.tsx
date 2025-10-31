'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type Language = {
  code: string;
  name: string;
  flag: string;
  dir: 'ltr' | 'rtl';
};

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'kr', name: '한국인', flag: '🇰🇷', dir: 'rtl' },
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
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-2xl">{selectedLanguage.flag}</span>
        <span className="text-white font-medium text-sm hidden sm:inline">
          {selectedLanguage.name}
        </span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-48 backdrop-blur-xl bg-gray-900/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-2">
              {LANGUAGES.map((language) => (
                <motion.button
                  key={language.code}
                  type="button"
                  onClick={() => handleSelect(language)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    currentLanguage === language.code
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'hover:bg-white/10 text-white'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <span className="text-2xl">{language.flag}</span>
                  <span className="text-left flex-1 font-medium">
                    {language.name}
                  </span>
                  {currentLanguage === language.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-amber-400 rounded-full"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
