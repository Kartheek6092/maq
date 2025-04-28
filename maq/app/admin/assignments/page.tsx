'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdDeleteOutline } from "react-icons/md";
import Link from 'next/link';

interface Assignment {
    _id: string;
    title: string;
    description?: string;
    startTime: string;
    durationMinutes: number;
}

export default function AssignmentsPage() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState<String>('');
    const router = useRouter();

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await fetch('/api/admin/assignments');
                const data = await res.json();
                setAssignments(data);
            } catch (err) {
                console.log('Failed to fetch assignments', err);
            }
        };

        fetchAssignments();
    }, []);

    const handleClick = (id: string) => {
        router.push(`/admin/assignments/${id}`);
    };

    const handleDeleteOnModal = async () => {
        try {
            const res = await fetch(`/api/admin/assignments/${deletingId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setAssignments((prev) => prev.filter((assignment) => assignment._id !== deletingId));
            } else {
                console.error('Failed to delete assignment');
            }
        } catch (err) {
            console.error('Error deleting assignment', err);
        } finally {
            setShowDeleteModal(false);
        }
    }

    const handleDelete = async (id: string) => {
        setShowDeleteModal(true);
        setDeletingId(id)
    };

    return (
        <div className=" w-full h-[94vh] overflow-auto flex flex-col gap-4 py-6 px-40">
            <h2 className="text-2xl font-semibold mb-4 flex justify-between items-center">
                Assignments{" "}
                <Link href="/admin/assignments/create">
                    <span className="bg-green-100 text-lg text-green-500 border border-green-500 border-dashed hover:border-green-700 px-4 py-2 rounded">
                        Create New +
                    </span>
                </Link>{" "}
            </h2>
            {assignments.length === 0 ? (
                <p>No assignments found.</p>
            ) : (
                <ul className="space-y-3">
                    {assignments.map((assignment) => (
                        <li
                            key={assignment._id}
                            className="p-4 border flex justify-between border-gray-300 rounded-lg shadow hover:bg-gray-50 hover:text-black"
                        >
                            <div onClick={() => handleClick(assignment._id)} className="cursor-pointer">
                                <h3 className="text-xl font-medium">{assignment.title}</h3>
                                <p className="text-gray-600">{assignment.description}</p>
                                <p className="text-sm text-gray-500">
                                    Starts: {new Date(assignment.startTime).toLocaleString()} |
                                    Duration: {assignment.durationMinutes} mins
                                </p>
                            </div>
                            <button
                                type="button"
                                title="Delete Assignment"
                                onClick={() => handleDelete(assignment._id)}
                                className="relative h-fit text-black cursor-pointer hover:bg-red-500 hover:text-[#fff] p-1 rounded-md"
                            >
                                <MdDeleteOutline size={15} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {showDeleteModal
                && (<div className="fixed inset-0 bg-[#00000067] bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 shadow-md">
                        <p>Are you sure you want to delete this assignment?</p>
                        <div className=' flex justify-between items-center'>
                            <button
                                onClick={handleDeleteOnModal}
                                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
                                Yes
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="mt-4 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md">
                                No
                            </button>
                        </div>
                    </div>
                </div>)
            }
        </div>
    );
}
