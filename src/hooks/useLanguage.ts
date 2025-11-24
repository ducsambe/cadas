import { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('fr'); // Default to French

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = TRANSLATIONS[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return {
    language,
    setLanguage,
    t
  };
};