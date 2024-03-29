import { IKeywordService } from "../../interfaces/IKeywordService";
import IKeyword, { IKeywordSearchJob } from "../../interfaces/models/Keyword";
import Database from "../../providers/Database";

export class keywordService implements IKeywordService {

    async createKeywordSearchJob(job: IKeywordSearchJob): Promise<IKeywordSearchJob> {
        try {
            const createKeywordSearchJobTmpl = {
                name: 'create-new-keyword_search_job',
                text: 'INSERT INTO public.keyword_search_job(created_by, long_tail_keyword, main_keywords, site_id) VALUES ($1, $2, $3, $4) RETURNING id, created_by, deleted, deleted_by, created_at, deleted_at, unique_name, status, long_tail_keyword, main_keywords, site_id',
                values: [job.createdBy, job.longTailKeyword, job.mainKeywords, job.siteId],
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
                deleted: result.rows[0].deleted,
                mainKeywords: result.rows[0].main_keywords,
                siteId: result.rows[0].site_id,
            }
            
            return _job;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateKeywordSearchJob(job: IKeywordSearchJob): Promise<IKeywordSearchJob> {
        try {
            const updateKeywordSearchJobTmpl = {
                name: 'update-new-keyword_search_job',
                text: 'UPDATE public.keyword_search_job SET deleted=$1, deleted_by=$2, status=$3, site_id=$4 WHERE id = $4 RETURNING id, created_by, deleted, deleted_by, created_at, deleted_at, unique_name, status, long_tail_keyword, main_keywords, site_id',
                values: [job.deleted, job.deletedBy, job.status, job.id],
            }

            let result = null, client = null;

            client = await Database.getTransaction();

            try {
                result = await Database.sqlExecSingleRow(client, updateKeywordSearchJobTmpl);
                await Database.commit(client);
            } catch (error) {
                await Database.rollback(client);
                throw new Error(error);
            }

            let _job: IKeywordSearchJob = {
                id: result.rows[0].id,
                createdBy: result.rows[0].created_by,
                longTailKeyword: result.rows[0].long_tail_keyword,
                deleted: result.rows[0].deleted,
                mainKeywords: result.rows[0].main_keywords,
                siteId: result.rows[0].site_id,
            }
            
            return _job;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createKeyword(keyword: IKeyword): Promise<IKeyword | false> {
        try {
            const keyowrdName = `${keyword.name.charAt(0).toUpperCase()}${decodeURIComponent(keyword.name.slice(1))}`;

            const createKeywordTmpl = {
                name: 'create-new-keyword',
                text: 'INSERT INTO public.keywords(name, similarity, keyword_search_job_id, is_main, article_id, order_number, category, created_manually) VALUES ($1, $2, $3, false, $4, $5, $6, $7) RETURNING id, name, similarity, keyword_search_job_id, article_id, selected, is_main, order_number, category, created_manually',
                values: [keyowrdName, keyword.similarity, keyword.keywordSearchJobId, keyword.articleId, keyword.orderNumber, keyword.category, keyword.createdManually],
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
                selected: result.rows[0].selected,
                isMain: result.rows[0].is_main,
                orderNumber: result.rows[0].order_number,
                category: result.rows[0].category,
                createdManually: result.rows[0].created_manually,
            }
            
            return _keyword;
            
        } catch (error) {
            console.log(error.message);
            return false
        }
    }

    async updateKeyword(keyword: IKeyword): Promise<IKeyword> {
        try {
            const createKeywordTmpl = {
                name: 'add-remove-keyword-article-relation',
                text: 'UPDATE public.keywords SET selected=$2, article_id=$1, is_main=$4, order_number=$5, category=$6  WHERE id = $3 RETURNING id, name, similarity, keyword_search_job_id, article_id, selected, is_main, order_number, category, created_manually',
                values: [keyword.articleId, keyword.selected, keyword.id, keyword.isMain, keyword.orderNumber, keyword.category],
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
                selected: result.rows[0].selected,
                isMain: result.rows[0].is_main,
                orderNumber: result.rows[0].order_number,
                category: result.rows[0].category,
                createdManually: result.rows[0].created_manually,
            }
            
            return _keyword;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getKeywordByName(name: string): Promise<IKeyword | false> {
        const getQuery = {
            name: 'get-keyword-by-name',
            text: `SELECT id, name, similarity, keyword_search_job_id, article_id, selected, is_main, order_number, category, created_manually FROM public.keywords where name = $1`,
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
                selected: result.rows[0].selected,
                isMain: result.rows[0].is_main,
                orderNumber: result.rows[0].order_number,
                category: result.rows[0].category,
                createdManually: result.rows[0].created_manually,
            }

            return keyword;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getKeywordSearchJob(jobId: number): Promise<IKeywordSearchJob | false> {
        const getQuery = {
            name: 'get-keyword-search-job-by-id',
            text: `SELECT id, created_by, deleted, deleted_by, created_at, deleted_at, unique_name, status, main_keywords FROM public.keyword_search_job WHERE id = $1`,
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
                keywords,
                deleted: result.rows[0].deleted,
                mainKeywords: result.rows[0].main_keywords,
                siteId: result.rows[0].site_id,
            }

            return job;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getKeywordsByJobId(jobId: number): Promise<Array<IKeyword>> {
        const getQuery = {
            name: 'get-keywords-by-job-id',
            text: `SELECT id, name, similarity, keyword_search_job_id, article_id, selected, is_main, order_number, category, created_manually FROM public.keywords WHERE keyword_search_job_id = $1`,
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
                    selected: row.selected,
                    isMain: row.is_main,
                    orderNumber: row.order_number,
                    category: row.category,
                    createdManually: row.created_manually,
                })
            });

            return keyowrds.sort((kwA, kwB) =>  kwA.similarity < kwB.similarity ? -1 : (kwA.similarity > kwB.similarity ? 1 : kwA.name < kwB.name ? -1 : 1));
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getKeywordsByArticleId(articleId: number): Promise<Array<IKeyword>> {
        const getQuery = {
            name: 'get-keywords-by-article-id',
            text: `SELECT id, name, similarity, keyword_search_job_id, article_id, selected, is_main, order_number, category, created_manually FROM public.keywords WHERE article_id = $1`,
            values: [articleId],
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
                    selected: row.selected,
                    isMain: row.is_main,
                    orderNumber: row.order_number,
                    category: row.category,
                    createdManually: row.created_manually,
                })
            });

            return keyowrds.sort((kwA, kwB) => kwA.orderNumber < kwB.orderNumber ? -1 : 1);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getKeywordsById(id: number): Promise<IKeyword> {
        const getQuery = {
            name: 'get-keywords-by-id',
            text: `SELECT id, name, similarity, keyword_search_job_id, article_id, selected, is_main, order_number, category, created_manually FROM public.keywords WHERE id = $1`,
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
                selected: result.rows[0].selected,
                isMain: result.rows[0].is_main,
                orderNumber: result.rows[0].order_number,
                category: result.rows[0].category,
            }

            return keyowrd
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllKeywordSearchJobs(userId: number, siteId: number): Promise<Array<IKeywordSearchJob>> {
        const getQuery = {
            name: 'get-all-keywords-search-jobs',
            text: `SELECT id, created_by, deleted, deleted_by, created_at, deleted_at, unique_name, status, long_tail_keyword, main_keywords, site_id FROM public.keyword_search_job WHERE created_by = $1 and site_id = $2`,
            values: [userId, siteId],
        }

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            const keyowrdSearchJobs: Array<IKeywordSearchJob> = []

            result.rows.forEach(row => {
                keyowrdSearchJobs.push({
                    id: row.id,
                    createdBy: row.created_by,
                    createdAt: row.created_at,
                    status: row.status,
                    longTailKeyword: row.long_tail_keyword,
                    deleted: row.deleted,
                    mainKeywords: row.main_keywords,
                    siteId: row.site_id,
                })
            });

            return keyowrdSearchJobs
        } catch (error) {
            throw new Error(error.message);
        }
    }
}