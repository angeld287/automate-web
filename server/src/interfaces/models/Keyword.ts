export default interface IKeyword {
    name: string;
    resultsSimilarity: Array<IResultTitleSimilarity>
}

export interface IResultTitleSimilarity {
    name: string;
    similarity: number;
    value: number;
}

export interface IKeywordSearchJob {

}