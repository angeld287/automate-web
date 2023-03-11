import { IKeywordService } from "../../interfaces/IKeywordService";
import IKeyword, { IKeywordSearchJob } from "../../interfaces/models/Keyword";
import Database from "../../providers/Database";

export class keywordService implements IKeywordService {

    async createKeywordSearchJob(job: IKeywordSearchJob): Promise<IKeywordSearchJob> {
        try {
            const createKeywordSearchJobTmpl = {
                name: 'create-new-keyword_search_job',
                text: 'INSERT INTO public.keyword_search_job(created_by, long_tail_keyword) VALUES ($1, $2) RETURNING id, created_by, long_tail_keyword',
                values: [job.createdBy, job.longTailKeyword],
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
                longTailKeyword: result.rows[0].long_tail_keyword,
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
                text: 'INSERT INTO public.keywords(name, similarity, keyword_search_job_id) VALUES ($1, $2, $3) RETURNING id, name, similarity, keyword_search_job_id, article_id, selected',
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
                articleId: result.rows[0].article_id,
                selected: result.rows[0].selected
            }
            
            return _keyword;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateKeyword(keyword: IKeyword): Promise<IKeyword> {
        try {
            const createKeywordTmpl = {
                name: 'add-remove-keyword-article-relation',
                text: 'UPDATE public.keywords selected=$2, article_id=$1  WHERE id = $3 RETURNING id, name, similarity, keyword_search_job_id, article_id, selected',
                values: [keyword.articleId, keyword.selected, keyword.id],
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
                articleId: result.rows[0].article_id,
                selected: result.rows[0].selected
            }
            
            return _keyword;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getKeywordByName(name: string): Promise<IKeyword | false> {
        const getQuery = {
            name: 'get-keyword-by-name',
            text: `SELECT id, name, similarity, keyword_search_job_id, article_id, selected FROM public.keywords where name = $1`,
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
                articleId: result.rows[0].article_id,
                selected: result.rows[0].selected
            }

            return keyword;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getKeywordSearchJob(jobId: number): Promise<IKeywordSearchJob | false> {
        const getQuery = {
            name: 'get-keyword-search-job-by-id',
            text: `SELECT id, created_by, deleted, deleted_by, created_at, deleted_at, unique_name, status FROM public.keyword_search_job WHERE id = $1`,
            values: [jobId],
        }

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return false
            
            const keywords: Array<IKeyword> = await this.getKeywordsByJobId(result.rows[0].id);
            
            const job: IKeywordSearchJob = {
                id: result.rows[0].id,
                createdBy: result.rows[0].created_by,
                status: result.rows[0].status,
                uniqueName: result.rows[0].unique_name,
                keywords
            }

            return job;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getKeywordsByJobId(jobId: number): Promise<Array<IKeyword>> {
        const getQuery = {
            name: 'get-keywords-by-job-id',
            text: `SELECT id, name, similarity, keyword_search_job_id, article_id, selected FROM public.keywords WHERE keyword_search_job_id = $1`,
            values: [jobId],
        }

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            const keyowrds: Array<IKeyword> = []

            result.rows.forEach(row => {
                keyowrds.push({
                    id: row.id,
                    name: row.name,
                    similarity: row.similarity,
                    keywordSearchJobId: row.keyword_search_job_id,
                    articleId: row.article_id,
                    selected: row.selected
                })
            });

            return keyowrds.sort((kwA, kwB) => (kwA.similarity < kwB.similarity ? -1 : 1));
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getKeywordsById(id: number): Promise<IKeyword> {
        const getQuery = {
            name: 'get-keywords-by-id',
            text: `SELECT id, name, similarity, keyword_search_job_id, article_id, selected FROM public.keywords WHERE id = $1`,
            values: [id],
        }

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            const keyowrd: IKeyword = {
                id: result.rows[0].id,
                name: result.rows[0].name,
                similarity: result.rows[0].similarity,
                keywordSearchJobId: result.rows[0].keyword_search_job_id,
                articleId: result.rows[0].article_id,
                selected: result.rows[0].selected
            }

            return keyowrd
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllKeywordSearchJobs(userId: number): Promise<Array<IKeywordSearchJob>> {
        const getQuery = {
            name: 'get-all-keywords-search-jobs',
            text: `SELECT id, created_by, deleted, deleted_by, created_at, deleted_at, unique_name, status, long_tail_keyword FROM public.keyword_search_job WHERE created_by = $1`,
            values: [userId],
        }

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            const keyowrdSearchJons: Array<IKeywordSearchJob> = []

            result.rows.forEach(row => {
                keyowrdSearchJons.push({
                    id: row.id,
                    createdBy: row.created_by,
                    createdAt: row.created_at,
                    status: row.status,
                    longTailKeyword: row.long_tail_keyword,
                })
            });

            return keyowrdSearchJons
        } catch (error) {
            throw new Error(error.message);
        }
    }
}