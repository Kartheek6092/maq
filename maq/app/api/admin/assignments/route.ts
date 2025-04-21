import { connectDB } from '@/lib/db';
import Assignment from '@/models/Assignment';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        console.log('Incoming assignment data:', data);

        await connectDB();

        // Optional: validate questionIds are string/ObjectId
        if (!Array.isArray(data.questionIds) || !data.questionIds.every(id => typeof id === 'string')) {
            return NextResponse.json({ error: 'Invalid questionIds format' }, { status: 400 });
        }

        const assignment = await Assignment.create(data);
        return NextResponse.json(assignment);
    } catch (err: any) {
        console.error('Error creating assignment:', err);
        return NextResponse.json({ error: 'Failed to create assignment', details: err.message }, { status: 500 });
    }
}


export async function GET() {
    await connectDB();
    const assignments = await Assignment.find().populate('questionIds');
    return NextResponse.json(assignments);
}
