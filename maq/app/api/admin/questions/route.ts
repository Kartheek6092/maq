import { connectDB } from '@/lib/db';
import Question from '@/models/Question';
import { NextResponse } from 'next/server';

export async function GET() {
    await connectDB();
    const questions = await Question.find().sort({ createdAt: -1 });
    return NextResponse.json(questions);
}

export async function POST(req: Request) {
    const data = await req.json();
    await connectDB();
    const question = await Question.create(data);
    return NextResponse.json(question);
}

export async function DELETE(req: Request) {
    const { id } = await req.json();
    await connectDB();
    const deletedQuestion = await Question.findByIdAndDelete(id);
    if (!deletedQuestion) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Question deleted successfully' });
}
