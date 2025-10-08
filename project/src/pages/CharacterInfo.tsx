import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Book, Star, Award } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useGameState } from '../hooks/useGameState';
import { characters } from '../utils/characterData';
import type { CharacterBio } from '../types';

// Pre-load all biography files using Vite's import.meta.glob
const shortBios = import.meta.glob('../data/bio/*_short.json');
const fullBios = import.meta.glob('../data/bio/*_full.json');

interface CharacterInfoProps {
  characterId: string;
  onBack: () => void;
  onPlayAsCharacter: () => void;
  onStartChat: () => void;
}

export const CharacterInfo: React.FC<CharacterInfoProps> = ({
  characterId,
  onBack,
  onPlayAsCharacter,
  onStartChat
}) => {
  const { t, getCharacterName } = useTranslation();
  const { getCharacterProgress } = useGameState();
  const [characterBio, setCharacterBio] = useState<CharacterBio | null>(null);
  const [showFullBio, setShowFullBio] = useState(false);

  const character = characters.find(c => c.id === characterId);
  const progress = getCharacterProgress(characterId);
  const isCompleted = progress >= (character?.totalLevels || 8);
  const canChat = isCompleted; // Unlock chat after completing all levels

  useEffect(() => {
    const loadCharacterBio = async () => {
      try {
        const bioPath = `../data/bio/${characterId}_short.json`;
        const bioLoader = shortBios[bioPath];
        if (bioLoader) {
          const bioModule = await bioLoader();
          setCharacterBio(bioModule.default);
        } else {
          console.error(`Bio file not found: ${bioPath}`);
        }
      } catch (error) {
        console.error(`Failed to load bio for ${characterId}:`, error);
      }
    };

    loadCharacterBio();
  }, [characterId]);

  const handleLearnMore = async () => {
    try {
      const bioPath = `../data/bio/${characterId}_full.json`;
      const bioLoader = fullBios[bioPath];
      if (bioLoader) {
        const fullBioModule = await bioLoader();
        setCharacterBio(fullBioModule.default);
        setShowFullBio(true);
      } else {
        console.error(`Full bio file not found: ${bioPath}`);
      }
    } catch (error) {
      console.error(`Failed to load full bio for ${characterId}:`, error);
    }
  };

  if (!character || !characterBio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen epic-sky-bg relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="cloud-element animate-cloud-float top-16 left-8" style={{animationDelay: '0s'}}>
          ☁️
        </div>
        <div className="cloud-element animate-cloud-float top-32 right-16" style={{animationDelay: '4s'}}>
          ☁️
        </div>
        <div className="cloud-element animate-cloud-float bottom-24 left-16" style={{animationDelay: '8s'}}>
          ☁️
        </div>
        
        <div className="divine-weapon animate-divine-float top-24 left-1/4" style={{animationDelay: '1s'}}>
          🏹
        </div>
        <div className="divine-weapon animate-divine-float bottom-32 right-1/4" style={{animationDelay: '3s'}}>
          ⚔️
        </div>
        
        {/* Sky Particles */}
        {[...Array(12)].map((_, i) => (
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
      <div className="p-3 sm:p-6 relative z-10">
        <button
          onClick={onBack}
          className="sky-nav-btn flex items-center gap-2 px-6 py-3 hover:scale-105 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('ui.back')}</span>
        </button>
      </div>

      <div className="px-3 sm:px-6 pb-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {!showFullBio ? (
            // Character Info View
            <div className="epic-card rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Character Image */}
                <div className="lg:w-1/3">
                  <div className="relative">
                    <img
                      src={character.image}
                      alt={getCharacterName(characterId)}
                      className="w-full h-48 sm:h-64 lg:h-80 object-cover object-top rounded-xl shadow-2xl mx-auto max-w-xs sm:max-w-sm lg:max-w-none filter brightness-90 hover:brightness-110 transition-all duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x500/4F46E5/FFFFFF?text=' + getCharacterName(characterId);
                      }}
                    />
                    
                    {isCompleted && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black p-2 rounded-full shadow-lg animate-glow-pulse">
                        <Award className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Character Details */}
                <div className="lg:w-2/3">
                  <h1 className="font-trajan text-2xl sm:text-3xl lg:text-4xl font-black epic-title mb-4">
                    {getCharacterName(characterId)}
                  </h1>

                  <p className="font-marcellus epic-subtitle text-base sm:text-lg mb-6 leading-relaxed">
                    {characterBio.shortDescription}
                  </p>

                  {/* Progress */}
                  {progress > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="font-cinzel text-yellow-300 font-semibold">
                          {t('ui.level')} {progress} / {character.totalLevels}
                        </span>
                      </div>
                      <div className="w-full bg-black/30 rounded-full h-3 border border-yellow-400/20">
                        <div
                          className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 h-3 rounded-full transition-all duration-300 shadow-lg"
                          style={{ width: `${(progress / character.totalLevels) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  <div className="mb-6">
                    <h3 
                      className="font-cinzel text-xl font-semibold text-yellow-300 mb-3 flex items-center gap-2 cursor-pointer hover:text-yellow-200 transition-colors duration-300 hover:scale-105 transform"
                      onClick={onStartChat}
                      title="🎭 Developer Testing: Click to test chatbot"
                    >
                      <Award className="w-5 h-5" />
                      {t('ui.skills')}
                      <span className="text-xs opacity-70 ml-2">🎭</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {characterBio.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 rounded-full text-sm border border-blue-400/30 backdrop-blur-sm font-marcellus"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Traits */}
                  <div className="mb-8">
                    <h3 className="font-cinzel text-xl font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      {t('ui.traits')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {characterBio.traits.map((trait, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 rounded-full text-sm border border-purple-400/30 backdrop-blur-sm font-marcellus"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={onPlayAsCharacter}
                      className="epic-btn flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base font-cinzel"
                    >
                      <Play className="w-5 h-5" />
                      {t('ui.playAs')} {getCharacterName(characterId)}
                    </button>

                    {canChat && (
                      <button
                        onClick={onStartChat}
                        className="epic-btn flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base font-cinzel bg-gradient-to-r from-purple-500/80 to-pink-600/80 animate-pulse"
                      >
                        <Star className="w-5 h-5 animate-spin" />
                        🎉 Talk with {getCharacterName(characterId)} 🎉
                      </button>
                    )}

                    {isCompleted && (
                      <button
                        onClick={handleLearnMore}
                        className="epic-btn flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base font-cinzel bg-gradient-to-r from-blue-500/80 to-purple-600/80"
                      >
                        <Book className="w-5 h-5" />
                        {t('ui.learnMore')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Full Biography View
            <div className="epic-card rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="font-trajan text-xl sm:text-2xl lg:text-3xl font-bold epic-title">
                  {getCharacterName(characterId)} - {t('ui.biography')}
                </h1>
                <button
                  onClick={() => setShowFullBio(false)}
                  className="epic-card px-3 sm:px-4 py-2 text-white rounded-lg hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                >
                  {t('ui.back')}
                </button>
              </div>

              <div className="space-y-8">
                {characterBio.fullBiography?.map((section, index) => (
                  <div key={index} className="bg-gradient-to-r from-white/5 to-yellow-400/5 rounded-xl p-4 sm:p-6 border border-yellow-400/20 backdrop-blur-sm">
                    <h2 className="font-cinzel text-lg sm:text-xl font-semibold text-yellow-400 mb-4">
                      {section.title}
                    </h2>
                    <p className="font-marcellus epic-subtitle leading-relaxed text-sm sm:text-base">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};