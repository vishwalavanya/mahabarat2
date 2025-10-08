export interface Character {
  id: string;
  name: string;
  image: string;
  shortBio: string;
  skills: string[];
  traits: string[];
  completedLevels: number;
  totalLevels: number;
}

export interface Question {
  id: number;
  level: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface GameState {
  currentScreen: 'opening' | 'characters' | 'character-info' | 'gameplay' | 'chat';
  selectedCharacter: string | null;
  currentLanguage: string;
  characterProgress: Record<string, number>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'character';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  characterId: string;
  messages: ChatMessage[];
  lastUpdated: number;
}

export interface Translation {
  ui: {
    enterWorld: string;
    skip: string;
    next: string;
    playAgain: string;
    selectCharacter: string;
    playAs: string;
    learnMore: string;
    back: string;
    level: string;
    completed: string;
    biography: string;
    skills: string;
    traits: string;
  };
  characters: Record<string, string>;
}

export interface BiographySection {
  title: string;
  content: string;
}

export interface CharacterBio {
  name: string;
  shortDescription: string;
  skills: string[];
  traits: string[];
  fullBiography: BiographySection[];
}