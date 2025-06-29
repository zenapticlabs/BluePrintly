import React from 'react';
import { LucideIcon } from 'lucide-react';
import RecentProposalComponent from './RecentProposalComponent';
import { RecentProposal } from '@/types';
import { MockRecentProposals } from '@/mocks';
import { Button } from '../ui/button';
import Link from 'next/link';

interface RecentProposalsProps {
    viewMode: 'grid' | 'list';
}

const RecentProposals: React.FC<RecentProposalsProps> = ({
    viewMode
}) => {
    return (
        <div className="max-w-full w-full">
            <div className='flex justify-between items-center'>
                <div className='text-xl font-medium text-slate-800 mb-4 mt-4'>
                    Recent Proposals
                </div>
                <Link href="/proposals" className='text-gray-900 text-sm hover:bg-transparent hover:text-black'>
                    View All
                </Link>
            </div>
            <div className={`${
                viewMode === 'grid' 
                    ? 'flex overflow-x-auto gap-4 pb-4' 
                    : 'flex flex-col gap-4'
            } max-w-full w-full`}>
                {MockRecentProposals.map((proposal) => (
                    <RecentProposalComponent 
                        key={proposal.id} 
                        proposal={proposal} 
                        viewMode={viewMode}
                    />
                ))}
            </div>
        </div>
    );
};

export default RecentProposals;
