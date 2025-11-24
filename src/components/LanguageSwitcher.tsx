import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../types';

interface LanguageSwitcherProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, onLanguageChange }) => {
  return (
    <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/30 shadow-lg hover:bg-white/20 transition-all duration-300">
      <Globe className="w-5 h-5 text-white animate-pulse" />
      <div className="flex rounded-xl overflow-hidden border border-white/40 bg-white/10">
        <button
          onClick={() => onLanguageChange('fr')}
          className={`px-4 py-2 text-sm font-bold transition-all duration-300 ${
            language === 'fr' 
              ? 'bg-white text-blue-900 shadow-md' 
              : 'text-white hover:bg-white/20'
          }`}
        >
          🇫🇷 FR
        </button>
        <button
          onClick={() => onLanguageChange('en')}
          className={`px-4 py-2 text-sm font-bold transition-all duration-300 ${
            language === 'en' 
              ? 'bg-white text-blue-900 shadow-md' 
              : 'text-white hover:bg-white/20'
          }`}
        >
          🇬🇧 EN
        </button>
      </div>
      <div className="text-xs text-white/80 font-medium">
        {language === 'en' ? 'Language' : 'Langue'}
      </div>
    </div>
  );
};

export default LanguageSwitcher;