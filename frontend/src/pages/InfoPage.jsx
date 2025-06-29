import React from 'react';
import { Link } from 'react-router-dom';

const InfoPage = () => {
    const pros = [
        "Lazy loading on Home page",
        "Auto play in playlists",
        "Dragging and sorting through dnd-kit",
        "Full admin control for your channel",
        "Optimized data handling",
        "Searching works for both channels and videos",
        "Aggregation pipeline used for fewer DB calls",
        "Used Tanstack and Redux Toolkit"
    ];

    const cons = [
        "UI mainly optimized for laptops — minor glitches on mobile",
        "Free Cloudinary tier = no large videos",
        "Email verification skipped — fake emails work too 😅",
        "No password recovery (yet!)",
        "Subs count needs 1 reload to show up",
        "Unproffessional Folder structure"
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl font-bold mb-4">Welcome to Cliphub</h1>
            <p className="text-gray-300 mb-8 text-center max-w-xl">Before you proceed, here’s a quick overview of what you’ll love — and what’s still cooking.</p>


            <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                <div className="bg-green-800 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">✅ Highlights</h2>
                    <ul className="list-disc list-inside space-y-2">
                        {pros.map((pro, idx) => (
                            <li key={idx}>{pro}</li>
                        ))}
                    </ul>
                </div>

                <div className="bg-red-800 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">❌ Known Quirks</h2>
                    <ul className="list-disc list-inside space-y-2">
                        {cons.map((con, idx) => (
                            <li key={idx}>{con}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="bg-gray-800 text-white p-4 rounded-lg max-w-sm mx-auto mt-6 shadow-md">
                <p className="text-sm mb-2 text-gray-300">You can use this account if you don’t want to sign up:</p>
                <p className="font-semibold">Email: <span className="text-blue-400">Solo@test.com</span></p>
                <p className="font-semibold">Password: <span className="text-blue-400">solo123</span></p>
            </div>



            <Link to={"/load"}>
                <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold">
                    Contnue
                </button>
            </Link>
        </div>
    );
};

export default InfoPage;
