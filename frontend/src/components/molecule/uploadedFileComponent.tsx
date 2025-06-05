import { Check, FileIcon, X } from "lucide-react";

interface UploadedFileComponentProps {
    fileName: string;
    fileSize: string;
    className?: string;
    checked?: boolean;
    onDelete?: () => void;
}

const UploadedFileComponent: React.FC<UploadedFileComponentProps> = ({
    fileName,
    fileSize,
    className,
    checked = false,
    onDelete
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
            <div className="flex flex-col flex-1">
                <span className="text-sm font-medium text-slate-900">{fileName}</span>
                <span className="text-sm text-slate-500">{fileSize}</span>
            </div>
            {onDelete && (
                <button
                    type="button"
                    onClick={onDelete}
                    className="text-red-500 hover:text-red-700 p-1"
                >
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
    );
};

export default UploadedFileComponent;
