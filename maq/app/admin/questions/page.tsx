'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type Option = { text: string; isCorrect: boolean };
type Question = {
    _id: string;
    text: string;
    options: Option[];
};

export default function AdminQuestions() {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState<Option[]>([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
    ]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchQuestions = async () => {
        const res = await axios.get('/api/admin/questions');
        setQuestions(res.data);
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleSubmit = async () => {
        if (!question.trim()) return alert('Question text cannot be empty');
        if (options.some((opt) => !opt.text.trim())) return alert('All options must be filled out');
        if (!options.some((opt) => opt.isCorrect)) return alert('Please select a correct option');

        await axios.post('/api/admin/questions', { text: question, options });
        setQuestion('');
        setOptions(options.map(() => ({ text: '', isCorrect: false })));
        fetchQuestions();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this question?')) return;

        await axios.delete('/api/admin/questions', { data: { id } });
        fetchQuestions();
    };

    const filteredQuestions = questions.filter((q) =>
        q.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='px-40 py-4 h-screen overflow-auto'>
            <h2 className="text-2xl font-bold mb-4">Manage MCQs</h2>

            <div className="mb-6 space-y-2">
                <input
                    type="text"
                    placeholder="Enter question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                {options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => {
                                const copy = [...options];
                                copy[i].text = e.target.value;
                                setOptions(copy);
                            }}
                            className="flex-1 p-2 border rounded"
                            placeholder={`Option ${i + 1}`}
                        />
                        <input
                            type="radio"
                            name="correct"
                            checked={opt.isCorrect}
                            onChange={() => {
                                const updated = options.map((o, idx) => ({
                                    ...o,
                                    isCorrect: idx === i,
                                }));
                                setOptions(updated);
                            }}
                        />
                        <label>Correct</label>
                    </div>
                ))}
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
                >
                    Add Question
                </button>
            </div>

            <hr className="my-6" />

            <h3 className="text-xl font-semibold mb-4">All Questions</h3>

            <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border rounded mb-4"
            />

            <ul className="space-y-4">
                {filteredQuestions.map((q) => (
                    <li key={q._id} className="p-4 rounded shadow shadow-amber-50">
                        <div className="flex justify-between items-center">
                            <strong>{q.text}</strong>
                            <button
                                onClick={() => handleDelete(q._id)}
                                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                        <ul className="mt-2 list-disc pl-5">
                            {q.options.map((opt, i) => (
                                <li
                                    key={i}
                                    className={opt.isCorrect ? 'text-green-600 font-semibold' : ''}
                                >
                                    {opt.text}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}
