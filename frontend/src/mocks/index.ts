import { IRecentTemplate, RecentProposal } from "@/types";

export const MockRecentProposals: RecentProposal[] = [
    {
        id: '1',
        title: 'Corporate Event',
        tag: 'Business',
        createdAt: '2024-03-15',
        updatedAt: '2024-03-15'
    },
    {
        id: '2',
        title: 'Wedding Package',
        tag: 'Photography',
        createdAt: '2024-03-14',
        updatedAt: '2024-03-14'
    },
    {
        id: '3',
        title: 'Business Proposal',
        tag: 'Business',
        createdAt: '2024-03-12',
        updatedAt: '2024-03-12'
    },
    {
        id: '4',
        title: 'Event Proposal',
        tag: 'Event',
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
    },
    {
        id: '5',
        title: 'About Us',
        tag: 'About Us',
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
    },
]

export const MockRecentTemplates: IRecentTemplate[] = [
    {
        id: '1',
        title: 'Corporate Event',
        tags: ['Finance', 'Health'],
        image: 'https://via.placeholder.com/150',
        createdAt: '2024-03-15'
    },
    {
        id: '2',
        title: 'Wedding Package',
        tags: ['Tech', 'Education'],
        image: 'https://via.placeholder.com/150',
        createdAt: '2024-03-14'
    },
]

export const MockTags = [
    {
        id: '1',
        title: 'Finance',
        tag: 'Finance',
    },
    {
        id: '2',
        title: 'Health',
        tag: 'Health',
    },
    {
        id: '3',
        title: 'Tech',
        tag: 'Tech',
    },
    {
        id: '4',
        title: 'Education',
        tag: 'Education',
    },
    {
        id: '5',
        title: 'Information Technology',
        tag: 'Information Technology',
    },
]
