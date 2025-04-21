import Link from 'next/link';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex w-full min-h-screen m-0 p-0 ">
            <aside className="w-[15vw] bg-gray-800 p-4 space-y-4">
                <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
                <nav className="space-y-2">
                    <Link href="/admin" className="block hover:underline">
                        Dashboard
                    </Link>
                    <Link href="/admin/questions" className="block hover:underline">
                        MCQs
                    </Link>
                    <Link href="/admin/assignments" className="block hover:underline">
                        Assignments
                    </Link>
                    <Link href="/admin/users" className="block hover:underline">
                        Users
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 p-0 w-[85vw] h-full ">{children}</main>
        </div>
    );
}
