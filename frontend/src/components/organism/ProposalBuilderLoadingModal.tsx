import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import LoadingGif from "@/assets/loading.gif"
import Image from 'next/image';

interface ProposalBuilderLoadingModalProps {
    loading: boolean;
}

const ProposalBuilderLoadingModal: React.FC<ProposalBuilderLoadingModalProps> = ({
    loading
}) => {
    return (
        <Dialog open={loading}>
            <DialogTitle>Loading...</DialogTitle>
            <DialogContent showCloseButton={false}>
                <div className='text-center flex flex-col items-center gap-2'>
                    <Image src={LoadingGif} alt='Loading' width={100} height={100} className='w-48 h-48' />
                    <div className='text-xl font-medium text-slate-800 font-bold'>Please Wait...</div>
                    <div className='flex items-center text-base text-slate-500 gap-2'>
                        Congratulations! You’ve successfully log into the system. Let’s explore together
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProposalBuilderLoadingModal;
