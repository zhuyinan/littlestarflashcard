export enum PartOfSpeech {
  Noun = 'n.',
  Verb = 'v.',
  Adjective = 'adj.',
  Pronoun = 'pron.',
  Preposition = 'prep.',
  Adverb = 'adv.',
  Number = 'num.',
  Other = 'other'
}

export interface WordCard {
  id: string;
  english: string;
  chinese: string;
  pos: PartOfSpeech; // Part of Speech
}

export enum AppMode {
  Menu = 'MENU',
  Flashcards = 'FLASHCARDS',
  Quiz = 'QUIZ',
  OddOneOut = 'ODD_ONE_OUT',
  SentenceBuilder = 'SENTENCE_BUILDER', // Renamed for clarity vs SentenceChallenge
  ListeningChallenge = 'LISTENING_CHALLENGE',
  SentenceChallenge = 'SENTENCE_CHALLENGE' // New "Pick & Speak" mode
}