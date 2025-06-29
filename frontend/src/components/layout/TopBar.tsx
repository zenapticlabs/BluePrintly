'use client';
import { AlignLeft, Bell, Menu } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useSidebar } from "@/contexts/SidebarContext";

export function TopBar() {
    const { toggleSidebar } = useSidebar();

    return (
        <div className="h-16 border-b bg-white flex items-center justify-between px-4">
            <button onClick={toggleSidebar} className="text-slate-800 cursor-pointer">
                <AlignLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>

                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary overflow-hidden text-white flex items-center justify-center text-xl font-bold">
                        H
                    </div>
                    <span className="text-sm font-medium">Hadeed U.</span>
                </div>
            </div>
        </div>
    );
} 