import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full py-12 px-6 md:px-12 bg-background border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <Link href="/" className="text-2xl font-serif font-bold text-dark-green">
                        Plan List
                    </Link>
                    <p className="text-sm text-gray-500 mt-2">
                        &copy; {new Date().getFullYear()} Plan List. All rights reserved.
                    </p>
                </div>

                <div className="flex gap-8 text-sm text-gray-600">
                    <Link href="#" className="hover:text-primary-green">Privacy</Link>
                    <Link href="#" className="hover:text-primary-green">Terms</Link>
                    <Link href="#" className="hover:text-primary-green">Contact</Link>
                </div>
            </div>
        </footer>
    );
}
