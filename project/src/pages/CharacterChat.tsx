import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, MessageCircle, Sparkles, Crown } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { aiCharacterService } from '../services/aiService';
import { characters } from '../utils/characterData';
import type { ChatMessage, ChatSession } from '../types';

interface CharacterChatProps {
  characterId: string;
  onBack: () => void;
}

export const CharacterChat: React.FC<CharacterChatProps> = ({
  characterId,
  onBack
}) => {
  const { getCharacterName } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const character = characters.find(c => c.id === characterId);

  useEffect(() => {
    // Load existing chat session
    const savedChat = localStorage.getItem(`chat-${characterId}`);
    if (savedChat) {
      try {
        const chatSession: ChatSession = JSON.parse(savedChat);
        setMessages(chatSession.messages);
      } catch (error) {
        console.error('Failed to load chat session:', error);
      }
    } else {
      // Initialize with welcome message
      const welcomeMessage = aiCharacterService.getCharacterWelcome(characterId);
      const initialMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'character',
        content: welcomeMessage,
        timestamp: Date.now()
      };
      setMessages([initialMessage]);
    }
  }, [characterId]);

  useEffect(() => {
    // Save chat session
    if (messages.length > 0) {
      const chatSession: ChatSession = {
        characterId,
        messages,
        lastUpdated: Date.now()
      };
      localStorage.setItem(`chat-${characterId}`, JSON.stringify(chatSession));
    }
  }, [messages, characterId]);

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);





  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      const conversationHistory = newMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const characterResponse = await aiCharacterService.getCharacterResponse(
        characterId,
        inputMessage,
        conversationHistory
      );

      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'character',
        content: characterResponse,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      console.error('Error getting character response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'character',
        content: 'I apologize, but I am having trouble connecting to the divine realm. Please try again.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!character) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Character not found...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen interactive-sky-bg relative overflow-hidden">
      {/* Enhanced Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Clouds */}
        <div className="cloud-element animate-cloud-float top-16 left-8" style={{animationDelay: '0s'}}>
          ☁️
        </div>
        <div className="cloud-element animate-cloud-float top-32 right-16" style={{animationDelay: '4s'}}>
          ☁️
        </div>
        <div className="cloud-element animate-cloud-float bottom-24 left-16" style={{animationDelay: '8s'}}>
          ☁️
        </div>
        <div className="cloud-element animate-cloud-float top-1/2 left-1/4" style={{animationDelay: '12s'}}>
          ☁️
        </div>
        
        {/* Divine Conversation Elements */}
        <div className="floating-divine animate-divine-float top-20 left-10" style={{animationDelay: '0s'}}>
          💬
        </div>
        <div className="floating-divine animate-divine-float top-40 right-20" style={{animationDelay: '2s'}}>
          🕉️
        </div>
        <div className="floating-divine animate-divine-float bottom-40 left-20" style={{animationDelay: '1s'}}>
          📿
        </div>
        <div className="floating-divine animate-divine-float top-1/2 right-1/4" style={{animationDelay: '3s'}}>
          🌟
        </div>
        <div className="floating-divine animate-divine-float bottom-1/3 left-1/3" style={{animationDelay: '5s'}}>
          🙏
        </div>
        
        {/* Floating Lotus Petals */}
        {[...Array(15)].map((_, i) => (
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
        
        {/* Sky Particles */}
        {[...Array(20)].map((_, i) => (
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
        <div className="flex flex-col gap-3 sm:gap-4">
          <button
            onClick={onBack}
            className="sky-nav-btn flex items-center gap-2 px-3 py-2 rounded-xl hover:scale-105 transition-all duration-300 self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>

          <div className="text-center">
            <h1 className="font-epic-heading text-base sm:text-xl lg:text-2xl font-bold epic-title break-words px-2">
              🌟 Divine Conversation<br className="sm:hidden" /> with {getCharacterName(characterId)} 🌟
            </h1>
            <p className="font-epic-body text-xs sm:text-sm epic-subtitle mt-2 px-4">
              🎉 Congratulations! You've unlocked this sacred conversation! ✨
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="px-3 sm:px-6 pb-3 sm:pb-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="epic-card rounded-2xl overflow-hidden h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)] flex flex-col">
            {/* Character Header */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-3 sm:p-4 border-b border-blue-400/30">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="relative flex-shrink-0">
                <img
                  src={character.image}
                  alt={getCharacterName(characterId)}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full object-cover object-top border-3 border-yellow-400/70 shadow-xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/64x64/4F46E5/FFFFFF?text=' + getCharacterName(characterId);
                  }}
                />
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-1 rounded-full shadow-lg animate-pulse">
                    <Crown className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-epic-heading text-sm sm:text-lg md:text-xl font-bold text-gray-800 truncate">
                    {getCharacterName(characterId)}
                  </h2>
                  <p className="font-epic-body text-xs sm:text-sm text-gray-600 flex items-center gap-1 sm:gap-2">
                    <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">🎭 AI Active</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] md:max-w-[70%] p-2.5 sm:p-3 md:p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'user-message text-white ml-4'
                        : 'character-message text-gray-800 mr-4'
                    } shadow-lg backdrop-blur-sm`}
                  >
                    <p className="font-epic-body text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <p className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="typing-indicator p-4 rounded-2xl mr-4 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                      <span className="font-epic-body text-sm text-gray-600">
                        {getCharacterName(characterId)} is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-2 sm:p-3 md:p-4 border-t border-blue-400/30 bg-gradient-to-r from-white/5 to-blue-100/10">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask ${getCharacterName(characterId)}...`}
                  className="chat-input flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-xl font-epic-body text-xs sm:text-sm md:text-base"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="epic-btn px-3 py-2 sm:px-4 sm:py-3 md:px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-1 sm:gap-2 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Send</span>
                </button>
              </div>

              <div className="mt-2 text-center">
                <p className="font-epic-caption text-[10px] sm:text-xs text-gray-600 flex items-center justify-center gap-1 flex-wrap px-2">
                  <Sparkles className="w-3 h-3 flex-shrink-0" />
                  <span>🎉 Reward Unlocked 🎉</span>
                  <Sparkles className="w-3 h-3 flex-shrink-0" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};