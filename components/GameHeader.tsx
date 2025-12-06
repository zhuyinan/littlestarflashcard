import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface GameHeaderProps {
  title: string;
  onBack: () => void;
  color?: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ title, onBack, color = 'bg-primary' }) => {
  return (
    <div className={`w-full ${color} p-4 flex items-center shadow-md relative z-20`}>
      <button 
        onClick={onBack}
        className="bg-white/20 p-2 rounded-xl hover:bg-white/40 transition-colors text-white"
      >
        <ArrowLeft size={28} />
      </button>
      <h1 className="flex-1 text-center text-white text-2xl font-bold tracking-wide drop-shadow-md">
        {title}
      </h1>
      <div className="w-10"></div> {/* Spacer for centering */}
    </div>
  );
};
