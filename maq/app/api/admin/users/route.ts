// app/api/admin/users/route.ts

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

// GET /api/admin/users
export async function GET() {
    await connectDB();

    try {
        const users = await User.find(
            { role: { $ne: 'admin' } }, // Exclude users with role 'admin'
            'email name role createdAt password'
        ).sort({ createdAt: -1 });

        return NextResponse.json(users);
    } catch (error) {
        console.error('GET /users error:', error);
        return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 });
    }
}


// POST /api/admin/users
export async function POST(req: Request) {
    await connectDB();

    try {
        const body = await req.json();
        const { email, name, password } = body;

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return NextResponse.json({ message: 'User already exists with this email' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email: email.toLowerCase(),
            name,
            password: hashedPassword,
        });

        return NextResponse.json(
            {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                createdAt: newUser.createdAt,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('POST /users error:', error);
        return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
    }
}

// DELETE /api/admin/users
export async function DELETE(req: Request) {
    await connectDB();

    try {
        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('DELETE /users error:', error);
        return NextResponse.json({ message: 'Failed to delete user' }, { status: 500 });
    }
}
