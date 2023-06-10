export default interface IKeyword {
    id?: number;
    name: string;
    resultsSimilarity?: Array<IResultTitleSimilarity>
    similarity?: number;
    keywordSearchJobId?: number;
    selected?: boolean;
    articleId?: number;
    isMain?: boolean;
    orderNumber?: number;
    category?: string;
    createdManually?: boolean;
}

export interface IResultTitleSimilarity {
    name: string;
    similarity: number;
    value: number;
}

export interface IKeywordSearchJob {
    id?: number;
    uniqueName?: string;
    longTailKeyword?: string;
    status?: 'RUNNING' | 'STOPPED';
    keywords?: Array<IKeyword>;
    createdBy: string;
    createdAt?: string;
    deletedBy?: string;
    deleted?: boolean;
    mainKeywords?: string;
    siteId: number;
}