"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    CheckCircle2,
    Plus,
    Search,
    LayoutDashboard,
    Star,
    LogOut,
    User
} from 'lucide-react';
import { auth, database } from '../firebaseConfig';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { ref, onValue, push, update, remove, set } from 'firebase/database';

type Task = {
    id: string;
    title: string;
    is_completed: boolean;
    is_important: boolean;
    created_at: string;
    user_id: string;
};

export default function Dashboard() {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [newTask, setNewTask] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<'all' | 'important' | 'completed'>('all');
    const [loading, setLoading] = useState(true);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Listen for tasks
                const tasksRef = ref(database, 'tasks');
                onValue(tasksRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        const taskList = Object.values(data) as Task[];
                        // Filter by user_id matching current user.
                        const userTasks = taskList.filter((t) => t.user_id === currentUser.uid);

                        // Sort by created_at DESC
                        userTasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                        setTasks(userTasks);
                    } else {
                        setTasks([]);
                    }
                    setLoading(false);
                });
            } else {
                router.push('/signin');
            }
        });

        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/signin');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const getInitials = (name: string | null) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim() || !user) return;

        try {
            const tasksRef = ref(database, 'tasks');
            const newTaskRef = push(tasksRef);
            await set(newTaskRef, {
                id: newTaskRef.key,
                user_id: user.uid,
                title: newTask,
                is_completed: false,
                is_important: false,
                created_at: new Date().toISOString()
            });
            setNewTask("");
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const toggleTask = async (id: string, currentStatus: boolean) => {
        try {
            const taskRef = ref(database, `tasks/${id}`);
            await update(taskRef, { is_completed: !currentStatus });
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const toggleImportant = async (id: string, currentStatus: boolean) => {
        try {
            const taskRef = ref(database, `tasks/${id}`);
            await update(taskRef, { is_important: !currentStatus });
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const deleteTask = async (id: string) => {
        try {
            const taskRef = ref(database, `tasks/${id}`);
            await remove(taskRef);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const filteredTasks = tasks.filter(t => {
        if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
        if (filter === 'important') return t.is_important;
        if (filter === 'completed') return t.is_completed;
        return true;
    });

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6">
                    <Link href="/" className="text-2xl font-serif font-bold text-dark-green">
                        Plan List
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <button
                        onClick={() => setFilter('all')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-primary-green/10 text-primary-green' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        My Plans
                    </button>
                    <button
                        onClick={() => setFilter('important')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${filter === 'important' ? 'bg-primary-green/10 text-primary-green' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Star className="w-5 h-5" />
                        Important
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${filter === 'completed' ? 'bg-primary-green/10 text-primary-green' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        Completed
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors w-full text-left"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                    <h1 className="text-xl font-serif text-dark-green">
                        {filter === 'all' ? 'My Plans' : filter === 'important' ? 'Important Tasks' : 'Completed Tasks'}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search tasks..."
                                className="pl-10 pr-4 py-2 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/50 w-64"
                            />
                        </div>

                        {/* User Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="w-8 h-8 rounded-full bg-primary-green text-white flex items-center justify-center text-sm font-medium hover:bg-dark-green transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green"
                            >
                                {user ? getInitials(user.displayName) : <User className="w-4 h-4" />}
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">{user?.displayName}</p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Task List */}
                <div className="flex-1 p-6 overflow-auto">
                    <div className="max-w-3xl mx-auto">
                        {/* Add Task Input */}
                        <form onSubmit={addTask} className="mb-8">
                            <div className="relative">
                                <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    placeholder="Add a new task..."
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white shadow-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-green/50 text-gray-700"
                                />
                            </div>
                        </form>

                        {/* Tasks */}
                        <div className="space-y-3">
                            {filteredTasks.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <p>No tasks found.</p>
                                </div>
                            ) : (
                                filteredTasks.map(task => (
                                    <div
                                        key={task.id}
                                        className={`group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md ${task.is_completed ? 'opacity-60' : ''}`}
                                    >
                                        <button
                                            onClick={() => toggleTask(task.id, task.is_completed)}
                                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.is_completed ? 'bg-primary-green border-primary-green text-white' : 'border-gray-300 hover:border-primary-green'}`}
                                        >
                                            {task.is_completed && <CheckCircle2 className="w-4 h-4" />}
                                        </button>

                                        <span className={`flex-1 text-gray-700 ${task.is_completed ? 'line-through' : ''}`}>
                                            {task.title}
                                        </span>

                                        <button
                                            onClick={() => toggleImportant(task.id, task.is_important)}
                                            className={`p-2 rounded-full transition-colors ${task.is_important ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'}`}
                                        >
                                            <Star className={`w-5 h-5 ${task.is_important ? 'fill-current' : ''}`} />
                                        </button>

                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Plus className="w-5 h-5 rotate-45" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
