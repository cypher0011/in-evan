'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';

export type Country = {
  code: string;
  name: string;
  flag: string;
};

export const COUNTRIES: Country[] = [
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪' },
  { code: 'PS', name: 'Palestine', flag: '🇵🇸' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
];

type NationalitySelectorProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export default function NationalitySelector({
  value,
  onChange,
  error,
}: NationalitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = COUNTRIES.find(c => c.name === value);

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (country: Country) => {
    onChange(country.name);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-white/5 border ${
          error ? 'border-red-400' : 'border-white/20'
        } rounded-xl text-white flex items-center justify-between focus:outline-none focus:border-amber-400 focus:bg-white/10 transition-all duration-300`}
      >
        <div className="flex items-center gap-3">
          {selectedCountry ? (
            <>
              <span className="text-2xl">{selectedCountry.flag}</span>
              <span>{selectedCountry.name}</span>
            </>
          ) : (
            <span className="text-white/40">Select your nationality</span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 backdrop-blur-xl bg-gray-900/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-3 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search countries..."
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-400 text-sm"
                  autoFocus
                />
              </div>
            </div>

            {/* Countries List */}
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {filteredCountries.length > 0 ? (
                <div className="p-2">
                  {filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleSelect(country)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        value === country.name
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'hover:bg-white/10 text-white'
                      }`}
                    >
                      <span className="text-2xl">{country.flag}</span>
                      <span className="text-left flex-1">{country.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-white/40 text-sm">
                  No countries found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
