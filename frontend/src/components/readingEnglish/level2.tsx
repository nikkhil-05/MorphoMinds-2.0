// src/components/readingEnglish/level2.tsx (Corrected Code)

import React, { useState, useEffect, useCallback } from 'react';

// FIX: Moved outside the component to prevent re-creation on every render.
const alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const ReadingEnglishLevel2: React.FC = () => {
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [result, setResult] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const speakLetter = (letter: string): void => {
    if ('speechSynthesis' in window && letter) {
      // Cancel any previously queued speech to prevent overlap
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const generateNewQuestion = useCallback((): void => {
    const correctLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    setCorrectAnswer(correctLetter);
    setResult('');
    setIsAnswered(false);
    
    let distractors: string[] = [];
    while (distractors.length < 3) {
      const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (randomLetter !== correctLetter && !distractors.includes(randomLetter)) {
        distractors.push(randomLetter);
      }
    }

    setOptions([...distractors, correctLetter].sort(() => Math.random() - 0.5));
    
    // Slight delay to ensure the state has updated before speaking
    setTimeout(() => speakLetter(correctLetter), 100);

  }, []); // FIX: The 'alphabet' dependency is no longer needed as it's a stable constant.

  useEffect(() => {
    generateNewQuestion();
  }, [generateNewQuestion]);

  const handleAnswer = (selectedLetter: string): void => {
    if (isAnswered) return;
    setIsAnswered(true);
    if (selectedLetter === correctAnswer) {
      setResult('✅ Correct! Getting next letter...');
      setTimeout(() => generateNewQuestion(), 1500);
    } else {
      setResult(`❌ Incorrect. The correct answer was "${correctAnswer}".`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 font-dyslexic">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">English Reading - Level 2 (Quiz)</h1>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center space-y-6">
        <p className="text-lg text-gray-700">Listen carefully and choose the correct letter:</p>
        <button onClick={() => speakLetter(correctAnswer!)} disabled={isAnswered || !correctAnswer} className="w-48 h-48 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-7xl hover:bg-blue-700 transition-all disabled:bg-gray-400">🔊</button>
        <div className="grid grid-cols-2 gap-4 pt-4">
          {options.map((letter) => (
            <button key={letter} onClick={() => handleAnswer(letter)} disabled={isAnswered} className="p-4 text-4xl font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-all disabled:bg-gray-400">
              {letter}
            </button>
          ))}
        </div>
        {result && <p className={`text-lg font-medium rounded-xl p-3 w-full ${result.includes('✅') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>{result}</p>}
      </div>
    </div>
  );
};

export default ReadingEnglishLevel2;