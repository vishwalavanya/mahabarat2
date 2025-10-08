import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CharacterCard } from '../components/CharacterCard';
import { LanguageSelector } from '../components/LanguageSelector';
import { useTranslation } from '../hooks/useTranslation';
import { useGameState } from '../hooks/useGameState';
import { characters } from '../utils/characterData';

interface CharacterSelectionProps {
  onCharacterSelect: (characterId: string) => void;
  onBack: () => void;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  onCharacterSelect,
  onBack
}) => {
  const { t } = useTranslation();
  const { getCharacterProgress } = useGameState();

  // Update characters with progress
  const charactersWithProgress = characters.map(character => ({
    ...character,
    completedLevels: getCharacterProgress(character.id)
  }));

  return (
    <div className="min-h-screen character-sky-bg relative overflow-hidden">
      {/* Enhanced Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Clouds */}
        <div className="cloud-element animate-cloud-float top-20 left-12" style={{animationDelay: '0s'}}>
          ☁️
        </div>
        <div className="cloud-element animate-cloud-float top-40 right-20" style={{animationDelay: '5s'}}>
          ☁️
        </div>
        <div className="cloud-element animate-cloud-float bottom-32 left-20" style={{animationDelay: '10s'}}>
          ☁️
        </div>
        <div className="cloud-element animate-cloud-float top-1/2 right-1/4" style={{animationDelay: '15s'}}>
          ☁️
        </div>
        
        {/* Divine Weapons */}
        <div className="floating-divine animate-divine-float top-28 left-1/5" style={{animationDelay: '2s'}}>
          🏹
        </div>
        <div className="floating-divine animate-divine-float bottom-40 right-1/5" style={{animationDelay: '6s'}}>
          ⚔️
        </div>
        <div className="floating-divine animate-divine-float top-2/3 left-1/3" style={{animationDelay: '10s'}}>
          🛡️
        </div>
        <div className="floating-divine animate-divine-float bottom-1/4 right-1/3" style={{animationDelay: '14s'}}>
          🏺
        </div>
        
        {/* Floating Lotus Petals */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`petal-${i}`}
            className="floating-petal animate-petal-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 12}s`,
              fontSize: `${1 + Math.random() * 0.5}rem`
            }}
          >
            🌸
          </div>
        ))}
        
        {/* Background Orbs */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className="background-orb animate-orb-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${100 + Math.random() * 200}px`,
              height: `${100 + Math.random() * 200}px`,
              animationDelay: `${Math.random() * 8}s`
            }}
          />
        ))}
        
        {/* Sky Particles */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="sky-particle animate-sky-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('ui.back')}</span>
          </button>

          <LanguageSelector />
        </div>

        <div className="text-center mt-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4 px-4">
            {t('ui.selectCharacter')}
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Choose your hero and embark on their unique journey through the epic Mahabharata
          </p>
        </div>
      </div>

      {/* Character Grid */}
      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {charactersWithProgress.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onClick={() => onCharacterSelect(character.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-white/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-400/20 to-yellow-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-pink-400/20 to-blue-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};