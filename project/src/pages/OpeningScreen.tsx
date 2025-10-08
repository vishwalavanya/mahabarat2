import React from 'react';
import { Sword, Sparkles } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface OpeningScreenProps {
  onEnterWorld: () => void;
}

export const OpeningScreen: React.FC<OpeningScreenProps> = ({ onEnterWorld }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://i.postimg.cc/L6PP1rqM/Gemini-Generated-Image-bpwdwvbpwdwvbpwd.png')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400 opacity-60" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* Title */}
        <div className="text-center mb-12">


        </div>

        {/* Enter Button */}
        <button
          onClick={onEnterWorld}
          className="group relative px-8 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-orange-500 to-red-600 text-white text-lg sm:text-xl font-bold rounded-full shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-110 hover:rotate-1"
        >
          <div className="flex items-center gap-3">
            <Sword className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300" />
            <span>{t('ui.enterWorld')}</span>
            <Sword className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-rotate-12 transition-transform duration-300" />
          </div>
          
          {/* Glowing effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-red-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
        </button>

        {/* Subtitle */}
        <p className="text-white/70 text-center mt-8 max-w-2xl leading-relaxed px-4 text-sm sm:text-base">
          Embark on an epic journey through the greatest story ever told. Choose your hero, 
          face moral dilemmas, and discover the eternal truths of dharma in this interactive 
          retelling of the Mahabharata.
        </p>

        {/* Floating elements */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};