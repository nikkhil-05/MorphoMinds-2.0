import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const getRandomLetter = (exclude: string) => {
  let newLetter;
  do {
    newLetter = ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
  } while (newLetter === exclude);
  return newLetter;
};

const WritingLevel2: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentLetter, setCurrentLetter] = useState("A");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ prediction: string; correct: boolean } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const container = containerRef.current;
      const containerWidth = container ? container.clientWidth : 400;
      const size = Math.min(containerWidth * 0.9, 400);
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineWidth = size / 20;
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getEventPoint = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0]?.clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0]?.clientY : e.clientY;
    if (clientX === undefined || clientY === undefined) return null;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const point = getEventPoint(e);
    if (!point) return;
    setIsDrawing(true);
    setLastPoint(point);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !lastPoint || !canvasRef.current) return;
    const point = getEventPoint(e);
    if (!point) return;
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
    setLastPoint(point);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    setResult(null);
  };

  const handleNextLetter = () => {
    setCurrentLetter(getRandomLetter(currentLetter));
    clearCanvas();
  };

  const handleSubmit = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const smallCanvas = document.createElement("canvas");
    smallCanvas.width = 28;
    smallCanvas.height = 28;
    const smallCtx = smallCanvas.getContext("2d");
    if (!smallCtx) return;

    smallCtx.fillStyle = "white";
    smallCtx.fillRect(0, 0, 28, 28);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        if (imgData.data[idx + 3] > 0) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    const width = maxX - minX || 1;
    const height = maxY - minY || 1;

    smallCtx.drawImage(canvas, minX, minY, width, height, 0, 0, 28, 28);

    const imageData = smallCtx.getImageData(0, 0, 28, 28);
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = 255 - imageData.data[i];
      imageData.data[i + 1] = 255 - imageData.data[i + 1];
      imageData.data[i + 2] = 255 - imageData.data[i + 2];
    }
    smallCtx.putImageData(imageData, 0, 0);

    const imageDataUrl = smallCanvas.toDataURL("image/png");

    setIsLoading(true);
    setResult(null);

    try {
      const response = await axios.post("http://localhost:5001/predict", { image: imageDataUrl });
      const prediction = response.data.prediction;
      setResult({ prediction, correct: prediction === currentLetter });
    } catch (error) {
      console.error("Error predicting:", error);
      alert("Could not connect to the ML server. Is it running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-purple-50 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-3">Writing Test</h1>
        <p className="text-center text-gray-600 mb-6">
          Try to write the letter shown below. Click "Submit" when done.
        </p>

        <div className="flex items-center justify-center space-x-6 mb-6">
          <span className="text-2xl font-semibold">Write this letter:</span>
          <div className="text-8xl font-bold text-purple-600">{currentLetter}</div>
        </div>

        <div ref={containerRef} className="flex flex-col items-center w-full">
          <canvas
            ref={canvasRef}
            className="border-4 border-purple-400 bg-white rounded-xl shadow-lg mb-4"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onTouchCancel={stopDrawing}
          />

          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <button
              onClick={clearCanvas}
              className="px-6 py-2 bg-gray-400 text-white font-semibold rounded-lg shadow hover:bg-gray-500 transition"
            >
              Clear
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {isLoading ? "Checking..." : "Submit"}
            </button>
            <button
              onClick={handleNextLetter}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
            >
              Next Letter
            </button>
          </div>

          {result && (
            <div
              className={`mt-6 p-4 rounded-lg text-center text-white text-xl font-semibold ${
                result.correct ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {result.correct
                ? `✅ Correct! You wrote "${result.prediction}".`
                : `❌ Not quite. You wrote "${result.prediction}", but the letter was "${currentLetter}".`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WritingLevel2;
