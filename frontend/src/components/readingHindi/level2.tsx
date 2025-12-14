import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface Consonant {
  consonant: string;
  roman: string;
  image: string;
}

const consonantImages: Record<string, string> = {
  'क': '/src/images/readingHindi/level2/ka.png',
  'ख': '/src/images/readingHindi/level2/kha.png',
  'ग': '/src/images/readingHindi/level2/ga.png',
  'घ': '/src/images/readingHindi/level2/gha.png',
  'ङ': '/src/images/readingHindi/level2/nga.png',
  'च': '/src/images/readingHindi/level2/cha.png',
  'छ': '/src/images/readingHindi/level2/chha.png',
  'ज': '/src/images/readingHindi/level2/ja.png',
  'झ': '/src/images/readingHindi/level2/jha.png',
  'ञ': '/src/images/readingHindi/level2/nya.png',
  'ट': '/src/images/readingHindi/level2/ta.png',
  'ठ': '/src/images/readingHindi/level2/tha.png',
  'ड': '/src/images/readingHindi/level2/da.png',
  'ढ': '/src/images/readingHindi/level2/dha.png',
  'ण': '/src/images/readingHindi/level2/na.png',
  'त': '/src/images/readingHindi/level2/ta2.png',
  'थ': '/src/images/readingHindi/level2/tha2.png',
  'द': '/src/images/readingHindi/level2/da2.png',
  'ध': '/src/images/readingHindi/level2/dha2.png',
  'न': '/src/images/readingHindi/level2/na2.png',
  'प': '/src/images/readingHindi/level2/pa.png',
  'फ': '/src/images/readingHindi/level2/pha.png',
  'ब': '/src/images/readingHindi/level2/ba.png',
  'भ': '/src/images/readingHindi/level2/bha.png',
  'म': '/src/images/readingHindi/level2/ma.png',
  'य': '/src/images/readingHindi/level2/ya.png',
  'र': '/src/images/readingHindi/level2/ra.png',
  'ल': '/src/images/readingHindi/level2/la.png',
  'व': '/src/images/readingHindi/level2/va.png',
  'श': '/src/images/readingHindi/level2/sha.png',
  'ष': '/src/images/readingHindi/level2/sha2.png',
  'स': '/src/images/readingHindi/level2/sa.png',
  'ह': '/src/images/readingHindi/level2/ha.png',
  'क्ष': '/src/images/readingHindi/level2/ksha.png',
  'त्र': '/src/images/readingHindi/level2/tra.png',
  'ज्ञ': '/src/images/readingHindi/level2/gya.png',
};

const ReadingHindiLevel2: React.FC = () => {
  const [consonants, setConsonants] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedConsonant, setSelectedConsonant] = useState<Consonant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load consonant list from backend
  useEffect(() => {
    axios
      .get("http://localhost:5002/level2/consonant/list") // fixed route
      .then((res) => setConsonants(res.data.consonants))
      .catch((err) => {
        console.error(err);
        setError("Consonant list could not be loaded.");
      });
  }, []);

  // Pronounce consonant
  const pronounceConsonant = async (consonant: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5002/level2/consonant/pronounce", { consonant });
      if (res.data.success) {
        setSelectedConsonant({
          consonant: res.data.consonant,
          roman: res.data.roman,
          image: consonantImages[res.data.consonant] || ""
        });
      } else {
        setError("Failed to pronounce consonant.");
      }
    } catch (err) {
      console.error(err);
      setError("Error calling pronunciation API.");
    }
    setLoading(false);
  };

  // Navigation
  const handleNext = () => {
    if (currentIndex < consonants.length - 1) {
      setCurrentIndex(currentIndex + 1);
      pronounceConsonant(consonants[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      pronounceConsonant(consonants[currentIndex - 1]);
    }
  };

  const handleRepeat = () => {
    pronounceConsonant(consonants[currentIndex]);
  };

  useEffect(() => {
    if (consonants.length > 0) pronounceConsonant(consonants[0]);
  }, [consonants]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 p-6 font-sans">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-red-700 mb-10 drop-shadow-md"
      >
        ✨ हिंदी व्यंजन अभ्यास - Level 2 ✨
      </motion.h1>

      <motion.div
        key={selectedConsonant?.consonant}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 gap-6 w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8"
      >
        {/* LEFT - Consonant */}
        <div className="flex flex-col items-center justify-center border-r border-gray-200 pr-6 w-64 h-64">
          <p className="text-lg text-gray-600 mb-3 text-center">सुनें और पहचानें:</p>
          <motion.div
            key={selectedConsonant?.consonant}
            className="text-8xl font-extrabold text-red-600 my-4 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {selectedConsonant?.consonant}
          </motion.div>
        </div>

        {/* RIGHT - Image + Roman */}
        <div className="flex flex-col items-center justify-center w-64 h-64">
          {selectedConsonant?.image && (
            <motion.img
              key={selectedConsonant.image}
              src={selectedConsonant.image}
              alt={selectedConsonant.roman}
              className="w-40 h-40 object-contain mb-4 rounded-xl drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
          {selectedConsonant && (
            <motion.p
              key={selectedConsonant.roman + "-text"}
              className="text-2xl font-semibold text-red-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Roman: {selectedConsonant.roman}
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="grid grid-cols-2 gap-6 mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 transition disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
        >
          ⬅️ Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === consonants.length - 1}
          className="px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 transition disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
        >
          Next ➡️
        </button>
      </div>

      {/* Repeat */}
      <motion.button
        onClick={handleRepeat}
        whileTap={{ scale: 0.95 }}
        className="mt-6 w-full max-w-xs bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white px-6 py-3 rounded-full font-semibold transition shadow-lg"
      >
        🔁 Repeat Sound
      </motion.button>

      {loading && <p className="mt-4 text-gray-600">🔊 ध्वनि चल रही है...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default ReadingHindiLevel2;
