// src/components/writingEnglish/level2.tsx

import React, { useRef, useState, useEffect } from "react";
import axios from 'axios';

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Helper to get a new random letter
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
  
  // New state for ML integration
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
          ctx.lineWidth = size / 20; // Make pen thicker on larger canvases
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
    const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
    
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
    setResult(null); // Clear previous results
  };

  const handleNextLetter = () => {
    setCurrentLetter(getRandomLetter(currentLetter));
    clearCanvas();
  };

  const handleSubmit = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a new canvas with a white background because toDataURL exports transparency
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = canvas.width;
    bgCanvas.height = canvas.height;
    const bgCtx = bgCanvas.getContext('2d');
    if (!bgCtx) return;

    bgCtx.fillStyle = 'white';
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
    bgCtx.drawImage(canvas, 0, 0);

    const imageDataUrl = bgCanvas.toDataURL('image/png');
    
    setIsLoading(true);
    setResult(null);

    try {
        const response = await axios.post('http://localhost:5000/predict', {
            image: imageDataUrl
        });
        const prediction = response.data.prediction;
        setResult({
            prediction: prediction,
            correct: prediction === currentLetter
        });
    } catch (error) {
        console.error("Error predicting:", error);
        alert("Could not connect to the ML server. Is it running?");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-purple-600">Writing Test</h1>
        <p className="text-gray-700 mt-2 text-center">
            Try to write the letter shown below. When you're done, press "Submit".
        </p>

        <div className="my-6 flex items-center justify-center space-x-4">
            <span className="text-2xl">Write this letter:</span>
            <div className="text-8xl font-bold text-purple-500">{currentLetter}</div>
        </div>

        <div ref={containerRef} className="flex flex-col items-center w-full">
            <div className="canvas-container touch-none shadow-lg">
                <canvas
                    ref={canvasRef}
                    className="border-2 border-purple-400 bg-white rounded-xl touch-none"
                    onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} onTouchCancel={stopDrawing}
                />
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-4">
                <button onClick={clearCanvas} className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                    Clear
                </button>
                <button onClick={handleSubmit} disabled={isLoading} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                    {isLoading ? "Checking..." : "Submit"}
                </button>
                <button onClick={handleNextLetter} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Next Letter
                </button>
            </div>

            {result && (
                <div className={`mt-6 p-4 rounded-lg text-center text-white text-xl font-semibold ${result.correct ? 'bg-green-500' : 'bg-red-500'}`}>
                    {result.correct ? (
                        `✅ Correct! You wrote "${result.prediction}".`
                    ) : (
                        `❌ Not quite. You wrote "${result.prediction}", but the letter was "${currentLetter}". Try again!`
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default WritingLevel2;