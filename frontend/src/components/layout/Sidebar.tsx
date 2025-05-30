'use client';

import { Home, FileText, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const sidebarItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: FileText, label: "Templates", href: "/templates" },
    { icon: FileText, label: "Proposals", href: "/proposals" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-[300px] h-screen bg-white border-r border-input flex flex-col">
            <div className="p-3">
                <div className="text-3xl font-bold text-center py-4">Blue <span className="text-primary">Printly</span></div>
                <nav className="space-y-2">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center text-sm gap-3 px-3 h-10 rounded-md transition-colors ${pathname === item.href
                                    ? "bg-primary text-white"
                                    : "text-gray-700 hover:bg-primary-50 hover:text-primary"
                                }`}
                        >
                            <item.icon className="w-6 h-6" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
} 