import React from 'react';
import { Crown, Star } from 'lucide-react';
import type { Character } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface CharacterCardProps {
  character: Character;
  onClick: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onClick }) => {
  const { getCharacterName } = useTranslation();
  const progressPercentage = (character.completedLevels / character.totalLevels) * 100;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer epic-card rounded-3xl overflow-hidden w-full max-w-sm mx-auto transition-all duration-500 transform hover:scale-105 hover:rotate-1"
    >
      <div className="relative">
        <img
          src={character.image}
          alt={getCharacterName(character.id)}
          className="w-full h-32 sm:h-40 lg:h-48 object-cover object-top group-hover:scale-110 transition-transform duration-500 filter brightness-95 group-hover:brightness-110 group-hover:saturate-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=' + getCharacterName(character.id);
          }}
        />
        
        {character.completedLevels > 0 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-2 rounded-full shadow-xl animate-pulse">
            <Crown className="w-4 h-4" />
          </div>
        )}

        {character.completedLevels === character.totalLevels && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white p-2 rounded-full shadow-xl animate-bounce">
            <Star className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="font-epic-heading text-base sm:text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors line-clamp-1">
          {getCharacterName(character.id)}
        </h3>
        
        <p className="font-epic-body text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
          {character.shortBio}
        </p>

        {character.completedLevels > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span className="text-blue-600 font-semibold">Progress</span>
              <span>{character.completedLevels}/{character.totalLevels}</span>
            </div>
            <div className="w-full bg-gray-200/60 rounded-full h-1.5 sm:h-2 border border-blue-300/40">
              <div
                className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 h-1.5 sm:h-2 rounded-full transition-all duration-300 shadow-lg"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {character.skills.slice(0, 2).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-0.5 sm:py-1 bg-gradient-to-r from-blue-100/80 to-purple-100/80 text-blue-700 text-xs rounded-full border border-blue-300/50 backdrop-blur-sm font-medium"
            >
              {skill}
            </span>
          ))}
          {character.skills.length > 2 && (
            <span className="px-2 py-0.5 sm:py-1 bg-gradient-to-r from-gray-100/80 to-gray-200/80 text-gray-600 text-xs rounded-full border border-gray-300/50 backdrop-blur-sm font-medium">
              +{character.skills.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};