import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuiteComponentProps {
    icon: LucideIcon;
    title: string;
    amount: string;
    description: string;
    clicked: boolean;
    onClick: () => void;
}

const SuiteComponent: React.FC<SuiteComponentProps> = ({
    icon: Icon,
    title,
    amount,
    description,
    clicked,
    onClick
}) => {
    return (
        <div
            className={cn(`flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all duration-300 px-8 py-10 border-slate-200 border bg-white rounded-lg w-full max-w-[260px]`, clicked ? 'border-primary' : '')}
            onClick={onClick}
        >
            <Icon className="w-18 h-18 text-primary" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center mt-8">
                {title}
            </h3>
            <p className="text-xs text-slate-600 mb-3">
                {amount} pages
            </p>
            <p className="text-sm text-slate-800 text-center">
                {description}
            </p>
        </div>
    );
};

export default SuiteComponent;
