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
    tags: string[];
    image?: string;
    createdAt: string;
}

export interface ITag {
    id: string;
    title: string;
    tag: string;
}

export interface IChat {
    id: number;
    role: string;
    content: string;
    timeStamp: Date;
}