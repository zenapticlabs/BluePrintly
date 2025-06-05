import { X } from 'lucide-react';
import React from 'react';

interface ThemeSelectorProps {
    open: boolean;
    onClose: () => void;
}

const themes = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
]

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
    open,
    onClose
}) => {

    return (
        <div className={`w-[300px] border border-input rounded-lg flex flex-col h-full ${open ? 'block' : 'hidden'}`}>
            <div className='p-4 border-b border-input text-lg text-foreground font-semibold flex items-center justify-between'>
                <span>Theme</span>
                <div className='text-sm text-slate-800 cursor-pointer hover:text-slate-900'>
                    <X className='w-4 h-4' onClick={onClose} />
                </div>
            </div>
            <div className='p-4 flex flex-wrap gap-4 flex-1 overflow-y-auto'>
                {
                    themes.map((theme) => (
                        <div key={theme} className='w-[260px] h-[370px] border border-input rounded-lg flex items-center justify-center text-4xl '>{theme}</div>
                    ))
                }
            </div>
        </div>
    );
};

export default ThemeSelector;
