// src/pages/ReadingLevel1.tsx

import React, { useState, useEffect } from 'react';

const ReadingLevel1: React.FC = () => {
  const alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Function to pronounce the given letter
  const speakLetter = (letter: string): void => {
    // Check if the browser supports speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.lang = 'en-US';
      utterance.rate = 0.8; // Slightly slower for clarity
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  };

  // Speak the letter whenever the current index changes
  useEffect(() => {
    const currentLetter = alphabet[currentIndex];
    speakLetter(currentLetter);
  }, [currentIndex, alphabet]);

  const handleNext = (): void => {
    if (currentIndex < alphabet.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = (): void => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRepeat = (): void => {
    speakLetter(alphabet[currentIndex]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 font-dyslexic">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 font-dyslexic">Learning Letters - Level 1</h1>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center space-y-6 font-dyslexic">
        <p className="text-lg text-gray-700 font-dyslexic">Listen to the sound of the letter:</p>
        
        <div className="text-9xl font-extrabold text-blue-600 tracking-wider my-4">
          {alphabet[currentIndex]}
        </div>

        <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-6 py-3 rounded-full font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              ⬅️ Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === alphabet.length - 1}
              className="px-6 py-3 rounded-full font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Next ➡️
            </button>
        </div>
        
        <button
          onClick={handleRepeat}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-all"
        >
          🔁 Repeat Sound
        </button>

      </div>
    </div>
  );
};

export default ReadingLevel1;