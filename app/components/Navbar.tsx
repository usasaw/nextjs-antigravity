"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, User, LogOut, LayoutDashboard } from 'lucide-react';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setShowProfileMenu(false);
            router.push('/');
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

    return (
        <nav className="w-full py-6 px-6 md:px-12 flex items-center justify-between bg-transparent relative z-50">
            <div className="flex items-center gap-2">
                {/* Logo Placeholder - Text based for now */}
                <Link href="/" className="text-2xl font-serif font-bold text-dark-green tracking-tight">
                    Plan List
                </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                <Link href="#" className="hover:text-primary-green transition-colors">Overview</Link>
                <Link href="#" className="hover:text-primary-green transition-colors">Features</Link>
                <Link href="#" className="hover:text-primary-green transition-colors">Pricing</Link>
                <Link href="#" className="hover:text-primary-green transition-colors">About</Link>
                {user && (
                    <Link href="/dashboard" className="text-primary-green font-semibold hover:text-dark-green transition-colors">
                        Dashboard
                    </Link>
                )}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
                {user ? (
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="w-10 h-10 rounded-full bg-primary-green text-white flex items-center justify-center text-sm font-medium hover:bg-dark-green transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green"
                        >
                            {getInitials(user.displayName)}
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900 truncate">{user.displayName || 'User'}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                                <Link
                                    href="/dashboard"
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    onClick={() => setShowProfileMenu(false)}
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Link>
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
                ) : (
                    <>
                        <Link href="/signin" className="text-sm font-medium text-dark-green hover:text-primary-green transition-colors">
                            Sign in
                        </Link>
                        <Link
                            href="/signup"
                            className="px-5 py-2.5 bg-primary-green text-white text-sm font-medium rounded-full hover:bg-dark-green transition-colors shadow-sm"
                        >
                            Sign up
                        </Link>
                    </>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-dark-green">
                <Menu className="w-6 h-6" />
            </button>
        </nav>
    );
}
