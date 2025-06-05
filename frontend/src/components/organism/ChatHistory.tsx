import { IChat } from '@/types';
import { ThumbsDown, ThumbsUp, X } from 'lucide-react';
import React from 'react';

interface ChatHistoryProps {
    open: boolean;
    onClose: () => void;
}

const chats: IChat[] = [
    {
        id: 1,
        role: 'user',
        content: 'Please add a basic draft for finance proposal',
        timeStamp: new Date('2024-03-20T11:41:00')
    },
    {
        id: 2,
        role: 'assistant',
        content: 'Absolutely! here it is. I have written a finance proposal for you.',
        timeStamp: new Date('2024-03-20T11:41:00')
    },
    {
        id: 3,
        role: 'user',
        content: 'Change the header to one liner',
        timeStamp: new Date('2024-03-20T11:42:00')
    },
    {
        id: 4,
        role: 'assistant',
        content: 'Sure I have updated the header. Do you need any further assistance?',
        timeStamp: new Date('2024-03-20T11:41:00')
    },
    {
        id: 5,
        role: 'user',
        content: 'Yes change the subject as well with a tailored',
        timeStamp: new Date('2024-03-20T11:42:00')
    }
];

const ChatHistory: React.FC<ChatHistoryProps> = ({
    open,
    onClose
}) => {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).toLowerCase();
    };

    return (
        <div className={`w-[300px] flex-1 border border-input rounded-lg flex flex-col h-full ${open ? 'block' : 'hidden'}`}>
            <div className='p-4 border-b border-input text-lg text-foreground font-semibold flex items-center justify-between'>
                <span>Chat History</span>
                <div className='text-sm text-slate-800 cursor-pointer hover:text-slate-900'>
                    <X className='w-4 h-4' onClick={onClose} />
                </div>
            </div>
            <div className='p-4 flex flex-col gap-4 overflow-y-auto flex-1'>
                {chats.map((chat) => (
                    <div key={chat.id} className='flex flex-col gap-1'>
                        <div 
                            className={`p-3 rounded-lg text-sm ${
                                chat.role === 'user' 
                                    ? 'bg-primary text-white' 
                                    : 'bg-gray-100 text-gray-900'
                            }`}
                        >
                            {chat.content}
                        </div>
                        <div className='flex items-center justify-between px-1'>
                            <span className='text-xs text-gray-500'>
                                {formatTime(chat.timeStamp)}
                            </span>
                            {chat.role === 'assistant' && (
                                <div className='flex gap-2'>
                                    <button className='text-gray-500 hover:text-gray-700'>
                                        <ThumbsUp className='w-4 h-4' />
                                    </button>
                                    <button className='text-gray-500 hover:text-gray-700'>
                                        <ThumbsDown className='w-4 h-4' />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatHistory;
