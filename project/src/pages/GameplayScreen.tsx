import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Trophy, Star } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useGameState } from '../hooks/useGameState';
import { characters } from '../utils/characterData';
import type { Question } from '../types';

// Pre-load all question files using Vite's import.meta.glob
const questionFiles = import.meta.glob('../data/questions/*.json');

interface GameplayScreenProps {
  characterId: string;
  onBack: () => void;
  onComplete: () => void;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({
  characterId,
  onBack,
  onComplete
}) => {
  const { t, getCharacterName } = useTranslation();
  const { getCharacterProgress, updateCharacterProgress } = useGameState();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  const character = characters.find(c => c.id === characterId);
  const currentProgress = getCharacterProgress(characterId);
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const questionPath = `../data/questions/${characterId}.json`;
        const questionLoader = questionFiles[questionPath];
        if (questionLoader) {
          const questionModule = await questionLoader();
          const allQuestions = questionModule.default as Question[];
          
          // Filter questions based on current progress (next level)
          const nextLevel = currentProgress + 1;
          const levelQuestions = allQuestions.filter(q => q.level === nextLevel);
          
          if (levelQuestions.length === 0) {
            // No more questions available
            setGameComplete(true);
          } else {
            setQuestions(levelQuestions);
          }
        } else {
          console.error(`Question file not found: ${questionPath}`);
        }
      } catch (error) {
        console.error(`Failed to load questions for ${characterId}:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [characterId, currentProgress]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Level complete
      const isLevelComplete = score >= Math.ceil(questions.length * 0.7); // 70% to pass
      if (isLevelComplete) {
        const newProgress = currentProgress + 1;
        updateCharacterProgress(characterId, newProgress);
        // Try to load next level questions
        loadNextLevel();
      } else {
        setGameComplete(true);
      }
    }
  };

  const loadNextLevel = async () => {
    try {
      const questionPath = `../data/questions/${characterId}.json`;
      const questionLoader = questionFiles[questionPath];
      if (questionLoader) {
        const questionModule = await questionLoader();
        const allQuestions = questionModule.default as Question[];
        
        // Load questions for next level
        const nextLevel = currentProgress + 2; // +2 because we just completed current+1
        const levelQuestions = allQuestions.filter(q => q.level === nextLevel);
        
        if (levelQuestions.length > 0) {
          // Continue to next level
          setQuestions(levelQuestions);
          setCurrentQuestionIndex(0);
          setSelectedAnswer(null);
          setShowExplanation(false);
          setScore(0);
        } else {
          // No more levels available
          setGameComplete(true);
        }
      }
    } catch (error) {
      console.error(`Failed to load next level for ${characterId}:`, error);
      setGameComplete(true);
    }
  };

  const handlePlayAgain = () => {
    // Reload current level questions
    const loadCurrentLevel = async () => {
      try {
        const questionPath = `../data/questions/${characterId}.json`;
        const questionLoader = questionFiles[questionPath];
        if (questionLoader) {
          const questionModule = await questionLoader();
          const allQuestions = questionModule.default as Question[];
          
          // Load questions for current level
          const currentLevel = currentProgress + 1;
          const levelQuestions = allQuestions.filter(q => q.level === currentLevel);
          
          setQuestions(levelQuestions);
          setCurrentQuestionIndex(0);
          setSelectedAnswer(null);
          setShowExplanation(false);
          setScore(0);
          setGameComplete(false);
        }
      } catch (error) {
        console.error(`Failed to reload level for ${characterId}:`, error);
      }
    };
    
    loadCurrentLevel();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading questions...</div>
      </div>
    );
  }

  if (gameComplete) {
    const isLevelComplete = score >= Math.ceil(questions.length * 0.7); // 70% to pass

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 max-w-md w-full text-center">
          <div className="mb-6">
            {isLevelComplete ? (
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            ) : (
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            )}
            
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {isLevelComplete ? 'Level Complete!' : 'Level Failed'}
            </h2>
            
            <p className="text-sm sm:text-base text-white/80 mb-4">
              You scored {score} out of {questions.length} questions
            </p>
            
            {isLevelComplete && (
              <div className="mb-4">
                <p className="text-green-400 mb-2">
                  🎉 Level {currentProgress + 1} Complete!
                </p>
                {currentProgress + 1 >= (character?.totalLevels || 8) && (
                  <p className="text-yellow-400 font-bold animate-pulse">
                    ✨ SPECIAL REWARD UNLOCKED! ✨
                  </p>
                )}
              </div>
            )}
            
            {!isLevelComplete && (
              <p className="text-red-400 mb-4">
                Need {Math.ceil(questions.length * 0.7)} correct answers to pass
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            <button
              onClick={handlePlayAgain}
              className="px-4 py-2.5 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
            >
              Play Again
            </button>

            <button
              onClick={onComplete}
              className="px-4 py-2.5 sm:px-6 sm:py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
            >
              Continue
            </button>

            <button
              onClick={onBack}
              className="px-4 py-2.5 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
            >
              Back to Character
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 max-w-md w-full text-center">
          <Star className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            All Levels Complete!
          </h2>
          <p className="text-sm sm:text-base text-white/80 mb-6">
            You have completed all available levels for {getCharacterName(characterId)}.
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2.5 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
          >
            Back to Character
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gameplay-sky-bg relative overflow-hidden">
      {/* Floating Battle Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Enhanced Floating Clouds */}
        <div className="cloud-element animate-cloud-float top-16 left-8" style={{animationDelay: '0s'}}>
          ☁️
        </div>
        <div className="cloud-element animate-cloud-float top-32 right-16" style={{animationDelay: '4s'}}>
          ☁️
        </div>
        <div className="cloud-element animate-cloud-float bottom-24 left-16" style={{animationDelay: '8s'}}>
          ☁️
        </div>
        
        {/* Battle Weapons */}
        <div className="floating-divine animate-divine-float top-20 left-10" style={{animationDelay: '0s'}}>
          ⚔️
        </div>
        <div className="floating-divine animate-divine-float top-40 right-20" style={{animationDelay: '2s'}}>
          🏹
        </div>
        <div className="floating-divine animate-divine-float bottom-40 left-20" style={{animationDelay: '1s'}}>
          🛡️
        </div>
        <div className="floating-divine animate-divine-float top-1/2 right-1/4" style={{animationDelay: '3s'}}>
          🏺
        </div>
        <div className="floating-divine animate-divine-float bottom-1/3 left-1/3" style={{animationDelay: '5s'}}>
          🎯
        </div>
        
        {/* Floating Lotus Petals */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`petal-${i}`}
            className="floating-petal animate-petal-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 12}s`
            }}
          >
            🌸
          </div>
        ))}
        
        {/* Background Orbs */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className="background-orb animate-orb-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${80 + Math.random() * 120}px`,
              height: `${80 + Math.random() * 120}px`,
              animationDelay: `${Math.random() * 8}s`
            }}
          />
        ))}
        
        {/* Sky particles */}
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="sky-particle animate-sky-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Header */}
      <div className="p-3 sm:p-6 relative z-10">
        <div className="flex flex-col gap-3 mb-4 sm:mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="sky-nav-btn flex items-center gap-2 px-3 py-2 rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('ui.back')}</span>
            </button>

            <div className="epic-card px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg">
              <p className="font-epic-body text-[10px] sm:text-xs text-blue-800 font-semibold">
                Q {currentQuestionIndex + 1}/{questions.length}
              </p>
              <p className="font-epic-body text-[10px] sm:text-xs text-blue-700">
                Score: {score}/{questions.length}
              </p>
            </div>
          </div>

          <div className="text-center">
            <h1 className="font-epic-heading text-base sm:text-lg lg:text-xl font-bold epic-title">
              {getCharacterName(characterId)}
            </h1>
            <p className="font-epic-body text-xs sm:text-sm epic-subtitle">
              Level {currentProgress + 1}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/30 rounded-full h-2 sm:h-3 mb-4 sm:mb-6 border border-blue-400/40 shadow-lg">
          <div
            className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 h-2 sm:h-3 rounded-full transition-all duration-300 shadow-lg"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="px-3 sm:px-6 pb-6 sm:pb-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="epic-card rounded-2xl p-3 sm:p-6 lg:p-8">
            <h2 className="font-epic-heading text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6 leading-relaxed break-words">
              {currentQuestion.question}
            </h2>

            <div className="grid gap-3 sm:gap-4 mb-6 sm:mb-8">
              {currentQuestion.options.map((option, index) => {
                let buttonClass = "answer-option w-full p-3 sm:p-4 text-left rounded-2xl border-2 transition-all duration-500 ";
                
                if (selectedAnswer === null) {
                  buttonClass += "text-gray-700";
                } else if (index === currentQuestion.correctAnswer) {
                  buttonClass += "answer-correct text-green-800";
                } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                  buttonClass += "answer-incorrect text-red-800";
                } else {
                  buttonClass += "text-gray-500";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={buttonClass}
                    disabled={selectedAnswer !== null}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-r from-blue-200/80 to-purple-200/80 border-2 border-blue-400/60 flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0 font-epic-heading text-blue-800">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="font-epic-body font-medium text-xs sm:text-sm lg:text-base text-left flex-1 break-words">{option}</span>
                      {selectedAnswer !== null && index === currentQuestion.correctAnswer && (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                      )}
                      {selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="epic-card border border-blue-400/30 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
                <h3 className="font-epic-heading text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-blue-700 mb-2">Explanation:</h3>
                <p className="font-epic-body text-gray-700 leading-relaxed text-xs sm:text-sm lg:text-base break-words">{currentQuestion.explanation}</p>
              </div>
            )}

            {showExplanation && (
              <div className="flex justify-center">
                <button
                  onClick={handleNextQuestion}
                  className="epic-btn px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base font-epic-heading"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Level'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};