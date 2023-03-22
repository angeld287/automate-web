import IKeyword, { IKeywordSearchJob } from "./models/Keyword";

export interface IKeywordService {
    createKeywordSearchJob(job: IKeywordSearchJob): Promise<IKeywordSearchJob>

    createKeyword(keyword: IKeyword): Promise<IKeyword | false>

    getKeywordByName(name: string): Promise<IKeyword | false>

    getKeywordSearchJob(jobId: number): Promise<IKeywordSearchJob | false>

    getAllKeywordSearchJobs(userId: number): Promise<Array<IKeywordSearchJob>>

    getKeywordsById(jobId: number): Promise<IKeyword>

    getKeywordsByJobId(jobId: number): Promise<Array<IKeyword>>

    getKeywordsByArticleId(jobId: number): Promise<Array<IKeyword>>

    updateKeyword(keyword: IKeyword): Promise<IKeyword>
}