// src/components/readingHindi/level3.tsx
import React, { useState, useRef } from "react";

const SWAR = ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ए", "ऐ", "ओ", "औ", "अं", "अः"];
const VYANJAN = [
  "क", "ख", "ग", "घ", "ङ", "च", "छ", "ज", "झ", "ञ",
  "ट", "ठ", "ड", "ढ", "ण", "त", "थ", "द", "ध", "न",
  "प", "फ", "ब", "भ", "म", "य", "र", "ल", "व",
  "श", "ष", "स", "ह", "क्ष", "त्र", "ज्ञ"
];

const ALL_CHARACTERS = [...SWAR, ...VYANJAN];

const ReadingHindiLevel3: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<string>("अ"); // डिफ़ॉल्ट "अ"
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 🎙 रिकॉर्डिंग शुरू करें
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // 🔼 सर्वर पर भेजें
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.wav");
        formData.append("character", selectedLetter);

        fetch("http://localhost:5002/level3/pronunciation/check", {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            setRecognizedText(data.recognized_text || "");
            if (data.correct) {
              setResult("✅ सही उच्चारण!");
            } else {
              setResult(`❌ गलत। आपने कहा: "${data.recognized_text || "कुछ नहीं"}"`);
            }
          })
          .catch((err) => {
            console.error("Error:", err);
            setResult("⚠️ त्रुटि हुई");
          });
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      // ⏹ 3 सेकंड बाद ऑटो-स्टॉप
      setTimeout(() => stopRecording(), 3000);
    } catch (err) {
      console.error("माइक्रोफ़ोन समस्या:", err);
    }
  };

  // ⏹ रिकॉर्डिंग रोकें
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // 🔊 रिकॉर्डिंग चलाएँ
  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-yellow-50 to-white p-6 font-dyslexic">
      <h1 className="text-3xl font-bold text-orange-700 mb-8">
        हिंदी पठन - स्तर 3 (उच्चारण अभ्यास)
      </h1>

      {/* सभी अक्षर - फैलाकर grid में */}
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3 w-full max-w-6xl mb-10">
        {ALL_CHARACTERS.map((char) => (
          <button
            key={char}
            onClick={() => {
              setSelectedLetter(char);
              setResult("");
              setRecognizedText("");
              setAudioUrl(null);
            }}
            className={`flex items-center justify-center h-14 w-14 rounded-lg text-2xl font-bold transition-all shadow-sm
              ${selectedLetter === char
                ? "bg-orange-600 text-white scale-110 shadow-md"
                : "bg-orange-100 text-orange-700 hover:bg-orange-200"
              }`}
          >
            {char}
          </button>
        ))}
      </div>

      {/* चयनित अक्षर बॉक्स */}
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center space-y-6">
        <div className="text-7xl font-bold text-indigo-600 mb-4">
          {selectedLetter}
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-6 py-3 rounded-xl text-white bg-green-600 hover:bg-green-700 shadow-lg text-lg font-semibold"
            >
              🎙 बोलें
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-6 py-3 rounded-xl text-white bg-red-600 hover:bg-red-700 shadow-lg text-lg font-semibold"
            >
              ⏹ रोकें
            </button>
          )}

          {audioUrl && (
            <button
              onClick={playRecording}
              className="px-6 py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-lg text-lg font-semibold"
            >
              🔊 सुनें
            </button>
          )}
        </div>

        {recognizedText && (
          <p className="text-gray-700 text-md">
            आपने कहा: <b>{recognizedText}</b>
          </p>
        )}

        {result && (
          <p
            className={`text-lg font-medium rounded-xl p-3 w-full ${
              result.includes("✅")
                ? "text-green-600 bg-green-50"
                : "text-red-600 bg-red-50"
            }`}
          >
            {result}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReadingHindiLevel3;
