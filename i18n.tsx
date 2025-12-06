import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'zh';

// Translation Dictionary
export const translations = {
  en: {
    appTitle: "Little Star",
    appSubtitle: "English Flashcards",
    footer: "Made for Grade 1 Students ❤️",
    menu: {
      flashcards: { title: "Flashcards", subtitle: "Learn words & flip" },
      quiz: { title: "Word Match", subtitle: "Match CN to EN" },
      listening: { title: "Listen & Find", subtitle: "Clear the table!" },
      pickSpeak: { title: "Pick & Speak", subtitle: "Make sentences" },
      oddOneOut: { title: "Odd One Out", subtitle: "Which is different?" },
      builder: { title: "Builder", subtitle: "Word Magnets" },
    },
    common: {
      score: "Score",
      streak: "Streak",
      loading: "Loading...",
      back: "Back",
      retry: "Retry",
      shuffle: "Shuffle Deck",
      remaining: "Remaining",
    },
    flashcards: {
      tapToFlip: "Tap to flip",
      count: "Card",
    },
    quiz: {
      findEnglish: "Find the English for",
      goodJob: "Good Job! 🎉",
      tryAgain: "Try Again!",
    },
    oddOneOut: {
      instruction: "Find the word that doesn't belong!",
      correctMsg: (pos: string) => `Correct! That is a ${pos}!`,
      oops: "Oops! Try again.",
      retryRound: "Retry Round",
    },
    builder: {
      title: "Make Sentences",
      placeholder: "Tap words below to build a sentence...",
      wordBank: "Word Bank",
      shuffleWords: "Shuffle Words",
    },
    listening: {
      allCleared: "All Cleared!",
      playAgain: "Play Again",
      tryAgain: "Try again!",
    },
    pickSpeak: {
      instructionTitle: "Make a Sentence!",
      instructionBody: "Pick a word, read it aloud, then use it in a sentence.",
      greatTeamwork: "Great Teamwork!",
      nextRound: "Next Round",
      tip: "Tip: Use sentences from your textbook!",
    }
  },
  zh: {
    appTitle: "小星星",
    appSubtitle: "英语单词卡",
    footer: "专为一年级学生设计 ❤️",
    menu: {
      flashcards: { title: "单词卡片", subtitle: "翻转学习单词" },
      quiz: { title: "单词配对", subtitle: "中译英挑战" },
      listening: { title: "听音找词", subtitle: "听中文找英文" },
      pickSpeak: { title: "选词造句", subtitle: "口语造句练习" },
      oddOneOut: { title: "谁是异类", subtitle: "找出不同类的词" },
      builder: { title: "连词成句", subtitle: "磁力拼词游戏" },
    },
    common: {
      score: "得分",
      streak: "连胜",
      loading: "加载中...",
      back: "返回",
      retry: "重试",
      shuffle: "洗牌",
      remaining: "剩余",
    },
    flashcards: {
      tapToFlip: "点击翻转",
      count: "卡片",
    },
    quiz: {
      findEnglish: "请找出对应的英文：",
      goodJob: "太棒了! 🎉",
      tryAgain: "再试一次!",
    },
    oddOneOut: {
      instruction: "找出不属于同一类的单词！",
      correctMsg: (pos: string) => `答对了！那是 ${pos}！`,
      oops: "哎呀！再试一次。",
      retryRound: "重玩本轮",
    },
    builder: {
      title: "连词成句",
      placeholder: "点击下方的单词组成句子...",
      wordBank: "单词库",
      shuffleWords: "刷新单词",
    },
    listening: {
      allCleared: "全部通关!",
      playAgain: "再玩一次",
      tryAgain: "再试一次!",
    },
    pickSpeak: {
      instructionTitle: "造句练习",
      instructionBody: "点击一个单词，大声读出来，然后用它造一个句子。",
      greatTeamwork: "配合得真棒!",
      nextRound: "下一轮",
      tip: "提示：尽量使用课本里的句子哦！",
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
