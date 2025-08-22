import React from 'react';
import { Link, useParams } from 'react-router-dom';

const capitalize = (s: string) => {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
}

const ReadingLevels: React.FC = () => {
    const { subject } = useParams<{ subject: string }>();

    if (!subject) {
        return <div>Subject not found. Please go back and select a subject.</div>;
    }
    
    // Define levels for English
    const englishLevels = [
        { level: 1, title: "Learn the Alphabet", description: "Listen to the sounds of each letter.", link: `/readingEnglish/level1` },
        { level: 2, title: "Alphabet Quiz", description: "Test your knowledge of letter sounds.", link: `/readingEnglish/level2` },
        { level: 3, title: "Level 3", description: "Description for original level 2.", link: `/readingEnglish/level3` },
        { level: 4, title: "Level 4", description: "Description for original level 3.", link: `/readingEnglish/level4` },
    ];

    // You can define levels for other subjects here later
    // const hindiLevels = [...]

    const levelsToShow = subject.toLowerCase() === 'english' ? englishLevels : [];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-4xl font-bold mb-8">
                {capitalize(subject)} Reading Levels
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                
                {levelsToShow.map((item) => (
                    <Link to={item.link} key={item.level} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center block">
                        <h2 className={`text-2xl font-bold ${item.level === 1 ? 'text-blue-600' : 'text-green-600'}`}>
                            Level {item.level}
                        </h2>
                        <h3 className="text-xl font-semibold text-gray-800 mt-2">{item.title}</h3>
                        <p className="text-gray-600 mt-1">{item.description}</p>
                    </Link>
                ))}
                
            </div>
        </div>
    );
};

export default ReadingLevels;