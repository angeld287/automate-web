export default interface IKeyword {
    id?: number;
    name: string;
    resultsSimilarity?: Array<IResultTitleSimilarity>
    similarity?: number;
    keywordSearchJobId?: number;
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
}