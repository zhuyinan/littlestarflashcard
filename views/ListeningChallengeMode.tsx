import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameHeader } from '../components/GameHeader';
import { VOCABULARY } from '../data';
import { WordCard } from '../types';
import { shuffleArray, speak } from '../utils';
import { RefreshCw, Trophy, Volume2 } from 'lucide-react';
import { getFontSize } from '../components/Flashcard';

interface ListeningChallengeModeProps {
  onBack: () => void;
}

export const ListeningChallengeMode: React.FC<ListeningChallengeModeProps> = ({ onBack }) => {
  const [activeCards, setActiveCards] = useState<WordCard[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [currentTarget, setCurrentTarget] = useState<WordCard | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Locks interaction during speech

  // Initialize game with 9 random cards
  const startNewGame = useCallback(() => {
    const selected = shuffleArray(VOCABULARY).slice(0, 9);
    setActiveCards(selected);
    setCompletedIds(new Set());
    setGameWon(false);
    setIsWrong(false);
    setIsProcessing(false);
    
    // Pick first target after a short delay
    setTimeout(() => pickNextTarget(selected, new Set()), 500);
  }, []);

  const pickNextTarget = (cards: WordCard[], done: Set<string>) => {
    const remaining = cards.filter(c => !done.has(c.id));
    if (remaining.length === 0) {
      setGameWon(true);
      setCurrentTarget(null);
      return;
    }
    const next = remaining[Math.floor(Math.random() * remaining.length)];
    setCurrentTarget(next);
    
    // Speak Chinese prompt
    speak(next.chinese, 'zh-CN');
  };

  useEffect(() => {
    startNewGame();
    // Cleanup speech on unmount
    return () => window.speechSynthesis.cancel();
  }, [startNewGame]);

  const handleCardClick = (card: WordCard) => {
    if (!currentTarget || gameWon || completedIds.has(card.id) || isProcessing) return;

    if (card.id === currentTarget.id) {
      // Correct Logic
      setIsProcessing(true); // Lock input
      
      // 1. Mark as completed visually immediately
      const newCompleted = new Set(completedIds);
      newCompleted.add(card.id);
      setCompletedIds(newCompleted);
      setIsWrong(false);

      // 2. Speak English Word
      speak(card.english, 'en-US', () => {
        // 3. AFTER speech finishes, wait a bit then ask next question
        setTimeout(() => {
           pickNextTarget(activeCards, newCompleted);
           setIsProcessing(false); // Unlock input
        }, 1000); // 1 second pause between English word end and next Chinese prompt
      });
      
    } else {
      // Wrong Logic
      setIsWrong(true);
      speak('Try again', 'en-US');
      setTimeout(() => setIsWrong(false), 800);
    }
  };

  const replayAudio = () => {
    if (currentTarget && !isProcessing) {
      speak(currentTarget.chinese, 'zh-CN');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-pink-50">
      <GameHeader title="Listen & Find" onBack={onBack} color="bg-pink-500" />

      {/* Control / Status Area - Fixed Height */}
      <div className="flex-none p-2 md:p-4 flex flex-col items-center justify-center gap-2">
        {!gameWon && currentTarget && (
          <div className="bg-white rounded-2xl p-3 md:p-4 shadow-lg w-full max-w-md flex items-center justify-between relative border-b-4 border-gray-100">
            <div className="flex items-center gap-4 w-full justify-center">
               <button 
                onClick={replayAudio}
                disabled={isProcessing}
                className="bg-pink-100 text-pink-600 p-3 rounded-full hover:bg-pink-200 active:scale-95 transition-transform disabled:opacity-50"
               >
                 <Volume2 size={28} />
               </button>
               <span className="text-3xl md:text-4xl font-bold text-dark">{currentTarget.chinese}</span>
            </div>
            {isWrong && (
              <div className="absolute inset-0 bg-red-100/95 rounded-2xl flex items-center justify-center text-red-500 font-bold text-xl animate-shake z-10">
                Try again!
              </div>
            )}
          </div>
        )}
        
        {gameWon && (
           <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-md text-center">
             <Trophy className="mx-auto text-yellow-400 mb-2" size={48} />
             <div className="text-3xl font-bold text-green-500 mb-4">All Cleared!</div>
             <button 
              onClick={startNewGame}
              className="bg-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-600 shadow-md flex items-center gap-2 mx-auto"
             >
               <RefreshCw size={20} /> Play Again
             </button>
           </div>
        )}
      </div>

      {/* Grid Area - Fills remaining space without scrolling */}
      <div className="flex-1 p-2 md:p-4 w-full max-w-3xl mx-auto min-h-0">
        <div className="h-full w-full grid grid-cols-3 grid-rows-3 gap-2 md:gap-4">
          {activeCards.map((card) => {
            const isCompleted = completedIds.has(card.id);
            // Modified font sizing logic: consistently large
            // Default: text-2xl (mobile), text-4xl (tablet)
            // Long words (>9 chars): text-lg (mobile), text-3xl (tablet)
            const isLong = card.english.length > 9;
            const textSizeClass = isLong ? 'text-lg md:text-3xl' : 'text-2xl md:text-4xl';

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                disabled={isCompleted || gameWon || isProcessing}
                className={`
                  relative rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.1)] font-bold 
                  flex items-center justify-center text-center transition-all duration-300 w-full h-full break-words px-1 leading-tight
                  ${textSizeClass}
                  ${isCompleted 
                    ? 'opacity-0 pointer-events-none scale-50' 
                    : 'bg-white hover:bg-pink-50 active:scale-95 active:shadow-none'
                  }
                `}
              >
                {card.english}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Footer info */}
      <div className="flex-none p-2 text-center text-gray-400 font-bold text-sm">
         Remaining: {9 - completedIds.size}
      </div>
    </div>
  );
};