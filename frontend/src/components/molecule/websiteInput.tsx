import React, { useState, ChangeEvent } from 'react';
import { Input } from '../ui/input';

interface WebsiteInputProps {
    title: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    className?: string;
}

export const WebsiteInput: React.FC<WebsiteInputProps> = ({
    title,
    value,
    onChange,
    placeholder = 'Enter website URL',
    error,
    className,
}) => {
    const [isValid, setIsValid] = useState(true);

    const validateUrl = (url: string): boolean => {
        try {
            // Add https:// if no protocol is specified
            const urlToValidate = url.match(/^https?:\/\//) ? url : `https://${url}`;
            new URL(urlToValidate);
            return true;
        } catch {
            return false;
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const valid = newValue === '' || validateUrl(newValue);
        setIsValid(valid);
        onChange(newValue);
    };

    // Remove http:// or https:// for display if present
    const displayValue = value.replace(/^https?:\/\//, '');

    return (
        <div className="relative w-full">
            <p className="text-sm font-medium mb-2 text-slate-800">{title}</p>
            <div className="flex items-center">
                <div className="absolute left-3 text-muted-foreground">https://</div>
                <Input
                    type="text"
                    value={displayValue}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`pl-16 pr-4 w-full h-10 rounded-md border ${!isValid || error
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-input focus:ring-primary'
                        } focus:border-transparent focus:ring-2 outline-none transition-all ${className}`}
                />
            </div>
            {(!isValid || error) && (
                <p className="mt-1 text-sm text-red-500">
                    {error || 'Please enter a valid website URL'}
                </p>
            )}
        </div>
    );
};
