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
]

export const MockRecentTemplates: IRecentTemplate[] = [
    {
        id: '1',
        title: 'Corporate Event',
        image: 'https://via.placeholder.com/150'
    },
    {
        id: '2',
        title: 'Wedding Package',
        image: 'https://via.placeholder.com/150'
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
