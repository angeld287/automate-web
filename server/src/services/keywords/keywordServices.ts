import { IKeywordService } from "../../interfaces/IKeywordService";
import IKeyword, { IKeywordSearchJob } from "../../interfaces/models/Keyword";
import Database from "../../providers/Database";

export class keywordService implements IKeywordService {

    async createKeywordSearchJob(job: IKeywordSearchJob): Promise<IKeywordSearchJob> {
        try {
            const createKeywordSearchJobTmpl = {
                name: 'create-new-keyword_search_job',
                text: 'INSERT INTO public.keyword_search_job(created_by) VALUES ($1) RETURNING id, created_by',
                values: [job.createdBy],
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

            let _job: IKeywordSearchJob = {
                id: result.rows[0].id,
                createdBy: result.rows[0].created_by,
            }
            
            return _job;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createKeyword(keyword: IKeyword): Promise<IKeyword> {
        try {
            const createKeywordTmpl = {
                name: 'create-new-keyword',
                text: 'INSERT INTO public.keywords(name, similarity, keyword_search_job_id) VALUES ($1, $2, $3) RETURNING id, name, similarity, keyword_search_job_id',
                values: [keyword.name, keyword.similarity, keyword.keywordSearchJobId],
            }

            let result = null, client = null;

            client = await Database.getTransaction();

            try {
                result = await Database.sqlExecSingleRow(client, createKeywordTmpl);
                await Database.commit(client);
            } catch (error) {
                await Database.rollback(client);
                throw new Error(error);
            }

            let _keyword: IKeyword = {
                id: result.rows[0].id,
                name: result.rows[0].name,
                similarity: result.rows[0].similarity,
                keywordSearchJobId: result.rows[0].keyword_search_job_id,
            }
            
            return _keyword;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getKeywordByName(name: string): Promise<IKeyword | false> {
        const getQuery = {
            name: 'get-keyword-by-name',
            text: `SELECT id, name, similarity, keyword_search_job_id FROM public.keywords where name = $1`,
            values: [name],
        }

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return false
            
            const keyword: IKeyword = {
                id: result.rows[0].id,
                name: result.rows[0].name,
                similarity: result.rows[0].similarity,
                keywordSearchJobId: result.rows[0].keyword_search_job_id,
            }

            return keyword;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}