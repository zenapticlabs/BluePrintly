'use client';

import React from 'react';
import { LayoutList, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewToggleProps {
    view: 'list' | 'grid';
    onChange: (view: 'list' | 'grid') => void;
    className?: string;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
    view,
    onChange,
    className
}) => {
    return (
        <div className={cn(
            "flex items-center shadow-sm rounded my-0.5 h-10",
            className
        )}>
            <button
                onClick={() => onChange('list')}
                className={cn(
                    "w-10 h-10 p-2 transition-colors cursor-pointer flex items-center justify-center",
                    view === 'list' ? "bg-primary-50 text-primary-500" : "text-slate-500 hover:text-slate-900"
                )}
                aria-label="List view"
            >
                <LayoutList className="w-4 h-4" />
            </button>
            <button
                onClick={() => onChange('grid')}
                className={cn(
                    "w-10 h-10 p-2 transition-colors cursor-pointer flex items-center justify-center",
                    view === 'grid' ? "bg-primary-50 text-primary-500" : "text-slate-500 hover:text-slate-900"
                )}
                aria-label="Grid view"
            >
                <LayoutGrid className="w-4 h-4" />
            </button>
        </div>
    );
};

export default ViewToggle; 