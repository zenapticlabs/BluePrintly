import { List, X } from 'lucide-react';
import React from 'react';

interface SectionsOrderProps {
    open: boolean;
    onClose: () => void;
}

const sections = [
    'header/Contact Info',
    'Sub Header',
    'Greatings'
]

const SectionsOrder: React.FC<SectionsOrderProps> = ({
    open,
    onClose
}) => {

    return (
        <div className={`w-[300px] border border-input rounded-lg ${open ? 'block' : 'hidden'}`}>
            <div className='p-4 border-b border-input text-lg text-foreground font-semibold flex items-center justify-between'>
                <span>Sections Order</span>
                <div className='text-sm text-slate-800 cursor-pointer hover:text-slate-900'>
                    <X className='w-4 h-4' onClick={onClose} />
                </div>
            </div>
            <div className='p-6 flex flex-col gap-6'>
                {
                    sections.map((section) => (
                        <div key={section} className='flex items-center gap-2 text-sm text-slate-800'>
                            <List className='w-4 h-4 text-slate-500' />
                            {section}
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default SectionsOrder;
