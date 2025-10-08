import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { useGameState } from './hooks/useGameState';
import { OpeningScreen } from './pages/OpeningScreen';
import { CharacterSelection } from './pages/CharacterSelection';
import { CharacterInfo } from './pages/CharacterInfo';
import { GameplayScreen } from './pages/GameplayScreen';
import { CharacterChat } from './pages/CharacterChat';

function AppContent() {
  const { user, loading } = useAuth();
  const { gameState, setScreen, selectCharacter } = useGameState();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleEnterWorld = () => {
    setScreen('characters');
  };

  const handleCharacterSelect = (characterId: string) => {
    selectCharacter(characterId);
    setScreen('character-info');
  };

  const handleBackToCharacters = () => {
    setScreen('characters');
  };

  const handleBackToOpening = () => {
    setScreen('opening');
  };

  const handlePlayAsCharacter = () => {
    setScreen('gameplay');
  };

  const handleGameplayComplete = () => {
    setScreen('character-info');
  };

  const handleStartChat = () => {
    setScreen('chat');
  };

  const handleBackFromChat = () => {
    setScreen('character-info');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="text-2xl text-amber-800 font-['Cinzel_Decorative']">Loading...</div>
      </div>
    );
  }

  if (!user) {
    if (authMode === 'login') {
      return <Login onSwitchToSignup={() => setAuthMode('signup')} />;
    } else {
      return <Signup onSwitchToLogin={() => setAuthMode('login')} />;
    }
  }

  const renderCurrentScreen = () => {
    switch (gameState.currentScreen) {
      case 'opening':
        return <OpeningScreen onEnterWorld={handleEnterWorld} />;

      case 'characters':
        return (
          <CharacterSelection
            onCharacterSelect={handleCharacterSelect}
            onBack={handleBackToOpening}
          />
        );

      case 'character-info':
        return gameState.selectedCharacter ? (
          <CharacterInfo
            characterId={gameState.selectedCharacter}
            onBack={handleBackToCharacters}
            onPlayAsCharacter={handlePlayAsCharacter}
            onStartChat={handleStartChat}
          />
        ) : (
          <CharacterSelection
            onCharacterSelect={handleCharacterSelect}
            onBack={handleBackToOpening}
          />
        );

      case 'gameplay':
        return gameState.selectedCharacter ? (
          <GameplayScreen
            characterId={gameState.selectedCharacter}
            onBack={() => setScreen('character-info')}
            onComplete={handleGameplayComplete}
          />
        ) : (
          <CharacterSelection
            onCharacterSelect={handleCharacterSelect}
            onBack={handleBackToOpening}
          />
        );

      case 'chat':
        return gameState.selectedCharacter ? (
          <CharacterChat
            characterId={gameState.selectedCharacter}
            onBack={handleBackFromChat}
          />
        ) : (
          <CharacterSelection
            onCharacterSelect={handleCharacterSelect}
            onBack={handleBackToOpening}
          />
        );

      default:
        return <OpeningScreen onEnterWorld={handleEnterWorld} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentScreen()}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
