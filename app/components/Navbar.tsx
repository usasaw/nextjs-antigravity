import Link from 'next/link';
import { Menu } from 'lucide-react';
import { cookies } from 'next/headers';

export default async function Navbar() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const isLoggedIn = !!token;

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
                {isLoggedIn && (
                    <Link href="/dashboard" className="text-primary-green font-semibold hover:text-dark-green transition-colors">
                        Dashboard
                    </Link>
                )}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
                {isLoggedIn ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">Welcome back</span>
                        {/* We can add a Sign Out button here later if needed, or rely on the Dashboard's sign out */}
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
