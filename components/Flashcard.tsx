import React, { useState, useEffect } from 'react';
import { WordCard } from '../types';
import { speak } from '../utils';
import { Volume2, RotateCw } from 'lucide-react';
import { useLanguage } from '../i18n';

interface FlashcardProps {
  card: WordCard;
  onNext?: () => void;
}

// Exported for use in other components like ListeningChallengeMode
export const getFontSize = (text: string) => {
  if (text.length > 10) return 'text-4xl';
  if (text.length > 7) return 'text-5xl';
  return 'text-6xl';
};

export const Flashcard: React.FC<FlashcardProps> = ({ card, onNext }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { t } = useLanguage();

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [card]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      speak(card.english);
    }
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(card.english);
  };

  return (
    <div className="w-full max-w-sm h-80 cursor-pointer group" onClick={handleFlip}>
      {/* Apply card-flipped class to the container so the CSS selector .card-flipped .card-inner works */}
      <div className={`card-flip w-full h-full duration-500 ${isFlipped ? 'card-flipped' : ''}`}>
        <div className="card-inner w-full h-full">
          
          {/* Front of Card */}
          <div className="card-front bg-white rounded-3xl shadow-[0_10px_0_rgb(0,0,0,0.1)] border-4 border-white">
            <div className="absolute inset-2 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-2">
              <span className={`${getFontSize(card.english)} font-bold text-dark mb-4 text-center break-words leading-tight`}>
                {card.english}
              </span>
              <button 
                onClick={handleSpeak}
                className="mt-2 p-3 bg-secondary rounded-full text-white hover:bg-teal-500 transition-colors shadow-md z-10"
              >
                <Volume2 size={32} />
              </button>
              <div className="absolute bottom-4 text-gray-400 text-sm flex items-center gap-1">
                <RotateCw size={16} /> {t.flashcards.tapToFlip}
              </div>
            </div>
          </div>

          {/* Back of Card */}
          <div className="card-back bg-paper rounded-3xl shadow-[0_10px_0_rgb(0,0,0,0.1)] border-4 border-white">
             <div className="absolute inset-2 border-2 border-dashed border-primary rounded-2xl flex flex-col items-center justify-center p-2">
               <div className="absolute top-4 right-4 text-2xl font-bold text-gray-400 font-serif italic">
                 ({card.pos})
               </div>
               <span className="text-5xl font-bold text-dark font-sans mb-4 text-center">{card.chinese}</span>
               <div className={`${getFontSize(card.english)} text-primary font-bold text-center leading-tight`}>
                 {card.english}
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
