import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../components/GameHeader';
import { VOCABULARY } from '../data';
import { WordCard, PartOfSpeech } from '../types';
import { shuffleArray, speak } from '../utils';
import { Trophy } from 'lucide-react';

interface OddOneOutModeProps {
  onBack: () => void;
}

export const OddOneOutMode: React.FC<OddOneOutModeProps> = ({ onBack }) => {
  const [options, setOptions] = useState<WordCard[]>([]);
  const [oddOne, setOddOne] = useState<WordCard | null>(null);
  const [score, setScore] = useState(0);
  const [roundState, setRoundState] = useState<'playing' | 'won' | 'lost'>('playing');

  const generatePuzzle = useCallback(() => {
    // 1. Pick a "Majority" category
    const categories = Object.values(PartOfSpeech);
    const majorityCat = categories[Math.floor(Math.random() * categories.length)];
    
    // 2. Pick a "Minority" category (must be different)
    let minorityCat = categories[Math.floor(Math.random() * categories.length)];
    while (minorityCat === majorityCat) {
       minorityCat = categories[Math.floor(Math.random() * categories.length)];
    }

    // 3. Get words
    const majorityWords = shuffleArray(VOCABULARY.filter(w => w.pos === majorityCat)).slice(0, 3);
    const minorityWord = shuffleArray(VOCABULARY.filter(w => w.pos === minorityCat))[0];

    // Safety check if we run out of words for a category
    if (majorityWords.length < 3 || !minorityWord) {
      generatePuzzle(); // Retry
      return;
    }

    setOddOne(minorityWord);
    setOptions(shuffleArray([...majorityWords, minorityWord]));
    setRoundState('playing');
  }, []);

  useEffect(() => {
    generatePuzzle();
  }, [generatePuzzle]);

  const handleSelect = (card: WordCard) => {
    if (roundState !== 'playing') return;
    
    speak(card.english);

    if (card.id === oddOne?.id) {
      setRoundState('won');
      setScore(s => s + 1);
      setTimeout(generatePuzzle, 2000);
    } else {
      setRoundState('lost');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-purple-50">
      <GameHeader title="Odd One Out" onBack={onBack} color="bg-purple-500" />
      
      <div className="p-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full shadow-sm text-purple-600 font-bold">
           <Trophy size={20} /> Score: {score}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-gray-700 mb-8 text-center">
            Find the word that doesn't belong!
        </h2>

        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          {options.map((card) => (
            <button
              key={card.id} // Forces recreation of button to clear hover state
              onClick={() => handleSelect(card)}
              disabled={roundState !== 'playing'}
              className={`
                h-40 rounded-3xl shadow-[0_6px_0_rgb(0,0,0,0.1)] border-2 border-transparent
                flex flex-col items-center justify-center gap-2 transition-transform active:translate-y-1 active:shadow-none
                ${roundState === 'playing' ? 'bg-white active:bg-purple-50' : ''}
                ${roundState === 'won' && card.id === oddOne?.id ? 'bg-green-400 text-white border-green-600' : ''}
                ${roundState === 'won' && card.id !== oddOne?.id ? 'bg-gray-100 opacity-50' : ''}
                ${roundState === 'lost' && card.id !== oddOne?.id ? 'bg-red-100' : ''}
              `}
            >
              <span className="text-2xl font-bold">{card.english}</span>
              {roundState !== 'playing' && (
                <span className="text-sm font-medium opacity-80 bg-black/10 px-2 rounded">
                  {card.pos}
                </span>
              )}
            </button>
          ))}
        </div>

        {roundState === 'won' && (
          <div className="mt-8 text-3xl font-bold text-green-500 animate-bounce">
            Correct! That is a {oddOne?.pos}!
          </div>
        )}
        
        {roundState === 'lost' && (
           <div className="mt-8 flex flex-col items-center">
             <div className="text-xl font-bold text-red-500 mb-4">Oops! Try again.</div>
             <button onClick={() => setRoundState('playing')} className="bg-purple-500 text-white px-6 py-2 rounded-full font-bold">
               Retry Round
             </button>
           </div>
        )}
      </div>
    </div>
  );
};