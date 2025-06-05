import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ProposalComponentProps {
    title?: string;
    icon: LucideIcon;
}

const ProposalComponent: React.FC<ProposalComponentProps> = ({
    title = "Add header for client readability",
    icon: Icon
}) => {
    return (
        <div className="flex items-center gap-4 p-3 rounded-lg border border-input">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-base font-normal text-gray-900">{title}</h2>
        </div>
    );
};

export default ProposalComponent;
