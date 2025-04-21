'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function RegisterPage() {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [form, setForm] = useState({
        assignmentId: '',
        name: '',
        email: '',
        passwordOrKey: '',
    });

    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('/api/admin/assignments').then((res) => setAssignments(res.data));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post('/api/register', form);
            setMessage('Registration successful! You may now login.');
            setForm({ assignmentId: '', name: '', email: '', passwordOrKey: '' });
        } catch (err: any) {
            setMessage(err.response?.data?.error || 'Something went wrong!');
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Register for Assignment</h1>

            <select
                name="assignmentId"
                value={form.assignmentId}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded"
            >
                <option value="">Select Assignment</option>
                {assignments.map((a) => (
                    <option key={a._id} value={a._id}>
                        {a.title}
                    </option>
                ))}
            </select>

            <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded"
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded"
            />
            <input
                type="text"
                name="passwordOrKey"
                placeholder="Access Key or Password"
                value={form.passwordOrKey}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded"
            />

            <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
                Register
            </button>

            {message && <p className="mt-4 text-sm text-center text-green-700">{message}</p>}
        </div>
    );
}
