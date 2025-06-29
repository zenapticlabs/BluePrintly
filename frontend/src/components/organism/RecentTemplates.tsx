import React from 'react';
import { LucideIcon } from 'lucide-react';
import RecentTemplateComponent from './RecentTemplateComponent';
import { IRecentTemplate } from '@/types';
import { MockRecentTemplates } from '@/mocks';
import { Button } from '../ui/button';
import Link from 'next/link';

interface RecentTemplatesProps {
    viewMode: 'grid' | 'list';
}

const RecentTemplates: React.FC<RecentTemplatesProps> = ({
    viewMode
}) => {
    return (
        <div className="max-w-full w-full">
            <div className='flex justify-between items-center'>
                <div className='text-xl font-medium text-slate-800 mb-4 mt-4'>
                    Recent Templates
                </div>
                <Link href="/templates" className='text-gray-900 text-sm hover:bg-transparent hover:text-black'>
                    View All
                </Link>
            </div>
            <div className={`${
                viewMode === 'grid' 
                    ? 'flex overflow-x-auto gap-4 pb-4' 
                    : 'flex flex-col gap-4'
            } max-w-full w-full`}>
                {MockRecentTemplates.map((template) => (
                    <RecentTemplateComponent 
                        key={template.id} 
                        template={template} 
                        viewMode={viewMode}
                    />
                ))}
            </div>
        </div>
    );
};

export default RecentTemplates;
