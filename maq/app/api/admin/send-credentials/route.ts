import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
    try {
        const { email, name, password } = await req.json();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"Admin" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Your account credentials',
            html: `
                <h3>Hello ${name || 'User'},</h3>
                <p>Your account has been created. Here are your credentials:</p>
                <ul>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Password:</strong> ${password}</li>
                </ul>
                <p>Please login and change your password after first login.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: 'Email sent' });
    } catch (error) {
        console.log('Error sending email:', error);
        return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
    }
}
