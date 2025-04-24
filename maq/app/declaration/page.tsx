'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function DeclarationPage() {
    const [assData, setAssData] = useState<any>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchLatestAssignment = async () => {
            try {
                const res = await axios.get('/api/admin/assignments/latest');
                if (res.data) {
                    console.log("Assignment fetched successfully", res.data);

                    setAssData(res.data)
                }
            } catch (err) {
                console.log('Error fetching latest assignment', err);
            }
        };

        fetchLatestAssignment();
    }, []);

    const handleAccept = () => {
        router.push('/assignment');
    };

    return (
        <div className="min-h-screen p-6 flex flex-col justify-center items-center">
            <div className="border p-8 rounded shadow-md w-full max-w-2xl flex flex-col">
                <h2 className="text-xl text-center font-bold mb-4">Declaration</h2>

                <div className="mb-6">
                    <p>{assData?.declarationContent}</p>
                </div>
                <button
                    onClick={handleAccept}
                    className="bg-green-600 self-center text-white px-6 py-2 rounded hover:bg-green-700"
                >
                    I Accept
                </button>
            </div>
        </div>
    );
}
