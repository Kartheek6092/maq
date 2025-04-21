"use client"

import { useEffect, useState } from 'react';

const TOTAL_TIME = 120 * 60; // 120 minutes in seconds
const TOTAL_QUESTIONS = 64;

type ResponseStatus = 'answered' | 'review' | 'review-answered' | 'skipped' | '';
type Responses = {
    [questionNumber: number]: {
        selected: number | null;
        status: ResponseStatus;
    };
};

export default function MCQPage() {
    const [currentQuestion, setCurrentQuestion] = useState<number>(1);
    const [responses, setResponses] = useState<Responses>({});
    const [timeLeft, setTimeLeft] = useState<number>(TOTAL_TIME);

    // Timer countdown
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    alert("Time is up! Auto-submitting your test.");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = () => {
        const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
        const seconds = String(timeLeft % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const updateResponse = (type: ResponseStatus) => {
        setResponses((prev) => ({
            ...prev,
            [currentQuestion]: {
                selected: prev[currentQuestion]?.selected ?? null,
                status: type,
            },
        }));
    };

    const handleOptionChange = (value: number) => {
        setResponses((prev) => ({
            ...prev,
            [currentQuestion]: {
                selected: value,
                status: 'answered',
            },
        }));
    };

    const goToQuestion = (q: number) => setCurrentQuestion(q);
    const nextQuestion = () => setCurrentQuestion((q) => Math.min(q + 1, TOTAL_QUESTIONS));
    const prevQuestion = () => setCurrentQuestion((q) => Math.max(q - 1, 1));

    const renderStatusColor = (q: number): string => {
        const status = responses[q]?.status;
        if (!responses[q]) return 'bg-gray-300';
        if (status === 'answered') return 'bg-green-500';
        if (status === 'review') return 'bg-purple-500';
        if (status === 'review-answered') return 'bg-indigo-600';
        if (status === 'skipped') return 'bg-red-500';
        return 'bg-gray-300';
    };

    return (
        <div className="min-h-screen bg-white font-sans text-black">
            {/* Header */}
            <div className="bg-orange-500 text-white flex justify-between px-4 py-2 items-center">
                <div className="font-bold text-lg">CSIR II CHEMICAL SCIENCE</div>
                <div className="text-sm">
                    Candidate Name: <span className="font-semibold">[Your Name]</span><br />
                    <span className="font-semibold">[Test Practice]</span><br />
                    Remaining Time: <span className="text-[#010101] font-bold">{`${String(Math.floor(timeLeft / 3600)).padStart(2, '0')}:${String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`}</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row px-20 mt-4 gap-4">
                {/* Left: Question Area */}
                <div className="w-full md:w-2/3">
                    <div className="text-lg font-semibold mb-2">Question {currentQuestion}:</div>
                    <div className="space-y-2 mb-6">
                        {[1, 2, 3, 4].map((val) => (
                            <label key={val} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="option"
                                    value={val}
                                    checked={responses[currentQuestion]?.selected === val}
                                    onChange={() => handleOptionChange(val)}
                                />
                                <span>{val}) Option {val}</span>
                            </label>
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => {
                                updateResponse('answered');
                                nextQuestion();
                            }}
                            className="bg-green-500 text-white px-3 py-1"
                        >
                            Save & Next
                        </button>
                        <button
                            onClick={() => {
                                updateResponse('review-answered');
                                nextQuestion();
                            }}
                            className="bg-yellow-400 px-3 py-1"
                        >
                            Save & Mark for Review
                        </button>
                        <button
                            onClick={() => {
                                updateResponse('');
                                setResponses((prev) => ({
                                    ...prev,
                                    [currentQuestion]: {
                                        selected: null,
                                        status: '',
                                    },
                                }));
                            }}
                            className="border px-3 py-1"
                        >
                            Clear Response
                        </button>
                        <button
                            onClick={() => {
                                updateResponse('review');
                                nextQuestion();
                            }}
                            className="bg-blue-500 text-white px-3 py-1"
                        >
                            Mark for Review & Next
                        </button>
                    </div>

                    {/* Nav buttons */}
                    <div className="flex gap-2">
                        <button onClick={prevQuestion} className="border px-3 py-1">&lt;&lt; Back</button>
                        <button onClick={nextQuestion} className="border px-3 py-1">Next &gt;&gt;</button>
                        <button onClick={() => alert('Submitted!')} className="ml-auto bg-green-600 text-white px-4 py-1">Submit</button>
                    </div>
                </div>

                {/* Right: Palette and Legends */}
                <div className="w-full md:w-1/3">
                    <div className="space-y-1 text-sm mb-2">
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-gray-300 inline-block"></span> Not Visited
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-red-500 inline-block"></span> Not Answered
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-green-500 inline-block"></span> Answered
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-purple-500 inline-block"></span> Marked for Review
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-indigo-600 inline-block"></span> Answered & Marked for Review
                        </div>
                    </div>

                    {/* Palette */}
                    <div className="grid grid-cols-8 gap-1 mt-4">
                        {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => goToQuestion(i + 1)}
                                className={`text-sm w-8 h-8 border text-white ${renderStatusColor(i + 1)}`}
                            >
                                {String(i + 1).padStart(2, '0')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
