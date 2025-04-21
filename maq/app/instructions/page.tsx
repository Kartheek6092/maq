"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function Instructions() {
    const [consentChecked, setConsentChecked] = useState(false);
    const router = useRouter();

    const handleProceed = async () => {
        if (!consentChecked) {
            alert("Please accept the instructions to proceed.");
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/api/user/update-consent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ assignmentConsent: true }),
            });

            if (res.ok) {
                router.push("/assignment"); // Navigate to exam page or next step
            } else {
                // console.log("Failed to update consent. Please try again.", res);

                alert("Failed to update consent. Please try again.");
            }
        } catch (error) {
            console.error("Error updating consent:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="w-screen h-screen px-10 bg-white text-black font-sans overflow-auto">
            <Head>
                <title>General Instructions - NTA</title>
            </Head>

            <div className="w-full min-h-screen bg-white text-black font-sans">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-3 border-b">
                    <div className="flex items-center gap-3">
                        {/* <img src="" alt="NTA" className="h-10" /> */}
                        <div>
                            <h1 className="text-xl font-bold text-blue-900">
                                [CONDUCTOR INSTITUTE]
                            </h1>
                            <p className="text-green-600 font-semibold text-sm">
                                Excellence in Assessment
                            </p>
                        </div>
                    </div>
                    <div className="text-sm text-right"></div>
                </div>

                <div className="bg-orange-500 text-white text-lg font-bold py-2 px-4">
                    GENERAL INSTRUCTIONS
                </div>

                {/* Body */}
                <div className="px-8 py-6 text-[15px]">
                    <div className="text-center font-bold text-lg mb-4">
                        Please read the instructions carefully
                    </div>

                    <div className="mb-6 leading-6">
                        <p className="font-bold">General Instructions:</p>
                        <ol className="list-decimal pl-5">
                            <li>
                                Total duration of CSIR - CHEMICAL SCIENCE is <b>120 min.</b>
                            </li>
                            <li>
                                The clock will be set at the server. The countdown timer in the
                                top right corner will show remaining time.
                            </li>
                            <li>
                                The Questions Palette will show the status of each question
                                using these symbols:
                                <ol className="list-decimal pl-5 mt-2">
                                    <li>
                                        <span className="inline-block w-4 h-4 border" /> You have
                                        not visited the question yet.
                                    </li>
                                    <li>
                                        <span className="inline-block w-4 h-4 bg-red-500" /> You
                                        have not answered the question.
                                    </li>
                                    <li>
                                        <span className="inline-block w-4 h-4 bg-green-500" /> You
                                        have answered the question.
                                    </li>
                                    <li>
                                        <span className="inline-block w-4 h-4 bg-purple-700" /> You
                                        marked it for review without answering.
                                    </li>
                                    <li>
                                        <span className="inline-block w-4 h-4 bg-purple-700 border-2 border-green-500" />{" "}
                                        Answered & marked for review – will be considered for
                                        evaluation.
                                    </li>
                                </ol>
                            </li>
                            <li>
                                Click “&gt;” or “&lt;” to toggle question palette visibility.
                            </li>
                            <li>Click on profile to change question language.</li>
                            <li>Use blue arrows to scroll to top/bottom instantly.</li>
                        </ol>
                    </div>

                    <div className="mb-6">
                        <p className="font-bold underline">Navigating to a Question:</p>
                        <ol className="list-decimal pl-5 leading-6">
                            <li>Click question number to go directly.</li>
                            <li>Use Save & Next to save and go to next.</li>
                            <li>Use Mark for Review & Next for flagging with saving.</li>
                        </ol>
                    </div>

                    <div className="mb-6">
                        <p className="font-bold underline">Answering a Question:</p>
                        <ol className="list-decimal pl-5 leading-6">
                            <li>Select by clicking an option.</li>
                            <li>Deselect by clicking again or “Clear Response”.</li>
                            <li>Change by selecting another option.</li>
                            <li>Use Save & Next to save your answer.</li>
                            <li>Use Mark for Review & Next to flag the question.</li>
                        </ol>
                    </div>

                    <div className="mb-6">
                        <p className="font-bold underline">Navigating through sections:</p>
                        <ol className="list-decimal pl-5 leading-6">
                            <li>Sections are shown at the top.</li>
                            <li>After finishing one section, you’ll go to the next.</li>
                            <li>You can shuffle freely during the test time.</li>
                            <li>Section summary is visible on each section header.</li>
                        </ol>
                    </div>

                    <p className="text-red-600 font-semibold text-sm mt-6 mb-2">
                        Please note all questions will appear in your default language. This
                        language can be changed later.
                    </p>

                    <div className="flex items-start mt-4">
                        <input
                            type="checkbox"
                            checked={consentChecked}
                            onChange={(e) => setConsentChecked(e.target.checked)}
                            className="mr-2 mt-1"
                        />
                        <p className="text-sm leading-6">
                            I have read and understood the instructions. I declare that I am
                            not in possession of or wearing any prohibited gadgets. In case of
                            violation, I agree to be debarred from this test and future exams.
                        </p>
                    </div>

                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleProceed}
                            className="bg-blue-600 text-white px-10 py-2 rounded font-semibold hover:bg-blue-700"
                        >
                            PROCEED
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <footer className="text-center text-xs text-gray-600 py-4">
                    © 2018 National Testing Agency
                </footer>
            </div>
        </div>
    );
}
