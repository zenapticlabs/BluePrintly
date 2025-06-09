import React, { useState } from 'react';
import { Dot, LucideIcon, Edit, Trash2, CheckSquare, Eye } from 'lucide-react';
import { IRecentTemplate, RecentProposal } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Checkbox } from '../ui/checkbox';
import { useRouter } from 'next/navigation';

interface RecentTemplateComponentProps {
    template: IRecentTemplate;
    viewMode: 'grid' | 'list';
    onEdit?: (id: string) => void;
    onShow?: (id: string) => void;
    onSelect?: (id: string, selected: boolean) => void;
}

const RecentTemplateComponent: React.FC<RecentTemplateComponentProps> = ({
    template,
    viewMode,
    onEdit,
    onShow,
    onSelect
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const router = useRouter();

    const getRelativeTime = (date: string | Date) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    const handleEdit = () => {
        onEdit?.(template.id);
    };

    const handleShow = () => {
        router.push(`/templates/view?id=${template.id}`);
    };

    const handleSelect = () => {
        const newSelectedState = !isSelected;
        setIsSelected(newSelectedState);
        onSelect?.(template.id, newSelectedState);
    };

    if (viewMode === 'list') {
        return (
            <div
                className="relative group w-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className='flex items-center p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors'>
                    {/* Checkbox */}
                    <div className='mr-4'>
                        <Checkbox
                            className='bg-white'
                            checked={isSelected}
                            onCheckedChange={handleSelect}
                        />
                    </div>

                    {/* Content */}
                    <div className='flex-grow'>
                        <div className='text-base font-semibold text-slate-800'>{template.title}</div>
                    </div>

                    {/* Actions */}
                    <div className='flex gap-2'>
                        <button
                            onClick={handleShow}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                            title="Show"
                        >
                            <Eye className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleEdit}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                            title="Edit"
                        >
                            <Edit className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                </div>
            </div>
            <div className='p-4'>
                <div className='text-base font-semibold text-slate-800'>{template.title}</div>
            </div>
        </div>
    );
};

export default RecentTemplateComponent;
