import { IKeywordService } from "../../interfaces/IKeywordService";
import { IKeywordSearchJob } from "../../interfaces/models/Keyword";
import Database from "../../providers/Database";

export class keywordService implements IKeywordService {

    async createKeywordSearchJob(job: IKeywordSearchJob): Promise<IKeywordSearchJob> {
        try {
            const createKeywordSearchJobTmpl = {
                name: 'create-new-keyword_search_job',
                text: 'INSERT INTO public.keyword_search_job(created_by) VALUES ($1) RETURNING id',
                values: [],
            }

            let result = null, client = null;

            client = await Database.getTransaction();

            try {
                result = await Database.sqlExecSingleRow(client, createKeywordSearchJobTmpl);
                await Database.commit(client);
            } catch (error) {
                await Database.rollback(client);
                throw new Error(error);
            }

            let _job: IKeywordSearchJob = {}
            
            return _job;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }
}