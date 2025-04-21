'use client';

import { useRouter } from 'next/navigation';

export default function DeclarationPage() {
    const router = useRouter();

    const handleAccept = () => {
        router.push('/instructions');
    };

    return (
        <div className="min-h-screen p-6 flex flex-col justify-center items-center">
            <div className="border p-8 rounded shadow-md w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4">Declaration</h2>
                <p className="mb-6">
                    I hereby declare that I am taking this test on my own and will not use any unfair means
                    or assistance from others. I agree to the terms and conditions of this examination.
                </p>
                <button
                    onClick={handleAccept}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                    I Accept
                </button>
            </div>
        </div>
    );
}
