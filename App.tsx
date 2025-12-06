import React, { useState } from 'react';
import { AppMode } from './types';
import { FlashcardMode } from './views/FlashcardMode';
import { QuizMode } from './views/QuizMode';
import { OddOneOutMode } from './views/OddOneOutMode';
import { SentenceBuilderMode } from './views/SentenceBuilderMode';
import { ListeningChallengeMode } from './views/ListeningChallengeMode';
import { SentenceChallengeMode } from './views/SentenceChallengeMode';
import { BookOpen, Gamepad2, BrainCircuit, PenTool, Star, Ear, MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.Menu);

  const renderMode = () => {
    switch (mode) {
      case AppMode.Flashcards:
        return <FlashcardMode onBack={() => setMode(AppMode.Menu)} />;
      case AppMode.Quiz:
        return <QuizMode onBack={() => setMode(AppMode.Menu)} />;
      case AppMode.OddOneOut:
        return <OddOneOutMode onBack={() => setMode(AppMode.Menu)} />;
      case AppMode.SentenceBuilder:
        return <SentenceBuilderMode onBack={() => setMode(AppMode.Menu)} />;
      case AppMode.ListeningChallenge:
        return <ListeningChallengeMode onBack={() => setMode(AppMode.Menu)} />;
      case AppMode.SentenceChallenge:
        return <SentenceChallengeMode onBack={() => setMode(AppMode.Menu)} />;
      default:
        return <MainMenu onSelect={setMode} />;
    }
  };

  return <div className="font-sans antialiased text-dark">{renderMode()}</div>;
};

interface MainMenuProps {
  onSelect: (mode: AppMode) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden bg-sky-50">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 text-yellow-400 opacity-50 animate-bounce">
          <Star size={60} fill="currentColor" />
      </div>
      <div className="absolute bottom-20 right-10 text-pink-400 opacity-50 animate-bounce" style={{animationDelay: '1s'}}>
          <Star size={40} fill="currentColor" />
      </div>

      <header className="text-center mb-8 z-10">
        <h1 className="text-5xl md:text-6xl font-black text-primary drop-shadow-[0_4px_0_rgba(0,0,0,0.1)] mb-2 tracking-tight">
          Little Star
        </h1>
        <p className="text-xl text-secondary font-bold">English Flashcards</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl z-10">
        <MenuButton 
          icon={<BookOpen size={32} />} 
          title="Flashcards" 
          subtitle="Learn words & flip"
          color="bg-secondary"
          onClick={() => onSelect(AppMode.Flashcards)} 
        />
        <MenuButton 
          icon={<Gamepad2 size={32} />} 
          title="Word Match" 
          subtitle="Match CN to EN"
          color="bg-accent"
          onClick={() => onSelect(AppMode.Quiz)} 
        />
        
        <MenuButton 
          icon={<Ear size={32} />} 
          title="Listen & Find" 
          subtitle="Clear the table!"
          color="bg-pink-500"
          onClick={() => onSelect(AppMode.ListeningChallenge)} 
        />

        <MenuButton 
          icon={<MessageCircle size={32} />} 
          title="Pick & Speak" 
          subtitle="Make sentences"
          color="bg-orange-500"
          onClick={() => onSelect(AppMode.SentenceChallenge)} 
        />
        
        <MenuButton 
          icon={<BrainCircuit size={32} />} 
          title="Odd One Out" 
          subtitle="Which is different?"
          color="bg-purple-500"
          onClick={() => onSelect(AppMode.OddOneOut)} 
        />
        <MenuButton 
          icon={<PenTool size={32} />} 
          title="Builder" 
          subtitle="Word Magnets"
          color="bg-green-500"
          onClick={() => onSelect(AppMode.SentenceBuilder)} 
        />
      </div>
      
      <footer className="mt-8 text-gray-400 text-sm font-medium">
        Made for Grade 1 Students ❤️
      </footer>
    </div>
  );
};

interface MenuButtonProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ icon, title, subtitle, color, onClick }) => (
  <button 
    onClick={onClick}
    className={`${color} text-white p-4 md:p-5 rounded-3xl shadow-[0_8px_0_rgba(0,0,0,0.15)] transform transition-all hover:-translate-y-1 active:translate-y-1 active:shadow-none flex items-center gap-4 text-left w-full group overflow-hidden relative`}
  >
    <div className="bg-white/20 p-3 rounded-2xl group-hover:scale-110 transition-transform flex-shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <h2 className="text-xl md:text-2xl font-bold leading-tight truncate">{title}</h2>
      <p className="opacity-90 font-medium text-xs md:text-sm truncate">{subtitle}</p>
    </div>
    {/* Shine effect */}
    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shine" />
  </button>
);

export default App;