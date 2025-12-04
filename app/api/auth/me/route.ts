import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.sub as string;

        const userRef = db.ref(`users/${userId}`);
        const snapshot = await userRef.once('value');

        if (!snapshot.exists()) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const user = snapshot.val();

        // Return only safe fields
        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
