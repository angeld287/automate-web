import { INewArticle, SubTitleContent } from "../../interfaces/Content/Article";
import { IArticleService } from "../../interfaces/IArticleService";
import Content from "../../interfaces/models/Content";
import { Query } from "../../interfaces/Query";
import Database from "../../providers/Database";

export class articleService implements IArticleService {

    async createSubtitle(subtitle: SubTitleContent): Promise<SubTitleContent> {
        try {
            const createSubtitle = {
                name: 'create-new-subtitle',
                text: 'INSERT INTO public.subtitles(subtitles_name, translated_name, articles_id)VALUES ($1, $2, $3) RETURNING id, subtitles_name, translated_name, articles_id',
                values: [subtitle.name, subtitle.translatedName, subtitle.articleId],
            }

            let result = null, client = null;

            client = await Database.getTransaction();

            try {
                result = await Database.sqlExecSingleRow(client, createSubtitle);
                await Database.commit(client);
            } catch (error) {
                await Database.rollback(client);
                throw new Error(error);
            }

            let _subtitle: SubTitleContent = {
                id: result.rows[0].id,
                name: result.rows[0].subtitles_name,
                translatedName: result.rows[0].translated_name,
                articleId: result.rows[0].articles_id,
            }
            
            return _subtitle;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createArticle(article: INewArticle): Promise<INewArticle> {
        try {
            const createArticle = {
                name: 'create-new-subtitle',
                text: 'INSERT INTO public.articles(title, translated_title, category, created_by) VALUES ($1, $2, $3, $4) RETURNING id, title, translated_title, category, created_by, created_at',
                values: [article.title, article.translatedTitle, article.category, article.createdBy],
            }

            let result = null, client = null;

            client = await Database.getTransaction();

            try {
                result = await Database.sqlExecSingleRow(client, createArticle);
                await Database.commit(client);
            } catch (error) {
                await Database.rollback(client);
                throw new Error(error);
            }

            let _article: INewArticle = {
                id: result.rows[0].id,
                category: result.rows[0].category,
                subtitles: [],
                title: result.rows[0].title,
                translatedTitle: result.rows[0].translated_title,
                createdBy: result.rows[0].created_by,
                createdAt: result.rows[0].created_at,
            }
            
            return _article;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getArticleById(articleId: number): Promise<INewArticle | boolean> {
        const getQuery = {
            name: 'get-article-by-id',
            text: `SELECT id, title, translated_title, category FROM public.articles where id = $1`,
            values: [articleId],
        }

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return false
            
            const article: INewArticle = {
                id: result.rows[0].id,
                title: result.rows[0].title,
                translatedTitle: result.rows[0].translated_title,
                category: result.rows[0].category,
                subtitles: [],
                createdBy: result.rows[0].created_by,
                createdAt: result.rows[0].created_at,
            }

            return article;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getArticles(page: number, size: number, userId: number): Promise<Array<INewArticle> | boolean> {
        const getQuery = {
            name: 'get-article-by-id',
            text: `SELECT * FROM public.articles WHERE created_by = $3 ORDER BY created_at LIMIT $2 OFFSET $1;`,
            values: [page, size, userId],
        }

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return false
            
            const articles: Array<INewArticle> = []
            
            result.rows.forEach(row => {
               articles.push({
                    id: row.id,
                    title: row.title,
                    translatedTitle: row.translated_title,
                    category: row.category,
                    subtitles: [],
                    createdBy: result.rows[0].created_by,
                    createdAt: result.rows[0].created_at,
                })
            });

            return articles;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getSubtitleById(subtitleId: number): Promise<SubTitleContent | boolean> {
        const getQuery = {
            name: 'get-subtitle-by-id',
            text: `SELECT id, subtitles_name, translated_name, articles_id FROM public.subtitles where id = $1`,
            values: [subtitleId],
        }

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return false
            
            const subtitle: SubTitleContent = {
                id: result.rows[0].id,
                name: result.rows[0].subtitles_name,
                translatedName: result.rows[0].translated_name,
            }

            return subtitle;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createContextForArticle(content: Content): Promise<Content> {
        const createContent = {
            name: 'create-new-content-for-article',
            text: 'INSERT INTO public.contents(content, selected, content_language, articles_id) VALUES ($1, $2, $3, $4) RETURNING id, content, selected, content_language, articles_id, subtitles_id',
            values: [content.content, content.selected, content.contentLanguage, content.articleId],
        }

        return await this.createContent(createContent);
    }

    async createContextForSubtitle(content: Content): Promise<Content> {
        const createContent = {
            name: 'create-new-content-for-subtitle',
            text: 'INSERT INTO public.contents(content, selected, content_language, subtitles_id) VALUES ($1, $2, $3, $4) RETURNING id, content, selected, content_language, articles_id, subtitles_id',
            values: [content.content, content.selected, content.contentLanguage, content.subtitleId],
        }

        return await this.createContent(createContent);
    }
    
    async createContent(createContent: Query): Promise<Content> {
        try {
            let result = null, client = null;

            client = await Database.getTransaction();

            try {
                result = await Database.sqlExecSingleRow(client, createContent);
                await Database.commit(client);
            } catch (error) {
                await Database.rollback(client);
                throw new Error(error);
            }

            let _content: Content = {
                id: result.rows[0].id,
                content: result.rows[0].content,
                selected: result.rows[0].selected,
                contentLanguage: result.rows[0].content_language,
                articleId: result.rows[0].articles_id,
                subtitleId: result.rows[0].subtitles_id,
            }
            
            return _content;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }
}