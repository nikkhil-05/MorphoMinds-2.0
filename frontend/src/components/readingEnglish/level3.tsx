import React, { useEffect, useState } from "react";
import axios from "axios";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const ReadingLevel3 = () => {
  const [word, setWord] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState("");

  // ✅ Fetch word from backend
  const fetchWord = async () => {
    try {
      const res = await axios.get("http://localhost:5000/get-word?level=3");
      setWord(res.data.word);
      setResult("");
    } catch (err) {
      console.error("Error fetching word:", err);
      setResult("❌ Failed to fetch word. Please try again.");
    }
  };

  const handleSpeech = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false; // ✅ stop after one result

    setIsListening(true);
    setResult("🎤 Listening...");

    recognition.start();

    recognition.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript.toLowerCase().trim();
      console.log("User said:", spoken);

      if (spoken === word.toLowerCase()) {
        setResult("✅ Correct! You said the word.");
      } else {
        setResult(`❌ Incorrect. You said "${spoken}". Try again.`);
      }

      recognition.stop();
      setIsListening(false);
    };

    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);

      // 👇 If no result captured, give feedback
      setResult((prev) => {
        if (!prev || prev.includes("Listening")) {
          return "❌ No speech detected. Please try again.";
        }
        return prev;
      });
    };

    recognition.onerror = (e: any) => {
      console.error("Speech error:", e);
      setResult("❌ Speech recognition failed. Please try again.");
      setIsListening(false);
    };
  };

  // ✅ Built-in Text-to-Speech
  const handleTextToSpeech = () => {
    if (!word) return;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    fetchWord(); // Fetch initial word when component loads
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-white p-6">
      <h1 className="text-3xl font-bold text-yellow-600 mb-6">
        Reading Practice - Level 3
      </h1>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <p className="text-lg text-gray-700 mb-4">🔠 Read the word aloud:</p>

        <div className="text-5xl font-extrabold text-yellow-700 mb-6 tracking-wider">
          {word || "..."}
        </div>

        {/* 🎤 Start Speaking */}
        <button
          onClick={handleSpeech}
          disabled={isListening}
          className={`px-6 py-2 rounded-full text-white font-semibold transition-all duration-200 ${
            isListening
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          🎤 {isListening ? "Listening..." : "Start Speaking"}
        </button>

        {/* ✅/❌ Result */}
        {result && (
          <p
            className={`mt-4 text-lg font-medium ${
              result.includes("✅")
                ? "text-green-600"
                : result.includes("❌")
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {result}
          </p>
        )}

        {/* 🔁 New Word */}
        <button
          onClick={fetchWord}
          className="mt-4 bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-2 rounded-full transition-all"
        >
          🔁 New Word
        </button>

        {/* 🔊 Listen to Word */}
        <button
          onClick={handleTextToSpeech}
          className="mt-4 bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-2 rounded-full transition-all"
        >
          🔊 Listen to Word
        </button>
      </div>
    </div>
  );
};

export default ReadingLevel3;
