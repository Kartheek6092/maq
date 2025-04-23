import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import AssignmentResult from '@/models/AssignmentResult';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const { assignmentId, userId, attemptedQuestions, correctQuestions, score } = body;

        if (!assignmentId || !userId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if results doc exists
        let resultDoc = await AssignmentResult.findOne({ assignmentId });

        if (!resultDoc) {
            // Create new document
            resultDoc = await AssignmentResult.create({
                assignmentId,
                results: [{ userId, attemptedQuestions, correctQuestions, score }]
            });
        } else {
            // Check if user already has a result
            const existingResultIndex = resultDoc.results.findIndex(r => r.userId.toString() === userId);

            if (existingResultIndex !== -1) {
                // Update existing result
                resultDoc.results[existingResultIndex] = {
                    userId,
                    attemptedQuestions,
                    correctQuestions,
                    score
                };
            } else {
                // Add new result
                resultDoc.results.push({
                    userId,
                    attemptedQuestions,
                    correctQuestions,
                    score
                });
            }

            await resultDoc.save();
        }

        return NextResponse.json({ message: 'Result saved successfully', result: resultDoc });
    } catch (err: any) {
        console.error('Error saving result:', err);
        return NextResponse.json({ error: 'Failed to save result', details: err.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const assignmentId = searchParams.get('assignmentId');

        if (!assignmentId) {
            return NextResponse.json({ error: 'Missing assignmentId in query' }, { status: 400 });
        }

        const resultDoc = await AssignmentResult.findOne({ assignmentId }).populate('results.userId', 'name email');

        if (!resultDoc) {
            return NextResponse.json({ message: 'No results found for this assignment' }, { status: 404 });
        }

        return NextResponse.json(resultDoc);
    } catch (err: any) {
        console.error('Error fetching results:', err);
        return NextResponse.json({ error: 'Failed to fetch results', details: err.message }, { status: 500 });
    }
}
