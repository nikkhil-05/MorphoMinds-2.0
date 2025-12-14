import React from 'react';
import { Link, useParams } from 'react-router-dom';
import MovingBubbles from "@/components/MovingBubbles";

// Capitalize first letter
const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

// Import level data from each subject folder
import englishLevels from '../readingEnglish/index';
import hindiLevels from '../readingHindi/index';


// Map subjects to their levels
const subjectLevelsMap: Record<string, { level: number; title: string; description: string; link: string }[]> = {
    english: englishLevels,
    hindi: hindiLevels,
};

const ReadingLevels: React.FC = () => {
    const { subject } = useParams<{ subject: string }>();

    if (!subject) return <div>Subject not found.</div>;

    const levelsToShow = subjectLevelsMap[subject.toLowerCase()];

    if (!levelsToShow) return <div>No data found for {subject}.</div>;

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Background Bubbles */}
            <MovingBubbles />

            {/* Foreground content */}
            <div className="relative z-10 p-6">
                <h1 className="text-4xl font-bold mb-8 text-center">
                    {capitalize(subject)} Reading Levels
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                    {levelsToShow.map((item) => (
                        <Link
                            to={item.link}
                            key={item.level}
                            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center block"
                        >
                            <h2 className={`text-2xl font-bold ${item.level === 1 ? 'text-blue-600' : 'text-green-600'}`}>
                                Level {item.level}
                            </h2>
                            <h3 className="text-xl font-semibold text-gray-800 mt-2">{item.title}</h3>
                            <p className="text-gray-600 mt-1">{item.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReadingLevels;
