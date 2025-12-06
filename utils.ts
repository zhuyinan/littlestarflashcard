export const speak = (text: string, lang: string = 'en-US', onEnd?: () => void) => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech to prevent overlap
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    if (lang === 'zh-CN') {
        utterance.rate = 1.0; // Normal speed for Chinese
    } else {
        utterance.rate = 0.8; // Slightly slower for English learning
    }
    
    utterance.pitch = 1.1; // Slightly higher pitch often sounds friendlier
    
    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  } else {
    // Fallback if speech synthesis is not supported
    if (onEnd) {
      setTimeout(onEnd, 1000);
    }
  }
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const getRandomItem = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};