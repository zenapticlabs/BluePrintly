import React from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { AlignLeft, MessageSquareText, Mic, Paperclip, SendHorizonal } from 'lucide-react';

interface MessageBoxProps {
    onThemeClick: () => void;
    themeOpen: boolean;
    onSectionsClick: () => void;
    sectionsOpen: boolean;
    onChatHistoryClick: () => void;
    chatHistoryOpen: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({
    onThemeClick,
    themeOpen,
    onSectionsClick,
    sectionsOpen,
    onChatHistoryClick,
    chatHistoryOpen
}) => {
    return (
        <div className="">
            <Textarea
                placeholder="Type your message here..."
                className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={onThemeClick} className={`${themeOpen ? 'bg-slate-200' : ''}`}>Theme</Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button onClick={onSectionsClick} variant="ghost" size="sm" className={`!px-2 text-slate-800 hover:bg-slate-100 ${sectionsOpen ? 'bg-slate-200' : ''}`}>
                        <AlignLeft />
                    </Button>
                    <Button onClick={onChatHistoryClick} variant="ghost" size="sm" className={`!px-2 text-slate-800 hover:bg-slate-100 ${chatHistoryOpen ? 'bg-slate-200' : ''}`}>
                        <MessageSquareText />
                    </Button>
                    <Button variant="ghost" size="sm" className="!px-2 text-slate-800 hover:bg-slate-100">
                        <Paperclip />
                    </Button>
                </div>
                <div>
                    <Button variant="ghost" size="sm" className="!px-2 text-slate-800 hover:bg-slate-100">
                        <Mic />
                    </Button>
                    <Button size="sm" className="!px-2 text-slate-800 text-white">
                        <SendHorizonal />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MessageBox;
