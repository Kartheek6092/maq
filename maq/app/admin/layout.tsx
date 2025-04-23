'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import renderIcons from '@/utils/renderIcons';

type IconName =
    | 'AiOutlineDashboard'
    | 'AiOutlineUser'
    | 'AiOutlineQuestionCircle'
    | 'AiOutlineAssignment'
    | 'LiaQuestionSolid'
    | 'FaComputer'
    | 'PiUsersThreeFill';

const navOptions: { name: string; href: string; icon: IconName }[] = [
    { name: 'Dashboard', href: '/admin', icon: 'AiOutlineDashboard' },
    { name: 'MCQs', href: '/admin/questions', icon: 'LiaQuestionSolid' },
    { name: 'Users', href: '/admin/users', icon: 'PiUsersThreeFill' },
    { name: 'Assignments', href: '/admin/assignments', icon: 'FaComputer' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex w-full min-h-screen m-0 p-0">
            <aside className="w-[15vw] bg-gray-800 p-4 space-y-4">
                <h2 className="text-xl font-bold mb-6 text-white">Admin Panel</h2>
                <nav className="space-y-2 flex flex-col gap-4 w-full">
                    {navOptions.map((option) => {
                        const isActive = pathname === option.href;
                        return (
                            <Link key={option.name} href={option.href} className="block w-full">
                                <span
                                    className={`flex items-center gap-4 rounded w-full py-2 px-4 font-semibold text-sm transition-colors ${isActive
                                            ? 'bg-white text-purple-700'
                                            : 'text-white hover:bg-white hover:text-black'
                                        }`}
                                >
                                    {renderIcons(option.icon, 20, 'inherit')}
                                    {option.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
            <main className="flex-1 p-0 w-[85vw] h-full">{children}</main>
        </div>
    );
}
