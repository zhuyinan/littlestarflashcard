import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../components/GameHeader';
import { VOCABULARY } from '../data';
import { WordCard } from '../types';
import { shuffleArray, getRandomItem, speak } from '../utils';
import { Star, RefreshCw } from 'lucide-react';

interface QuizModeProps {
  onBack: () => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({ onBack }) => {
  const [target, setTarget] = useState<WordCard | null>(null);
  const [options, setOptions] = useState<WordCard[]>([]);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');
  const [streak, setStreak] = useState(0);

  const generateQuestion = useCallback(() => {
    const correctCard = getRandomItem(VOCABULARY);
    
    // Get 3 random distractors that aren't the correct card
    const distractors = shuffleArray(VOCABULARY.filter(c => c.id !== correctCard.id)).slice(0, 3);
    
    const allOptions = shuffleArray([correctCard, ...distractors]);
    
    setTarget(correctCard);
    setOptions(allOptions);
    setStatus('playing');
  }, []);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleOptionClick = (selected: WordCard) => {
    if (status !== 'playing' || !target) return;

    speak(selected.english);

    if (selected.id === target.id) {
      setStatus('correct');
      setScore(s => s + 10);
      setStreak(s => s + 1);
      setTimeout(generateQuestion, 1500);
    } else {
      setStatus('wrong');
      setStreak(0);
    }
  };

  if (!target) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-yellow-50">
      <GameHeader title="Word Match" onBack={onBack} color="bg-accent" />

      <div className="flex justify-between items-center p-4 px-6 bg-white/50">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <Star className="fill-current" /> {score}
        </div>
        <div className="text-gray-500 font-bold">
           🔥 Streak: {streak}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center p-4 max-w-2xl mx-auto w-full">
        
        {/* Question Area */}
        <div className="w-full bg-white rounded-3xl p-8 shadow-xl text-center mb-8 border-b-8 border-gray-100 relative overflow-hidden">
          <div className="text-gray-400 font-bold text-sm uppercase tracking-widest mb-2">Find the English for</div>
          <div className="text-5xl font-bold text-dark">{target.chinese}</div>
          
          {/* Feedback Overlay */}
          {status === 'correct' && (
             <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center text-white text-4xl font-bold animate-pulse">
               Good Job! 🎉
             </div>
          )}
           {status === 'wrong' && (
             <div className="absolute inset-0 bg-red-500/90 flex items-center justify-center text-white text-4xl font-bold">
               Try Again!
             </div>
          )}
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option)}
              disabled={status !== 'playing'}
              className={`
                h-32 rounded-2xl shadow-md text-2xl font-bold transition-all transform
                flex flex-col items-center justify-center
                ${status !== 'playing' && option.id === target.id ? 'bg-green-500 text-white scale-105' : 'bg-white text-dark hover:bg-blue-50 active:scale-95'}
                ${status === 'wrong' && option.id !== target.id ? 'opacity-50' : ''}
              `}
            >
              {option.english}
            </button>
          ))}
        </div>
        
        {status === 'wrong' && (
            <button onClick={() => setStatus('playing')} className="mt-6 flex items-center gap-2 text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm">
                <RefreshCw size={16}/> Retry
            </button>
        )}
      </div>
    </div>
  );
};
