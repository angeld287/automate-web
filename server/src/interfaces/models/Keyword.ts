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
    createdBy: string;
}