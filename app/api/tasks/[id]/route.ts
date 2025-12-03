import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
        const { payload } = await jwtVerify(token, secret);
        return payload.sub;
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

        const updates = [];
        const values = [];

        if (is_completed !== undefined) {
            updates.push('is_completed = ?');
            values.push(is_completed);
        }
        if (is_important !== undefined) {
            updates.push('is_important = ?');
            values.push(is_important);
        }

        if (updates.length === 0) {
            return NextResponse.json({ message: 'No updates' });
        }

        values.push(id, userId);

        await pool.execute(
            `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
            values
        );

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

        await pool.execute(
            'DELETE FROM tasks WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        return NextResponse.json({ message: 'Task deleted' });
    } catch (error) {
        console.error('Error deleting task:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
