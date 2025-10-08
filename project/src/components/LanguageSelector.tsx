import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' }
];

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sky-nav-btn flex items-center gap-3 px-6 py-3 transition-all duration-300 shadow-xl"
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm font-semibold">{currentLang?.flag} {currentLang?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 bg-gradient-to-br from-white/95 via-blue-50/90 to-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-gradient-to-r from-blue-400 to-purple-400 min-w-[200px] z-50 overflow-hidden epic-card">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                changeLanguage(language.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gradient-to-r hover:from-blue-100/80 hover:to-purple-100/80 transition-all duration-300 ${
                currentLanguage === language.code ? 'bg-gradient-to-r from-blue-200/90 to-purple-200/90 text-blue-800 font-bold shadow-inner' : 'text-gray-700'
              } ${language === languages[0] ? 'rounded-t-lg' : ''} ${
                language === languages[languages.length - 1] ? 'rounded-b-lg' : ''
              }`}
            >
              <span className="text-xl drop-shadow-sm">{language.flag}</span>
              <span className="font-semibold drop-shadow-sm">{language.name}</span>
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};