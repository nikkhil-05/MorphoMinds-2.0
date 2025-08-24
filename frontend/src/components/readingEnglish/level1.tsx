// src/components/readingEnglish/ReadingLevel1.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const letterMap: Record<string, { image: string; word: string }> = {
  A: { image: "/src/images/readingEnglish/level1/apple.png", word: "Apple" },
  B: { image: "/src/images/readingEnglish/level1/ball.png", word: "Ball" },
  C: { image: "/src/images/readingEnglish/level1/cat.png", word: "Cat" },
  D: { image: "/src/images/readingEnglish/level1/dog.png", word: "Dog" },
  E: { image: "/src/images/readingEnglish/level1/elephant.png", word: "Elephant" },
  F: { image: "/src/images/readingEnglish/level1/fish.png", word: "Fish" },
  G: { image: "/src/images/readingEnglish/level1/giraffe.png", word: "Giraffe" },
  H: { image: "/src/images/readingEnglish/level1/hen.png", word: "Hen" },
  I: { image: "/src/images/readingEnglish/level1/icecream.png", word: "Ice Cream" },
  J: { image: "/src/images/readingEnglish/level1/jug.png", word: "Jug" },
  K: { image: "/src/images/readingEnglish/level1/kite.png", word: "Kite" },
  L: { image: "/src/images/readingEnglish/level1/lion.png", word: "Lion" },
  M: { image: "/src/images/readingEnglish/level1/monkey.png", word: "Monkey" },
  N: { image: "/src/images/readingEnglish/level1/nest.png", word: "Nest" },
  O: { image: "/src/images/readingEnglish/level1/orange.png", word: "Orange" },
  P: { image: "/src/images/readingEnglish/level1/parrot.png", word: "Parrot" },
  Q: { image: "/src/images/readingEnglish/level1/queen.png", word: "Queen" },
  R: { image: "/src/images/readingEnglish/level1/rabbit.png", word: "Rabbit" },
  S: { image: "/src/images/readingEnglish/level1/sun.png", word: "Sun" },
  T: { image: "/src/images/readingEnglish/level1/tiger.png", word: "Tiger" },
  U: { image: "/src/images/readingEnglish/level1/umbrella.png", word: "Umbrella" },
  V: { image: "/src/images/readingEnglish/level1/violin.png", word: "Violin" },
  W: { image: "/src/images/readingEnglish/level1/watch.png", word: "Watch" },
  X: { image: "/src/images/readingEnglish/level1/xylophone.png", word: "Xylophone" },
  Y: { image: "/src/images/readingEnglish/level1/yak.png", word: "Yak" },
  Z: { image: "/src/images/readingEnglish/level1/zebra.png", word: "Zebra" },
};

const ReadingLevel1: React.FC = () => {
  const alphabet: string[] = Object.keys(letterMap);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Speak the letter
  const speakLetter = (letter: string): void => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // stop any queued speech
      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speak whenever index changes (with small delay to fix first "A")
  useEffect(() => {
    const timer = setTimeout(() => {
      speakLetter(alphabet[currentIndex]);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < alphabet.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleRepeat = () => speakLetter(alphabet[currentIndex]);

  const currentLetter = alphabet[currentIndex];
  const { image, word } = letterMap[currentLetter];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6 font-dyslexic">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="text-4xl font-bold text-purple-700 mb-10 drop-shadow-sm"
      >
        ✨ Learning Letters - Level 1 ✨
      </motion.h1>

      {/* Letter + Image Card */}
      <motion.div
        key={currentLetter}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="grid grid-cols-2 gap-6 w-full max-w-4xl bg-white rounded-2xl shadow-xl p-10"
      >
        {/* LEFT SIDE - Letter */}
        <div className="flex flex-col items-center justify-center border-r border-gray-200 pr-6">
          <p className="text-lg text-gray-600 mb-3">Listen to the letter:</p>
          <motion.div
            key={currentLetter}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-8xl font-extrabold text-blue-600 tracking-wider my-4"
          >
            {currentLetter}
          </motion.div>
        </div>

        {/* RIGHT SIDE - Image + Word */}
        <div className="flex flex-col items-center justify-center">
          <motion.img
            key={word}
            src={image}
            alt={word}
            className="w-40 h-40 object-contain mb-4 drop-shadow-md rounded-xl bg-gradient-to-tr from-purple-50 to-white p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          />
          <motion.p
            key={word + "-text"}
            className="text-3xl font-semibold text-purple-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {word}
          </motion.p>
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-2 gap-6 mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
        >
          ⬅️ Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === alphabet.length - 1}
          className="px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
        >
          Next ➡️
        </button>
      </div>

      {/* Repeat Button */}
      <motion.button
        onClick={handleRepeat}
        whileTap={{ scale: 0.95 }}
        className="mt-6 w-full max-w-xs bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-3 rounded-full font-semibold transition shadow-lg"
      >
        🔁 Repeat Sound
      </motion.button>
    </div>
  );
};

export default ReadingLevel1;
