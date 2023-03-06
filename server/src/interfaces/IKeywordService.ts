import IKeyword, { IKeywordSearchJob } from "./models/Keyword";

export interface IKeywordService {
    createKeywordSearchJob(job: IKeywordSearchJob): Promise<IKeywordSearchJob>

    createKeyword(keyword: IKeyword): Promise<IKeyword>

    getKeywordByName(name: string): Promise<IKeyword | false>
}