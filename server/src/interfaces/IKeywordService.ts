import IKeyword, { IKeywordSearchJob } from "./models/Keyword";

export interface IKeywordService {
    createKeywordSearchJob(job: IKeywordSearchJob): Promise<IKeywordSearchJob>

    createKeyword(keyword: IKeyword): Promise<IKeyword>

    getKeywordByName(name: string): Promise<IKeyword | false>

    getKeywordSearchJob(jobId: number): Promise<IKeywordSearchJob | false>

    getAllKeywordSearchJobs(userId: number): Promise<Array<IKeywordSearchJob>>
}