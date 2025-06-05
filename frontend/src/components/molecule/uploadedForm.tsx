import { UploadCloud } from "lucide-react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import UploadedFileComponent from "./uploadedFileComponent";

interface UploadedFormProps {
    onFileUpload?: (file: File) => void;
    acceptedFileTypes?: string[];
    maxSize?: number;
}

const UploadedForm: React.FC<UploadedFormProps> = ({
    onFileUpload,
    maxSize = 5242880, // 5MB default
}) => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setUploadedFile(file);
            onFileUpload?.(file);
        }
    }, [onFileUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
        },
        maxSize,
        multiple: false,
        onDragEnter: () => { },
        onDragOver: () => { },
        onDragLeave: () => { }
    });

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`
                    border-1 rounded-lg p-8
                    transition-colors duration-200 ease-in-out
                    flex flex-col items-center justify-center
                    cursor-pointer
                    ${isDragActive
                        ? 'border-input bg-input/5'
                        : 'border-input hover:border-primary/50'
                    }
                `}
            >
                <input {...getInputProps()} type="file" className="hidden" />
                <>
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <UploadCloud className="w-6 h-6 text-slate-600" />
                    </div>
                    <div className="text-center">
                        <div className="flex gap-1 items-end">
                            <span className="text-primary font-bold">Click to upload</span>
                            <span className="text-slate-500">or drag and drop</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            PDF, DOCX or XLS (max. 800×400px)
                        </p>
                    </div>
                </>
            </div>
        </div>
    );
};

export default UploadedForm;
