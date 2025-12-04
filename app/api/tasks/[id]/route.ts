import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { is_completed, is_important } = await request.json();

        const taskRef = db.ref(`tasks/${id}`);
        const snapshot = await taskRef.once('value');

        if (!snapshot.exists()) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        const task = snapshot.val();
        if (task.user_id !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updates: any = {};
        if (is_completed !== undefined) updates.is_completed = is_completed;
        if (is_important !== undefined) updates.is_important = is_important;

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ message: 'No updates' });
        }

        await taskRef.update(updates);

        return NextResponse.json({ message: 'Task updated' });
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const taskRef = db.ref(`tasks/${id}`);
        const snapshot = await taskRef.once('value');

        if (!snapshot.exists()) {
            return NextResponse.json({ message: 'Task deleted' }); // Idempotent
        }

        const task = snapshot.val();
        if (task.user_id !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await taskRef.remove();

        return NextResponse.json({ message: 'Task deleted' });
    } catch (error) {
        console.error('Error deleting task:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
