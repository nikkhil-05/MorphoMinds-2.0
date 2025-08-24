import React from 'react';
import { Link, useParams } from 'react-router-dom';
import MovingBubbles from "@/components/MovingBubbles"; // ✅ import it

const capitalize = (s: string) => {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
}

const ReadingLevels: React.FC = () => {
    const { subject } = useParams<{ subject: string }>();

    if (!subject) {
        return <div>Subject not found. Please go back and select a subject.</div>;
    }
    
    const englishLevels = [
        { level: 1, title: "Learn the Alphabet", description: "Listen to the sounds of each letter.", link: `/readingEnglish/level1` },
        { level: 2, title: "Alphabet Quiz", description: "Test your knowledge of letter sounds.", link: `/readingEnglish/level2` },
        { level: 3, title: "Word Builder", description: "In this level, learners will practice reading simple words made up of 3 to 5 letters.", link: `/readingEnglish/level3` },
        { level: 4, title: "Longer Words", description: "In this level, learners will practice reading simple words made 5 or more letters", link: `/readingEnglish/level4` },
        { level: 5, title: "Simple Sentences",  description: "Learn to read and understand short sentences made from familiar words.", link: `/readingEnglish/level5` }

    ];

    const levelsToShow = subject.toLowerCase() === 'english' ? englishLevels : [];

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* ✅ Background Bubbles */}
            <MovingBubbles />

            {/* ✅ Foreground content */}
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
