import React from 'react';
import { LucideIcon } from 'lucide-react';
import RecentTemplateComponent from './RecentTemplateComponent';
import { IRecentTemplate } from '@/types';
import { MockRecentTemplates } from '@/mocks';
import { Button } from '../ui/button';
interface RecentTemplatesProps {

}

const RecentTemplates: React.FC<RecentTemplatesProps> = ({
}) => {
    return (
        <div className="">
            <div className='flex justify-between items-center'>
                <div className='text-xl font-medium text-slate-800 mb-4 mt-4'>
                    Recent Templates
                </div>
                <Button variant='ghost' className='text-gray-900 text-sm hover:bg-transparent hover:text-black'>
                    View All
                </Button>
            </div>
            <div className='flex overflow-x-auto gap-4 pb-4 hide-scrollbar'>
                {MockRecentTemplates.map((template) => (
                    <RecentTemplateComponent key={template.id} template={template} />
                ))}
            </div>
        </div>
    );
};

export default RecentTemplates;
