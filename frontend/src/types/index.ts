export interface RecentProposal {
    id: string;
    title: string;
    tag: string;
    createdAt: string;
    updatedAt: string;
}

export interface IRecentTemplate {
    id: string;
    title: string;
    image?: string;
}

export interface ITag {
    id: string;
    title: string;
    tag: string;
}