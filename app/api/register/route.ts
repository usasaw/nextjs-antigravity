import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user already exists
        const usersRef = db.ref('users');
        const snapshot = await usersRef.orderByChild('email').equalTo(email).once('value');

        if (snapshot.exists()) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();

        await usersRef.child(userId).set({
            id: userId,
            name,
            email,
            password: hashedPassword,
            created_at: new Date().toISOString()
        });

        return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
