import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

export async function POST(req: Request) {
    const { username, password, accessKey } = await req.json();
    await connectDB();

    const user = await User.findOne({ email: username });

    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (accessKey) {
        if (accessKey !== user.accessKey) {
            return NextResponse.json({ message: 'Invalid access key' }, { status: 401 });
        }
    } else {
        if (password !== user.password) {
            return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
        }
    }

    const res = NextResponse.json({
        message: 'Login successful',
        role: user.role // Include the user's role in the response
    });
    res.cookies.set('session_token', 'mock-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hour
    });

    return res;
}
