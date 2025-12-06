import React, { useState } from 'react';
import { Flashcard } from '../components/Flashcard';
import { GameHeader } from '../components/GameHeader';
import { VOCABULARY } from '../data';
import { ArrowLeft, ArrowRight, Shuffle } from 'lucide-react';
import { shuffleArray } from '../utils';

interface FlashcardModeProps {
  onBack: () => void;
}

export const FlashcardMode: React.FC<FlashcardModeProps> = ({ onBack }) => {
  const [cards, setCards] = useState(VOCABULARY);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    setCards(shuffleArray(VOCABULARY));
    setCurrentIndex(0);
  };

  return (
    <div className="flex flex-col h-screen bg-sky-100">
      <GameHeader title="Flashcards" onBack={onBack} color="bg-secondary" />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-8">
        <Flashcard card={cards[currentIndex]} />

        <div className="flex items-center gap-6">
          <button 
            onClick={handlePrev}
            className="p-4 bg-white rounded-2xl shadow-lg text-secondary hover:bg-gray-50 transition-transform active:scale-95"
          >
            <ArrowLeft size={32} />
          </button>
          
          <div className="text-xl font-bold text-gray-500 bg-white px-6 py-2 rounded-xl shadow-sm">
            {currentIndex + 1} / {cards.length}
          </div>

          <button 
            onClick={handleNext}
            className="p-4 bg-white rounded-2xl shadow-lg text-secondary hover:bg-gray-50 transition-transform active:scale-95"
          >
            <ArrowRight size={32} />
          </button>
        </div>

        <button 
            onClick={handleShuffle}
            className="flex items-center gap-2 px-6 py-3 bg-primary rounded-xl text-white font-bold shadow-md hover:bg-orange-400"
          >
            <Shuffle size={20} /> Shuffle Deck
        </button>
      </div>
    </div>
  );
};
