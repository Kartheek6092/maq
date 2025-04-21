'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Assessment = {
    _id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
};

export default function AdminDashboard() {
    const [activeAssessments, setActiveAssessments] = useState<Assessment[]>([]);
    const [pastAssessments, setPastAssessments] = useState<Assessment[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const res = await fetch('/api/admin/assignments');
                const data = await res.json();
                console.log("data", res);

                if (data && data.length > 0) {
                    setActiveAssessments(data.active);
                    setPastAssessments(data.past);
                }
            } catch (error) {
                console.error('Failed to fetch assessments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssessments();
    }, []);

    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

    if (loading) return <div className="p-6 text-lg">Loading...</div>;

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <section>
                <h2 className="text-xl font-semibold mb-3">🟢 Active Assessments</h2>
                {activeAssessments?.length === 0 ? (
                    <p>No active assessments.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeAssessments?.map(a => (
                            <div key={a._id} className="p-4 border rounded-xl shadow-sm bg-white">
                                <h3 className="text-lg font-bold">{a.title}</h3>
                                <p className="text-sm text-gray-600">{a.description}</p>
                                <p className="text-sm mt-2">Start: {formatDate(a.startTime)}</p>
                                <p className="text-sm">End: {formatDate(a.endTime)}</p>
                                <button
                                    onClick={() => router.push(`/admin/assessment/${a._id}`)}
                                    className="mt-3 bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
                                >
                                    Review Results
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-3">📁 Past Assessments</h2>
                {pastAssessments?.length === 0 ? (
                    <p>No past assessments.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pastAssessments?.map(a => (
                            <div key={a._id} className="p-4 border rounded-xl shadow-sm bg-gray-100">
                                <h3 className="text-lg font-bold">{a.title}</h3>
                                <p className="text-sm text-gray-600">{a.description}</p>
                                <p className="text-sm mt-2">Start: {formatDate(a.startTime)}</p>
                                <p className="text-sm">End: {formatDate(a.endTime)}</p>
                                <button
                                    onClick={() => router.push(`/admin/assessment/${a._id}`)}
                                    className="mt-3 bg-gray-700 text-white px-4 py-1.5 rounded hover:bg-gray-800"
                                >
                                    Review Results
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
