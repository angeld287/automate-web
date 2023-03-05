import { IKeywordSearchJob } from "./models/Keyword";

export interface IKeywordService {
    createKeywordSearchJob(job: IKeywordSearchJob): Promise<IKeywordSearchJob>
}