import { useState, useEffect } from 'react';
import type { GameState } from '../types';

const initialGameState: GameState = {
  currentScreen: 'opening',
  selectedCharacter: null,
  currentLanguage: 'en',
  characterProgress: {}
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  useEffect(() => {
    const savedState = localStorage.getItem('mahabharata-game-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setGameState({ ...initialGameState, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved game state:', error);
      }
    }
  }, []);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => {
      const newState = { ...prev, ...updates };
      localStorage.setItem('mahabharata-game-state', JSON.stringify(newState));
      return newState;
    });
  };

  const setScreen = (screen: GameState['currentScreen']) => {
    updateGameState({ currentScreen: screen });
  };

  const selectCharacter = (characterId: string) => {
    updateGameState({ selectedCharacter: characterId });
  };

  const updateCharacterProgress = (characterId: string, level: number) => {
    const newProgress = {
      ...gameState.characterProgress,
      [characterId]: Math.max(gameState.characterProgress[characterId] || 0, level)
    };
    updateGameState({ characterProgress: newProgress });
  };

  const getCharacterProgress = (characterId: string): number => {
    return gameState.characterProgress[characterId] || 0;
  };

  const resetGame = () => {
    setGameState(initialGameState);
    localStorage.removeItem('mahabharata-game-state');
  };

  return {
    gameState,
    setScreen,
    selectCharacter,
    updateCharacterProgress,
    getCharacterProgress,
    resetGame
  };
};