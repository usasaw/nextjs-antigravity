import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const usersRef = db.ref('users');
        const snapshot = await usersRef.orderByChild('email').equalTo(email).once('value');

        const userData = snapshot.val();
        const user = userData ? Object.values(userData)[0] : null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!user || !(await bcrypt.compare(password, (user as any).password))) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const typedUser = user as any;

        // Create JWT
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
        const token = await new SignJWT({ sub: typedUser.id, email: typedUser.email, name: typedUser.name })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(secret);

        const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });

        // Set HTTP-only cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 1 day
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
