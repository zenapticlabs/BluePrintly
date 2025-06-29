import React, { useState } from 'react';
import { Dot, LucideIcon, Edit, Trash2, CheckSquare, Eye } from 'lucide-react';
import { RecentProposal } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Checkbox } from '../ui/checkbox';

interface RecentProposalComponentProps {
    proposal: RecentProposal;
    onEdit?: (id: string) => void;
    onShow?: (id: string) => void;
    onDelete?: (id: string) => void;
    onSelect?: (id: string, selected: boolean) => void;
}

const RecentProposalComponent: React.FC<RecentProposalComponentProps> = ({
    proposal,
    onEdit,
    onShow,
    onDelete,
    onSelect
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isSelected, setIsSelected] = useState(false);

    const getRelativeTime = (date: string | Date) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    const handleEdit = () => {
        onEdit?.(proposal.id);
    };

    const handleShow = () => {
        onShow?.(proposal.id);
    };

    const handleDelete = () => {
        onDelete?.(proposal.id);
    };

    const handleSelect = () => {
        const newSelectedState = !isSelected;
        setIsSelected(newSelectedState);
        onSelect?.(proposal.id, newSelectedState);
    };

    return (
        <div
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className='w-[250px] h-[320px] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative'>
                {/* Checkbox */}
                <div className={`absolute z-20 top-4 left-4 transition-opacity ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}`}>
                    <Checkbox
                        className='bg-white'
                        checked={isSelected}
                        onCheckedChange={handleSelect}
                    />
                </div>

                {/* Centered action buttons */}
                <div
                    className={`absolute inset-0 flex items-center justify-center gap-3 bg-slate-900/20 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                >
                    <button
                        onClick={handleShow}
                        className="p-2 bg-white hover:bg-white rounded-lg text-slate-600 shadow-lg transition-transform w-10 h-10 flex items-center justify-center cursor-pointer"
                        title="Show"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleEdit}
                        className="p-2 bg-white hover:bg-white rounded-lg text-slate-600 shadow-lg transition-transform w-10 h-10 flex items-center justify-center cursor-pointer"
                        title="Edit"
                    >
                        <Edit className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 bg-white hover:bg-white rounded-lg text-red-500 shadow-lg transition-transform w-10 h-10 flex items-center justify-center cursor-pointer"
                        title="Delete"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div className='p-4'>
                <div className='text-base font-semibold text-slate-800'>{proposal.title}</div>
                <div className='text-sm text-slate-600 flex items-center gap-1'>
                    <span>{proposal.tag}</span>
                    <span className='w-2 h-2 bg-slate-200 rounded-full mx-0.5'></span>
                    <span>Updated {getRelativeTime(proposal.updatedAt)}</span>
                </div>
            </div>
        </div>
    );
};

export default RecentProposalComponent;
