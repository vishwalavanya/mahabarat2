import { useState, useEffect } from 'react';
import type { Translation } from '../types';

const translations: Record<string, Translation> = {};

// Import all translation files
const importTranslations = async () => {
  const languages = ['en', 'hi', 'ta', 'te', 'kn', 'ml'];
  
  for (const lang of languages) {
    try {
      const module = await import(`../data/translations/${lang}.json`);
      translations[lang] = module.default;
    } catch (error) {
      console.error(`Failed to load translation for ${lang}:`, error);
    }
  }
};

export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      await importTranslations();
      const savedLanguage = localStorage.getItem('mahabharata-language') || 'en';
      setCurrentLanguage(savedLanguage);
      setIsLoading(false);
    };

    loadTranslations();
  }, []);

  const changeLanguage = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem('mahabharata-language', language);
  };

  const t = (key: string): string => {
    if (isLoading || !translations[currentLanguage]) {
      return key;
    }

    const keys = key.split('.');
    let value: any = translations[currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const getCharacterName = (characterId: string): string => {
    return t(`characters.${characterId}`);
  };

  return {
    currentLanguage,
    changeLanguage,
    t,
    getCharacterName,
    isLoading
  };
};