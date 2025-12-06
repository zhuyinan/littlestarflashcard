
export const isWeChat = (): boolean => {
  return /MicroMessenger/i.test(navigator.userAgent);
};

// Fallback audio player for environments where speechSynthesisis broken (e.g. Android WeChat)
const playOnlineAudio = (text: string, lang: string, onEnd?: () => void) => {
  try {
    // Determine API parameters based on language
    // type=2 is US English, type=1 is UK English
    // le=zh is for Chinese
    let url = '';
    
    if (lang === 'zh-CN') {
      url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&le=zh`;
    } else {
      url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=2`;
    }

    const audio = new Audio(url);
    
    // Handle cleanup and callback
    const handleEnd = () => {
      if (onEnd) onEnd();
      audio.removeEventListener('ended', handleEnd);
      audio.removeEventListener('error', handleError);
    };

    const handleError = (e: any) => {
      console.warn("Online audio failed, falling back to timeout", e);
      // Even if audio fails, we must trigger onEnd to keep game logic moving
      if (onEnd) onEnd();
      audio.removeEventListener('ended', handleEnd);
      audio.removeEventListener('error', handleError);
    };

    audio.addEventListener('ended', handleEnd);
    audio.addEventListener('error', handleError);
    
    audio.play().catch(e => {
      console.error("Audio play blocked", e);
      handleError(e);
    });

  } catch (error) {
    if (onEnd) onEnd();
  }
};

export const speak = (text: string, lang: string = 'en-US', onEnd?: () => void) => {
  // Strategy:
  // 1. If in WeChat, prefer Online Audio (Youdao) because Android WebView TTS is often broken.
  // 2. If standard browser, try speechSynthesis first.
  
  if (isWeChat()) {
    playOnlineAudio(text, lang, onEnd);
    return;
  }

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

    // Error handling for speechSynthesis (e.g. if it fails silently)
    utterance.onerror = (e) => {
        console.warn("Speech synthesis error", e);
        // Fallback to online audio if native fails
        playOnlineAudio(text, lang, onEnd);
    };

    window.speechSynthesis.speak(utterance);
  } else {
    // Fallback if speech synthesis is not supported at all
    playOnlineAudio(text, lang, onEnd);
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
