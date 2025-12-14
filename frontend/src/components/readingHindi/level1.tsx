import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface Vowel {
  vowel: string;
  roman: string;
  image: string;
}

const vowelImages: Record<string, string> = {
  'अ': '/src/images/readingHindi/level1/a.png',
  'आ': '/src/images/readingHindi/level1/aa.png',
  'इ': '/src/images/readingHindi/level1/i.png',
  'ई': '/src/images/readingHindi/level1/ee.png',
  'उ': '/src/images/readingHindi/level1/u.png',
  'ऊ': '/src/images/readingHindi/level1/oo.png',
  'ऋ': '/src/images/readingHindi/level1/ri.png',
  'ए': '/src/images/readingHindi/level1/e.png',
  'ऐ': '/src/images/readingHindi/level1/ai.png',
  'ओ': '/src/images/readingHindi/level1/o.png',
  'औ': '/src/images/readingHindi/level1/au.png',
  'अं': '/src/images/readingHindi/level1/am.png',
  'अः': '/src/images/readingHindi/level1/ah.png'
};

const ReadingHindiLevel1: React.FC = () => {
  const [vowels, setVowels] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedVowel, setSelectedVowel] = useState<Vowel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load vowels from backend
  useEffect(() => {
    axios
      .get("http://localhost:5002/level1/list")
      .then((res) => setVowels(res.data.vowels))
      .catch((err) => {
        console.error(err);
        setError("Vowels list could not be loaded.");
      });
  }, []);

  const pronounceVowel = async (vowel: string) => {
    setError("");

    // Immediately set vowel state so letter & image appear
    setSelectedVowel({
      vowel,
      roman: "", // will be updated after API
      image: vowelImages[vowel] || ""
    });

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5002/level1/pronounce", { vowel });
      if (res.data.success) {
        // Update Roman transliteration after pronunciation
        setSelectedVowel(prev => prev ? { ...prev, roman: res.data.roman } : prev);
      } else {
        setError("Failed to pronounce the vowel.");
      }
    } catch (err) {
      console.error(err);
      setError("Error calling pronunciation API.");
    }
    setLoading(false);
  };

  const handleNext = () => {
    if (currentIndex < vowels.length - 1) {
      const nextVowel = vowels[currentIndex + 1];
      setCurrentIndex(currentIndex + 1);
      pronounceVowel(nextVowel);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevVowel = vowels[currentIndex - 1];
      setCurrentIndex(currentIndex - 1);
      pronounceVowel(prevVowel);
    }
  };

  const handleRepeat = () => {
    if (vowels.length > 0) pronounceVowel(vowels[currentIndex]);
  };

  // Auto-play first vowel after load
  useEffect(() => {
    if (vowels.length > 0) pronounceVowel(vowels[0]);
  }, [vowels]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 p-6 font-sans">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-red-700 mb-10 drop-shadow-md"
      >
        ✨ हिंदी स्वर अभ्यास - Level 1 ✨
      </motion.h1>

      <motion.div
        key={selectedVowel?.vowel}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 gap-6 w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 min-h-[300px]"
      >
        {/* LEFT - Vowel */}
        <div className="flex flex-col items-center justify-center border-r border-gray-200 pr-6 w-full">
          <p className="text-lg text-gray-600 mb-3 text-center">सुनें और पहचानें:</p>
          <motion.div
            key={selectedVowel?.vowel}
            className="text-8xl font-extrabold text-red-600 my-4 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {selectedVowel?.vowel}
          </motion.div>
        </div>

        {/* RIGHT - Image + Roman */}
        <div className="flex flex-col items-center justify-center w-full">
          {selectedVowel?.image && (
            <motion.img
              key={selectedVowel.image}
              src={selectedVowel.image}
              alt={selectedVowel.roman}
              className="w-40 h-40 object-contain mb-4 rounded-xl drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
          {selectedVowel && (
            <motion.p
              key={selectedVowel.roman + "-text"}
              className="text-2xl font-semibold text-red-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Roman: {selectedVowel.roman}
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-2 gap-6 mt-8 w-full max-w-md">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 transition disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
        >
          ⬅️ Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === vowels.length - 1}
          className="px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 transition disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
        >
          Next ➡️
        </button>
      </div>

      {/* Repeat Button */}
      <motion.button
        onClick={handleRepeat}
        whileTap={{ scale: 0.95 }}
        className="mt-6 w-full max-w-xs bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white px-6 py-3 rounded-full font-semibold transition shadow-lg"
      >
        🔁 Repeat Sound
      </motion.button>

      {/* Loading & Error */}
      {loading && <p className="mt-4 text-gray-600">🔊 ध्वनि चल रही है...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default ReadingHindiLevel1;
