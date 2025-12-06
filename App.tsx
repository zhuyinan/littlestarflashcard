import React, { useState, useEffect } from 'react';
import { AppMode } from './types';
import { FlashcardMode } from './views/FlashcardMode';
import { QuizMode } from './views/QuizMode';
import { OddOneOutMode } from './views/OddOneOutMode';
import { SentenceBuilderMode } from './views/SentenceBuilderMode';
import { ListeningChallengeMode } from './views/ListeningChallengeMode';
import { SentenceChallengeMode } from './views/SentenceChallengeMode';
import { BookOpen, Gamepad2, BrainCircuit, PenTool, Star, Ear, MessageCircle, Languages } from 'lucide-react';
import { LanguageProvider, useLanguage } from './i18n';

const AppContent: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.Menu);

  // Handle Browser Back Button (History API)
  useEffect(() => {
    // Handler for popstate event (when back button is pressed)
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.mode) {
        setMode(event.state.mode);
      } else {
        // Fallback to menu if no state (e.g. initial load)
        setMode(AppMode.Menu);
      }
    };

    // Replace current state on load to ensure we have a base state
    window.history.replaceState({ mode: AppMode.Menu }, '');

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Function to navigate to a mode with history push
  const navigateTo = (newMode: AppMode) => {
    window.history.pushState({ mode: newMode }, '');
    setMode(newMode);
  };

  // Function to go back using history
  const goBack = () => {
    window.history.back();
  };

  // Audio Unlocker for Mobile Browsers (especially WeChat/iOS)
  useEffect(() => {
    const unlockAudio = () => {
      // 1. Prime Speech Synthesis
      if ('speechSynthesis' in window) {
        const emptyUtterance = new SpeechSynthesisUtterance('');
        window.speechSynthesis.speak(emptyUtterance);
      }
      
      // 2. Prime HTML Audio (create a silent buffer)
      // This helps 'wake up' the audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        gain.gain.value = 0; // Silent
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(0);
        osc.stop(0.1);
      }

      // Remove listener after first interaction
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('click', unlockAudio);
    };

    document.addEventListener('touchstart', unlockAudio);
    document.addEventListener('click', unlockAudio);

    return () => {
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('click', unlockAudio);
    };
  }, []);

  const renderMode = () => {
    switch (mode) {
      case AppMode.Flashcards:
        return <FlashcardMode onBack={goBack} />;
      case AppMode.Quiz:
        return <QuizMode onBack={goBack} />;
      case AppMode.OddOneOut:
        return <OddOneOutMode onBack={goBack} />;
      case AppMode.SentenceBuilder:
        return <SentenceBuilderMode onBack={goBack} />;
      case AppMode.ListeningChallenge:
        return <ListeningChallengeMode onBack={goBack} />;
      case AppMode.SentenceChallenge:
        return <SentenceChallengeMode onBack={goBack} />;
      default:
        return <MainMenu onSelect={navigateTo} />;
    }
  };

  return <div className="font-sans antialiased text-dark">{renderMode()}</div>;
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

interface MainMenuProps {
  onSelect: (mode: AppMode) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onSelect }) => {
  const { t, language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden bg-sky-50">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 text-yellow-400 opacity-50 animate-bounce">
          <Star size={60} fill="currentColor" />
      </div>
      <div className="absolute bottom-20 right-10 text-pink-400 opacity-50 animate-bounce" style={{animationDelay: '1s'}}>
          <Star size={40} fill="currentColor" />
      </div>

      {/* Language Toggle */}
      <button 
        onClick={toggleLanguage}
        className="absolute top-4 right-4 z-20 bg-white p-2 rounded-full shadow-md text-primary font-bold flex items-center gap-2 hover:bg-gray-50 active:scale-95 transition-all"
      >
        <Languages size={20} />
        {language === 'en' ? '中文' : 'English'}
      </button>

      <header className="text-center mb-8 z-10">
        <h1 className="text-5xl md:text-6xl font-black text-primary drop-shadow-[0_4px_0_rgba(0,0,0,0.1)] mb-2 tracking-tight">
          {t.appTitle}
        </h1>
        <p className="text-xl text-secondary font-bold">{t.appSubtitle}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl z-10">
        <MenuButton 
          icon={<BookOpen size={32} />} 
          title={t.menu.flashcards.title}
          subtitle={t.menu.flashcards.subtitle}
          color="bg-secondary"
          onClick={() => onSelect(AppMode.Flashcards)} 
        />
        <MenuButton 
          icon={<Gamepad2 size={32} />} 
          title={t.menu.quiz.title}
          subtitle={t.menu.quiz.subtitle}
          color="bg-accent"
          onClick={() => onSelect(AppMode.Quiz)} 
        />
        
        <MenuButton 
          icon={<Ear size={32} />} 
          title={t.menu.listening.title}
          subtitle={t.menu.listening.subtitle}
          color="bg-pink-500"
          onClick={() => onSelect(AppMode.ListeningChallenge)} 
        />

        <MenuButton 
          icon={<MessageCircle size={32} />} 
          title={t.menu.pickSpeak.title}
          subtitle={t.menu.pickSpeak.subtitle}
          color="bg-orange-500"
          onClick={() => onSelect(AppMode.SentenceChallenge)} 
        />
        
        <MenuButton 
          icon={<BrainCircuit size={32} />} 
          title={t.menu.oddOneOut.title}
          subtitle={t.menu.oddOneOut.subtitle}
          color="bg-purple-500"
          onClick={() => onSelect(AppMode.OddOneOut)} 
        />
        <MenuButton 
          icon={<PenTool size={32} />} 
          title={t.menu.builder.title}
          subtitle={t.menu.builder.subtitle}
          color="bg-green-500"
          onClick={() => onSelect(AppMode.SentenceBuilder)} 
        />
      </div>
      
      <footer className="mt-8 text-gray-400 text-sm font-medium">
        {t.footer}
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