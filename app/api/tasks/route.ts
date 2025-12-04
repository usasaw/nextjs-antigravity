import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
        const { payload } = await jwtVerify(token, secret);
        return payload.sub as string;
    } catch {
        return null;
    }
}

export async function GET(request: Request) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';

        const tasksRef = db.ref('tasks');
        const snapshot = await tasksRef.orderByChild('user_id').equalTo(userId).once('value');

        const tasksData = snapshot.val();
        let tasks = tasksData ? Object.values(tasksData) : [];

        // Sort by created_at DESC
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tasks.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        if (search) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tasks = tasks.filter((task: any) => task.title.toLowerCase().includes(search.toLowerCase()));
        }

        return NextResponse.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title } = await request.json();
        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const taskId = uuidv4();
        const tasksRef = db.ref('tasks');

        await tasksRef.child(taskId).set({
            id: taskId,
            user_id: userId,
            title,
            is_completed: false,
            is_important: false,
            created_at: new Date().toISOString()
        });

        return NextResponse.json({ message: 'Task created' }, { status: 201 });
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
