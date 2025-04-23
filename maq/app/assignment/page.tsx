"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type ResponseStatus = "answered" | "review" | "review-answered" | "skipped" | "";
type Responses = {
    [questionNumber: number]: {
        selected: number | null;
        status: ResponseStatus;
    };
};

type Question = {
    id: string;
    question: string;
    options: string[];
};

export default function MCQPage() {
    const [currentQuestion, setCurrentQuestion] = useState<number>(1);
    const [responses, setResponses] = useState<Responses>({});
    const [timeLeft, setTimeLeft] = useState<number>(120 * 60); // 120 minutes
    const [questions, setQuestions] = useState<Question[]>([]);
    const [assData, setAssData] = useState(null);
    const [loading, setLoading] = useState(true);
    // const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = sessionStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, []);


    // Fetch assignment and questions
    useEffect(() => {
        const fetchAssignmentAndQuestions = async () => {
            try {
                // Replace with your actual API endpoints
                const assignmentRes = await axios.get("/api/admin/assignments/latest"); // returns { questionIds: number[] }
                setAssData(assignmentRes.data)
                const questionIds = assignmentRes.data.questionIds;

                const questionsRes = await axios.post("/api/admin/questions/ass-questions", { ids: questionIds });
                const fetchedQuestions = questionsRes.data.map((q: any) => ({
                    id: q._id,
                    question: q.text,
                    options: q.options.map((opt: any) => opt.text), // Assuming options have a `text` field
                }));
                setQuestions(fetchedQuestions);
            } catch (error) {
                console.error("Error fetching assignment/questions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignmentAndQuestions();
    }, []);

    // Timer - start when assData is available
    useEffect(() => {
        if (!assData?.durationMinutes) return;

        // Convert duration from minutes to seconds
        const durationInSeconds = assData.durationMinutes * 60;
        setTimeLeft(durationInSeconds);

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
    }, [assData]);


    const formatTime = () => {
        const hours = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
        const seconds = String(timeLeft % 60).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
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
                status: "answered",
            },
        }));
    };

    const goToQuestion = (q: number) => setCurrentQuestion(q);
    const nextQuestion = () => setCurrentQuestion((q) => Math.min(q + 1, questions.length));
    const prevQuestion = () => setCurrentQuestion((q) => Math.max(q - 1, 1));

    const renderStatusColor = (q: number): string => {
        const status = responses[q]?.status;
        if (!responses[q]) return "bg-gray-300";
        if (status === "answered") return "bg-green-500";
        if (status === "review") return "bg-purple-500";
        if (status === "review-answered") return "bg-indigo-600";
        if (status === "skipped") return "bg-red-500";
        return "bg-gray-300";
    };

    const current = questions[currentQuestion - 1];

    if (loading) return <div className="p-6 text-center">Loading...</div>;
    //  console.log('user', user);

    return (
        <div className="min-h-screen bg-white font-sans text-black">
            {/* Header */}
            <div className="bg-orange-500 text-white flex justify-between px-4 py-2 items-center">
                <div className="font-bold text-lg">CSIR II CHEMICAL SCIENCE</div>
                <div className="w-[200px] text-sm">
                    Candidate Name: <span className="font-semibold">{user ? user?.name : '[Your Name]'}</span>
                    <br />
                    Remaining Time: <span className="text-[#010101] font-bold">{formatTime()}</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row px-20 mt-4 gap-4">
                {/* Left Section: Question */}
                <div className="w-full md:w-2/3">
                    <div className="text-lg font-semibold mb-2">Question {currentQuestion}:</div>
                    <div className="mb-4">{current?.question}</div>

                    <div className="space-y-2 mb-6">
                        {current?.options?.map((option, idx) => (
                            <label key={idx} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="option"
                                    value={idx}
                                    checked={responses[currentQuestion]?.selected === idx}
                                    onChange={() => handleOptionChange(idx)}
                                />
                                <span>{`${String.fromCharCode(65 + idx)}) ${option}`}</span>
                            </label>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => {
                                updateResponse("answered");
                                nextQuestion();
                            }}
                            className="bg-green-500 text-white px-3 py-1"
                        >
                            Save & Next
                        </button>
                        <button
                            onClick={() => {
                                updateResponse("review-answered");
                                nextQuestion();
                            }}
                            className="bg-yellow-400 px-3 py-1"
                        >
                            Save & Mark for Review
                        </button>
                        <button
                            onClick={() =>
                                setResponses((prev) => ({
                                    ...prev,
                                    [currentQuestion]: { selected: null, status: "" },
                                }))
                            }
                            className="border px-3 py-1"
                        >
                            Clear Response
                        </button>
                        <button
                            onClick={() => {
                                updateResponse("review");
                                nextQuestion();
                            }}
                            className="bg-blue-500 text-white px-3 py-1"
                        >
                            Mark for Review & Next
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={prevQuestion} className="border px-3 py-1">
                            &lt;&lt; Back
                        </button>
                        <button onClick={nextQuestion} className="border px-3 py-1">
                            Next &gt;&gt;
                        </button>
                        <button
                            onClick={() => {
                                if (confirm("Are you sure you want to submit?")) {
                                    // Clear all cookies
                                    document.cookie.split(";").forEach((cookie) => {
                                        document.cookie = cookie
                                            .replace(/^ +/, "")
                                            .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
                                    });
                                    // Redirect to home
                                    window.location.href = "/";
                                }
                            }}
                            className="ml-auto bg-green-600 text-white px-4 py-1"
                        >
                            Submit
                        </button>
                    </div>
                </div>

                {/* Right Section: Palette */}
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

                    <div className="grid grid-cols-8 gap-1 mt-4">
                        {questions.map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => goToQuestion(i + 1)}
                                className={`text-sm w-8 h-8 border text-white ${renderStatusColor(i + 1)}`}
                            >
                                {String(i + 1).padStart(2, "0")}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
