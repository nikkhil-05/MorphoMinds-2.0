// components/readingEnglish/level5.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const ReadingEnglishLevel5: React.FC = () => {
  const [sentence, setSentence] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isListening, setIsListening] = useState(false);

  // ✅ Fetch sentence from backend
  const fetchSentence = async () => {
    try {
      const res = await axios.get("http://localhost:5000/get-sentence");
      setSentence(res.data.sentence);
      setFeedback("");
    } catch (err) {
      console.error("Error fetching sentence:", err);
      setFeedback("❌ Failed to fetch sentence. Please try again.");
    }
  };

  // 🎤 Try Yourself - speech recognition
  const startListening = () => {
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

    recognition.start();
    setIsListening(true);
    setFeedback("🎤 Listening...");

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      console.log("User said:", spokenText);

      if (spokenText.trim().toLowerCase() === sentence.trim().toLowerCase()) {
        setFeedback("✅ Correct!");
      } else {
        setFeedback(`❌ Incorrect. You said: "${spokenText}"`);
      }

      setIsListening(false);
    };

    recognition.onerror = () => {
      setFeedback("⚠️ Speech recognition failed. Try again.");
      setIsListening(false);
    };
  };

  // 🔊 Listen to sentence only
  const listenSentence = () => {
    if (!sentence) return;

    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    fetchSentence(); // fetch sentence on load
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-purple-50">
      <h1 className="text-3xl font-bold mb-6 text-purple-700 text-center">
        Level 5: Read Simple Sentences
      </h1>
      <p className="mb-8 text-gray-700 text-center max-w-md">
        Listen to the sentence first or try reading it aloud yourself. The system will give instant feedback.
      </p>

      <div className="bg-white shadow-xl rounded-2xl p-8 text-center w-full max-w-xl space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">{sentence || "Loading..."}</h2>

        {/* 🔊 Listen only */}
        <button
          onClick={listenSentence}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
        >
          🔊 Listen to Sentence
        </button>

        {/* 🎤 Try Yourself */}
        <button
          onClick={startListening}
          disabled={isListening}
          className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition disabled:bg-gray-400"
        >
          {isListening ? "Listening..." : "🎤 Try Yourself"}
        </button>

        <p className="mt-4 text-lg text-gray-800">{feedback}</p>

        {/* Next Sentence */}
        <button
          onClick={fetchSentence}
          className="mt-4 w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
        >
          Next Sentence ➡️
        </button>
      </div>
    </div>
  );
};

export default ReadingEnglishLevel5;
