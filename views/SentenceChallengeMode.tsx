import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../components/GameHeader';
import { VOCABULARY } from '../data';
import { WordCard } from '../types';
import { shuffleArray, speak } from '../utils';
import { RefreshCw, MessageCircle } from 'lucide-react';
import { useLanguage } from '../i18n';

interface SentenceChallengeModeProps {
  onBack: () => void;
}

export const SentenceChallengeMode: React.FC<SentenceChallengeModeProps> = ({ onBack }) => {
  const [activeCards, setActiveCards] = useState<WordCard[]>([]);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const { t } = useLanguage();

  // Initialize game with 9 random cards
  const startNewGame = useCallback(() => {
    const selected = shuffleArray(VOCABULARY).slice(0, 9);
    setActiveCards(selected);
    setHiddenIds(new Set());
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleCardClick = (card: WordCard) => {
    if (hiddenIds.has(card.id)) return;

    // Speak the word
    speak(card.english, 'en-US');
    
    // Remove it (hide it)
    const newHidden = new Set(hiddenIds);
    newHidden.add(card.id);
    setHiddenIds(newHidden);
  };

  const allCleared = hiddenIds.size === 9;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-orange-50">
      <GameHeader title={t.menu.pickSpeak.title} onBack={onBack} color="bg-orange-500" />

      {/* Instruction Area */}
      <div className="flex-none p-4 text-center">
        <div className="bg-white rounded-xl p-4 shadow-sm inline-block max-w-md w-full">
           <h2 className="text-xl font-bold text-orange-600 flex items-center justify-center gap-2">
             <MessageCircle size={24} />
             {t.pickSpeak.instructionTitle}
           </h2>
           <p className="text-gray-500 text-sm mt-1">
             {t.pickSpeak.instructionBody}
           </p>
        </div>
      </div>

      {/* Grid Area - Fills remaining space without scrolling */}
      <div className="flex-1 p-2 md:p-4 w-full max-w-3xl mx-auto min-h-0">
        {allCleared ? (
             <div className="h-full flex flex-col items-center justify-center animate-fade-in">
                 <div className="text-4xl font-bold text-orange-400 mb-6">{t.pickSpeak.greatTeamwork}</div>
                 <button 
                    onClick={startNewGame}
                    className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-600 shadow-lg flex items-center gap-2 text-xl"
                 >
                    <RefreshCw size={24} /> {t.pickSpeak.nextRound}
                 </button>
             </div>
        ) : (
            <div className="h-full w-full grid grid-cols-3 grid-rows-3 gap-2 md:gap-4">
            {activeCards.map((card) => {
                const isHidden = hiddenIds.has(card.id);
                const isLong = card.english.length > 9;
                // Updated font sizing to match ListeningChallengeMode
                const textSizeClass = isLong ? 'text-xl md:text-4xl' : 'text-3xl md:text-5xl';

                return (
                <button
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    disabled={isHidden}
                    className={`
                    relative rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.1)] font-bold 
                    flex items-center justify-center text-center transition-all duration-500 w-full h-full break-words px-1 border-2 border-white leading-tight
                    ${textSizeClass}
                    ${isHidden 
                        ? 'opacity-0 transform scale-50 pointer-events-none' 
                        : 'bg-white hover:bg-orange-100 text-dark active:scale-95'
                    }
                    `}
                >
                    {card.english}
                </button>
                );
            })}
            </div>
        )}
      </div>
      
      <div className="flex-none p-2 text-center text-gray-300 font-bold text-xs">
         {t.pickSpeak.tip}
      </div>
    </div>
  );
};
