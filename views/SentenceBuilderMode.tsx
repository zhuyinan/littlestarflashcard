import React, { useState, useEffect } from 'react';
import { GameHeader } from '../components/GameHeader';
import { VOCABULARY } from '../data';
import { WordCard } from '../types';
import { speak, shuffleArray } from '../utils';
import { RefreshCcw, Volume2, Trash2, Shuffle } from 'lucide-react';

interface SentenceBuilderModeProps {
  onBack: () => void;
}

export const SentenceBuilderMode: React.FC<SentenceBuilderModeProps> = ({ onBack }) => {
  const [bankWords, setBankWords] = useState<WordCard[]>([]);
  const [sentence, setSentence] = useState<WordCard[]>([]);

  // Function to generate the word bank
  const refreshWordBank = () => {
    // 1. Essential sight words for structure (I, is, am, the, etc.)
    const sightWordsList = ['I', 'am', 'is', 'are', 'can', 'have', 'like', 'see', 'look', 'this', 'that', 'my', 'your', 'the', 'a', 'an', 'to', 'in', 'on', 'with'];
    
    // Find these in vocabulary or create partial objects if missing (though most should be in data)
    // We prioritize real cards from data to keep part-of-speech info if needed later
    const foundSightWords = VOCABULARY.filter(w => sightWordsList.includes(w.english));
    
    // 2. Random nouns/adjectives/verbs from vocabulary to add variety
    const otherWords = VOCABULARY.filter(w => !sightWordsList.includes(w.english));
    const randomOthers = shuffleArray(otherWords).slice(0, 12); // Pick 12 random content words

    // Combine and shuffle
    setBankWords(shuffleArray([...foundSightWords, ...randomOthers]));
  };

  useEffect(() => {
    refreshWordBank();
  }, []);

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
      <div className="bg-white m-4 p-6 rounded-3xl shadow-inner min-h-[160px] flex flex-col relative border-2 border-green-100 flex-none">
        
        <div className="flex flex-wrap gap-2 items-center min-h-[60px]">
          {sentence.length === 0 && (
            <span className="text-gray-300 italic text-lg w-full text-center">Tap words below to build a sentence...</span>
          )}
          {sentence.map((word, idx) => (
            <button
              key={`${word.id}-${idx}`}
              onClick={() => removeFromSentence(idx)}
              className="bg-yellow-100 border-b-4 border-yellow-300 px-4 py-2 rounded-xl font-bold text-xl text-dark transform active:translate-y-1 active:border-b-0 animate-pop-in"
            >
              {word.english}
            </button>
          ))}
        </div>

        <div className="absolute bottom-4 right-4 flex gap-2">
            {sentence.length > 0 && (
                <>
                <button onClick={clearSentence} className="p-2 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors">
                    <Trash2 size={24} />
                </button>
                <button onClick={readSentence} className="p-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 animate-pulse transition-colors">
                    <Volume2 size={24} />
                </button>
                </>
            )}
        </div>
      </div>

      {/* Word Bank */}
      <div className="flex-1 overflow-y-auto p-4 pt-0">
        <div className="flex justify-between items-end mb-2 px-2">
            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Word Bank</div>
            <button onClick={refreshWordBank} className="text-xs font-bold text-green-600 flex items-center gap-1 bg-green-100 px-2 py-1 rounded-lg">
                <Shuffle size={12} /> New Words
            </button>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center pb-8">
            {bankWords.map((word) => (
                <button
                    key={word.id}
                    onClick={() => addToSentence(word)}
                    className="
                      bg-white border border-gray-200 shadow-[0_4px_0_rgba(0,0,0,0.05)] 
                      px-4 py-3 rounded-xl text-xl font-bold text-dark 
                      active:scale-95 active:shadow-none active:bg-gray-50 
                      transition-all min-w-[3rem]
                    "
                >
                    {word.english}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};