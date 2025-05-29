import { Check, FileIcon } from "lucide-react";

interface UploadedFileComponentProps {
    fileName: string;
    fileSize: string;
    className?: string;
    checked?: boolean;
}

const UploadedFileComponent: React.FC<UploadedFileComponentProps> = ({
    fileName,
    fileSize,
    className,
    checked = false
}) => {
    return (
        <div className={`relative flex items-center gap-3 p-3 rounded-lg border border-input bg-background ${className}`}>
            {checked && (
                <span
                    className="absolute top-3 right-3 h-4 w-4 rounded-full bg-primary text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                </span>
            )}
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-50">
                <FileIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-900">{fileName}</span>
                <span className="text-sm text-slate-500">{fileSize}</span>
            </div>
        </div>
    );
};

export default UploadedFileComponent;
