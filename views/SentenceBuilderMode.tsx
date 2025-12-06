import React, { useState } from 'react';
import { GameHeader } from '../components/GameHeader';
import { VOCABULARY } from '../data';
import { WordCard } from '../types';
import { speak } from '../utils';
import { RefreshCcw, Volume2, Trash2 } from 'lucide-react';

interface SentenceBuilderModeProps {
  onBack: () => void;
}

export const SentenceBuilderMode: React.FC<SentenceBuilderModeProps> = ({ onBack }) => {
  // A subset of words useful for sentences
  const availableWords = VOCABULARY.filter(w => 
    ['I', 'am', 'is', 'are', 'happy', 'sad', 'good', 'my', 'love', 'you', 'this', 'that', 'cat', 'dog', 'big', 'small', 'have', 'can', 'fly', 'see'].includes(w.english)
  );

  const [sentence, setSentence] = useState<WordCard[]>([]);

  const addToSentence = (word: WordCard) => {
    speak(word.english);
    setSentence([...sentence, word]);
  };

  const removeFromSentence = (index: number) => {
    const newSentence = [...sentence];
    newSentence.splice(index, 1);
    setSentence(newSentence);
  };

  const clearSentence = () => {
    setSentence([]);
  };

  const readSentence = () => {
    const text = sentence.map(w => w.english).join(' ');
    speak(text);
  };

  return (
    <div className="flex flex-col h-screen bg-green-50">
      <GameHeader title="Make Sentences" onBack={onBack} color="bg-green-600" />
      
      {/* Workspace Area */}
      <div className="bg-white m-4 p-6 rounded-3xl shadow-inner min-h-[160px] flex flex-col relative border-2 border-green-100">
        
        <div className="flex flex-wrap gap-2 items-center min-h-[60px]">
          {sentence.length === 0 && (
            <span className="text-gray-300 italic text-lg w-full text-center">Tap words below to build a sentence...</span>
          )}
          {sentence.map((word, idx) => (
            <button
              key={`${word.id}-${idx}`}
              onClick={() => removeFromSentence(idx)}
              className="bg-yellow-100 border-b-4 border-yellow-300 px-4 py-2 rounded-xl font-bold text-xl text-dark transform active:translate-y-1 active:border-b-0"
            >
              {word.english}
            </button>
          ))}
        </div>

        <div className="absolute bottom-4 right-4 flex gap-2">
            {sentence.length > 0 && (
                <>
                <button onClick={clearSentence} className="p-2 bg-red-100 text-red-500 rounded-full hover:bg-red-200">
                    <Trash2 size={24} />
                </button>
                <button onClick={readSentence} className="p-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 animate-pulse">
                    <Volume2 size={24} />
                </button>
                </>
            )}
        </div>
      </div>

      {/* Word Bank */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Word Bank</div>
        <div className="flex flex-wrap gap-3 justify-center">
            {availableWords.map((word) => (
                <button
                    key={word.id}
                    onClick={() => addToSentence(word)}
                    className="bg-white border border-gray-200 shadow-sm px-3 py-2 rounded-lg text-lg font-medium text-gray-700 active:scale-95 transition-transform"
                >
                    {word.english}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};
