'use client';

import { Home, FileText, Settings, AlignHorizontalDistributeCenter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

const sidebarItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: AlignHorizontalDistributeCenter, label: "Templates", href: "/templates" },
    { icon: FileText, label: "Proposals", href: "/proposals" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const { isCollapsed } = useSidebar();

    return (
        <div className={cn(
            "h-screen bg-white border-r border-input flex flex-col transition-all duration-300",
            isCollapsed ? "w-[75px]" : "w-[300px]"
        )}>
            <div className="p-3">
                <div className={cn(
                    "font-bold text-center py-4 transition-all duration-300",
                    isCollapsed ? "text-xl" : "text-3xl"
                )}>
                    {isCollapsed ? <span className="text-3xl font-semibold"><span className="text-slate-800">B</span><span className="text-primary">P</span></span> : <>Blue <span className="text-primary">Printly</span></>}
                </div>
                <nav className="space-y-2">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center text-sm gap-3 px-3 h-10 rounded-md transition-colors",
                                pathname === item.href
                                    ? "bg-primary text-white"
                                    : "text-gray-700 hover:bg-primary-50 hover:text-primary",
                                isCollapsed && "justify-center"
                            )}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <item.icon className="w-5 h-5" />
                            {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
} 