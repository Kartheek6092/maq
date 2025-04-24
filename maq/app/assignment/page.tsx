"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";

type ResponseStatus =
    | "answered"
    | "review"
    | "review-answered"
    | "skipped"
    | "";
type Responses = {
    [questionNumber: number]: {
        selected: number | null;
        status: ResponseStatus;
    };
};

type Option = { text: string; image?: string };
type Question = {
    id: string;
    question: string;
    image?: string;
    options: Option[];
};

export default function MCQPage() {
    const [currentQuestion, setCurrentQuestion] = useState<number>(1);
    const [responses, setResponses] = useState<Responses>({});
    const [timeLeft, setTimeLeft] = useState<number>(120 * 60); // 120 minutes
    const [questions, setQuestions] = useState<Question[]>([]);
    const [assData, setAssData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    // const videoRef = useRef<HTMLVideoElement | null>(null);

    // useEffect(() => {
    //     let stream: MediaStream;

    //     const startCamera = async () => {
    //         try {
    //             stream = await navigator.mediaDevices.getUserMedia({ video: true });
    //             const videoElement = document.getElementById("webcam") as HTMLVideoElement;
    //             if (videoElement) {
    //                 videoElement.srcObject = stream;
    //                 videoElement.play();
    //             }
    //         } catch (err) {
    //             console.error("Error accessing webcam:", err);
    //         }
    //     };

    //     startCamera();

    //     // Cleanup on unmount
    //     return () => {
    //         if (stream) {
    //             stream.getTracks().forEach((track) => track.stop());
    //         }
    //     };
    // }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = sessionStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, []);

    useEffect(() => {
        const fetchAssignmentAndQuestions = async () => {
            try {
                const assignmentRes = await axios.get("/api/admin/assignments/latest");
                setAssData(assignmentRes.data);
                const questionIds = assignmentRes.data.questionIds;

                const questionsRes = await axios.post(
                    "/api/admin/questions/ass-questions",
                    { ids: questionIds }
                );
                const fetchedQuestions = questionsRes.data.map((q: any) => ({
                    id: q._id,
                    question: q.text,
                    image: q.image,
                    options: q.options.map((opt: any) => ({ text: opt.text, image: opt.image })),
                }));
                setQuestions(fetchedQuestions);
            } catch (error) {
                console.log("Error fetching assignment/questions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignmentAndQuestions();
    }, []);

    console.log(questions)

    useEffect(() => {
        if (!assData?.durationMinutes) return;

        const now = Date.now();
        const durationInMs = assData.durationMinutes * 60 * 1000;

        let storedEndTime = sessionStorage.getItem("examEndTime");

        if (!storedEndTime) {
            const newEndTime = now + durationInMs;
            sessionStorage.setItem("examEndTime", newEndTime.toString());
            storedEndTime = newEndTime.toString();
        }

        const endTime = parseInt(storedEndTime, 10);

        const interval = setInterval(() => {
            const currentTime = Date.now();
            const timeRemaining = Math.max(
                0,
                Math.floor((endTime - currentTime) / 1000)
            );

            setTimeLeft(timeRemaining);

            if (timeRemaining <= 0) {
                clearInterval(interval);
                alert("Time is up! Auto-submitting your test.");
                // You might want to trigger the submit logic here
            }
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
    const nextQuestion = () =>
        setCurrentQuestion((q) => Math.min(q + 1, questions.length));
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

    return (
        <div className="min-h-screen bg-white font-sans text-black">
            {/* Header */}
            <div className="bg-orange-500 text-white flex justify-between px-4 py-2 items-center">
                <div className="font-bold text-lg">CSIR II CHEMICAL SCIENCE</div>
                <div className="w-[200px] text-sm">
                    Candidate Name:{" "}
                    <span className="font-semibold">
                        {user ? user?.name : "[Your Name]"}
                    </span>
                    <br />
                    Remaining Time:{" "}
                    <span className="text-[#010101] font-bold">{formatTime()}</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row px-20 mt-4 gap-4">
                <div className="w-full md:w-2/3 border-r-2 pr-4 border-[#ccc]">
                    <div className="text-lg font-semibold mb-2">
                        Question {currentQuestion}:
                    </div>
                    <div className="mb-2">
                        {current?.question}
                        {current?.image && (
                            <img src={current.image} width={80} height={60} alt="question" className="max-w-full h-auto mt-2" />
                        )}
                    </div>

                    <div className="space-y-2 mb-6">
                        {current?.options?.map((option, idx) => (
                            <label key={idx} className="flex flex-row items-start space-y-1">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="option"
                                        value={idx}
                                        checked={responses[currentQuestion]?.selected === idx}
                                        onChange={() => handleOptionChange(idx)}
                                    />
                                    <span>{`${String.fromCharCode(65 + idx)}) ${option.text}`}</span>
                                </div>
                                {option.image && (
                                    <img src={option.image} width={60} height={40} alt={`option-${String.fromCharCode(65 + idx)}`} className="max-w-full h-auto ml-6" />
                                )}
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
                                            .replace(
                                                /=.*/,
                                                "=;expires=" + new Date(0).toUTCString() + ";path=/"
                                            );
                                    });
                                    // Redirect to home
                                    window.location.href = "/";
                                    // In a real scenario, you would also send the responses to the server here
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
                    {/* <div className="absolute top-20 right-10 z-50">
                        <video
                            ref={videoRef}
                            id="webcam"
                            autoPlay
                            muted
                            playsInline
                            className="w-40 h-28 border-2 border-black rounded-md"
                        />
                    </div> */}

                    <div className="space-y-1 text-sm mb-2">
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-gray-300 inline-block"></span> Not
                            Visited
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-red-500 inline-block"></span> Not
                            Answered
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-green-500 inline-block"></span>{" "}
                            Answered
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-purple-500 inline-block"></span>{" "}
                            Marked for Review
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-indigo-600 inline-block"></span>{" "}
                            Answered & Marked for Review
                        </div>
                    </div>

                    <div className="grid grid-cols-8 gap-1 mt-4">
                        {questions.map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => goToQuestion(i + 1)}
                                className={`text-sm w-8 h-8 border text-white ${renderStatusColor(
                                    i + 1
                                )}`}
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