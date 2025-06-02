import React from 'react';
import { LucideIcon } from 'lucide-react';
import RecentProposalComponent from './RecentProposalComponent';
import { RecentProposal } from '@/types';
import { MockRecentProposals } from '@/mocks';
import { Button } from '../ui/button';
interface RecentProposalsProps {

}

const RecentProposals: React.FC<RecentProposalsProps> = ({
}) => {
    return (
        <div className="max-w-full w-full">
            <div className='flex justify-between items-center'>
                <div className='text-xl font-medium text-slate-800 mb-4 mt-4'>
                    Recent Proposals
                </div>
                <Button variant='ghost' className='text-gray-900 text-sm hover:bg-transparent hover:text-black'>
                    View All
                </Button>
            </div>
            <div className='flex overflow-x-auto gap-4 pb-4 hide-scrollbar max-w-full w-full'>
                {MockRecentProposals.map((proposal) => (
                    <RecentProposalComponent key={proposal.id} proposal={proposal} />
                ))}
            </div>
        </div>
    );
};

export default RecentProposals;
