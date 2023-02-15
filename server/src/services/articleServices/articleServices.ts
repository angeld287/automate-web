import { INewArticle, SubTitleContent } from "../../interfaces/Content/Article";
import { Languages } from "../../interfaces/Enums/Languages";
import { IArticleService } from "../../interfaces/IArticleService";
import IContent from "../../interfaces/models/Content";
import { DbMedia } from "../../interfaces/models/Media";
import { Query } from "../../interfaces/Query";
import Log from "../../middlewares/Log";
import Database from "../../providers/Database";
import Locals from "../../providers/Locals";

export class articleService implements IArticleService {

    async createSubtitle(subtitle: SubTitleContent): Promise<SubTitleContent> {
        try {
            const createSubtitle = {
                name: 'create-new-subtitle',
                text: 'INSERT INTO public.subtitles(subtitles_name, translated_name, articles_id, order_number)VALUES ($1, $2, $3, $4) RETURNING id, TRIM(subtitles_name) AS subtitles_name, TRIM(translated_name) AS translated_name, articles_id, order_number',
                values: [subtitle.name, subtitle.translatedName, subtitle.articleId, subtitle.orderNumber],
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
                orderNumber: result.rows[0].order_number,
            }
            
            return _subtitle;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getSubtitlesByArticleId(articleId: number): Promise<Array<SubTitleContent>> {
        const getQuery = {
            name: 'get-subtitles-by-article_id',
            text: `
                    SELECT id, TRIM(subtitles_name) as subtitles_name,
                        TRIM(translated_name) as translated_name,
                        articles_id, order_number
                    FROM public.subtitles
                    WHERE articles_id = $1
                `,
            values: [articleId],
        }

        let result = null;
        try {
            
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return []
            
            const subtitles: Array<SubTitleContent> = []

            await Promise.all(result.rows.map(async (row) => {
                const contents: Array<IContent> = await this.getContentBySubtitleId(row.id);
                const media: Array<DbMedia> = await this.getMediaBySubtitleId(row.id);
                subtitles.push({
                    id: row.id,
                    name: row.subtitles_name,
                    orderNumber: row.order_number,
                    translatedName: row.translated_name,
                    articleId: row.articles_id,
                    content: contents.filter(content => content.contentLanguage === Languages.SPANISH),
                    enContent: contents.filter(content => content.contentLanguage === Languages.ENGLISH),
                    image: media[0],
                })
            }));

            return subtitles
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createArticle(article: INewArticle): Promise<INewArticle> {
        try {
            const createArticle = {
                name: 'create-new-article',
                text: 'INSERT INTO public.articles(title, translated_title, category, created_by) VALUES ($1, $2, $3, $4) RETURNING internal_id, id, TRIM(title) AS title, TRIM(translated_title) AS translated_title, category, created_by, created_at',
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
                internalId: result.rows[0].internal_id,
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

    async getArticleById(articleId: number): Promise<INewArticle | false> {

        if (!articleId)
                return false

        const getQuery = {
            name: 'get-article-by-id',
            text: `SELECT id, internal_id, TRIM(title) AS title , TRIM(translated_title) AS translated_title, category, created_by, created_at FROM public.articles where internal_id = $1`,
            values: [articleId],
        }

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return false

            const subtitles: Array<SubTitleContent> = await this.getSubtitlesByArticleId(result.rows[0].id)
            const media: Array<DbMedia> = await this.getMediaByArticleId(result.rows[0].id);
            const contents: Array<IContent> = await this.getContentByArticleId(result.rows[0].id);
            
            const article: INewArticle = {
                id: result.rows[0].id,
                internalId: result.rows[0].internal_id,
                title: result.rows[0].title,
                translatedTitle: result.rows[0].translated_title,
                category: result.rows[0].category,
                subtitles: subtitles,
                image: media[0],
                contents,
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
            name: 'get-articles-by-id',
            text: `
                    SELECT  id,
                        TRIM(title) as title, 
                        TRIM(translated_title) as translated_title, 
                        category, internal_id, created_by, deleted, deleted_by, created_at, deleted_at
                    FROM public.articles WHERE created_by = $3 AND deleted IS NOT true ORDER BY created_at DESC LIMIT $2 OFFSET $1;
                `,
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
                    internalId: row.internal_id,
                    title: row.title,
                    translatedTitle: row.translated_title,
                    category: row.category,
                    subtitles: [],
                    createdBy: row.created_by,
                    createdAt: row.created_at,
                    deleted: row.deleted,
                    deletedBy: row.deleted_by,
                    deletedAt: row.deleted_at,
                })
            });

            return articles;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getSubtitleById(subtitleId: number): Promise<SubTitleContent | false> {
        const getQuery = {
            name: 'get-subtitle-by-id',
            text: `SELECT id, TRIM(subtitles_name) as subtitles_name, TRIM(translated_name) as translated_name, articles_id, order_number FROM public.subtitles where id = $1`,
            values: [subtitleId],
        }

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return false
            
            const contents: Array<IContent> = await this.getContentBySubtitleId(result.rows[0].id);
            const media: Array<DbMedia> = await this.getMediaBySubtitleId(result.rows[0].id);
            
            const subtitle: SubTitleContent = {
                id: result.rows[0].id,
                name: result.rows[0].subtitles_name,
                orderNumber: result.rows[0].order_number,
                translatedName: result.rows[0].translated_name,
                content: contents.filter(content => content.contentLanguage === Languages.SPANISH),
                enContent: contents.filter(content => content.contentLanguage === Languages.ENGLISH),
                image: media[0]
            }

            return subtitle;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createContentForArticle(content: IContent): Promise<IContent> {
        const createContent = {
            name: 'create-new-content-for-article',
            text: 'INSERT INTO public.contents(content, selected, content_language, articles_id, type, words_count) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, TRIM(content) as content, selected, content_language, articles_id, subtitles_id, link, order_number, words_count, type',
            values: [content.content, content.selected, content.contentLanguage, content.articleId, content.type, content.wordsCount],
        }

        return await this.createContent(createContent);
    }

    async createContentForSubtitle(content: IContent): Promise<IContent> {
        const createContent = {
            name: 'create-new-content-for-subtitle',
            text: `INSERT INTO public.contents(content, selected, content_language, subtitles_id, link, order_number, words_count, type) VALUES ($1, $2, $3, $4, $5, $6, $7, 'paragraph') RETURNING id, TRIM(content) as content, selected, content_language, articles_id, subtitles_id, link, order_number, words_count, type`,
            values: [content.content, content.selected, content.contentLanguage, content.subtitleId, content.link, content.orderNumber, content.wordsCount],
        }

        return await this.createContent(createContent);
    }
    
    async createContent(createContent: Query): Promise<IContent> {
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

            let _content: IContent = {
                id: result.rows[0].id,
                content: result.rows[0].content,
                selected: result.rows[0].selected,
                contentLanguage: result.rows[0].content_language,
                articleId: result.rows[0].articles_id,
                subtitleId: result.rows[0].subtitles_id,
                link: result.rows[0].link,
                orderNumber: result.rows[0].order_number,
                wordsCount: result.rows[0].words_count,
                type: result.rows[0].type,
            }
            
            return _content;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getContentById(contentId: number): Promise<IContent | false> {
        const getQuery = {
            name: 'get-content-by-id',
            text: `SELECT id, TRIM(content) as content, selected, content_language, subtitles_id, articles_id, deleted, link, order_number, words_count, type FROM public.contents where id = $1`,
            values: [contentId],
        }

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return false
            
            const content: IContent = {
                id: result.rows[0].id,
                content: result.rows[0].content,
                selected: result.rows[0].selected,
                contentLanguage: result.rows[0].content_language,
                subtitleId: result.rows[0].subtitles_id,
                articleId: result.rows[0].articles_id,
                deleted: result.rows[0].deleted,
                link: result.rows[0].link,
                orderNumber: result.rows[0].order_number,
                wordsCount: result.rows[0].words_count,
                type: result.rows[0].type,
            }

            return content;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getContentByArticleId(articleId: number): Promise<Array<IContent>> {
        const getQuery = {
            name: 'get-contents-by-articleid',
            text:  `
                SELECT id, selected, content_language, link, order_number, words_count, articles_id, deleted, deleted_by, deleted_at, TRIM(content) as content, type
                FROM public.contents
                WHERE deleted IS NOT true AND articles_id = $1
            `,
            values: [articleId]
        };

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return []
            
            const contents: Array<IContent> = []

            result.rows.forEach(row => {
                contents.push({
                    id: row.id,
                    selected: row.selected,
                    content: row.content,
                    contentLanguage: row.content_language,
                    link: row.link,
                    orderNumber: row.order_number,
                    wordsCount: row.words_count,
                    articleId: row.article_id,
                    type: row.type,
                    deleted: row.deleted,
                })
            });
            return contents;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getContentBySubtitleId(subtitleId: number): Promise<Array<IContent>> {
        const getQuery = {
            name: 'get-contents-by-subtitle',
            text:  `
                SELECT id, selected, content_language, link, order_number, words_count, subtitles_id, articles_id, deleted, deleted_by, deleted_at, TRIM(content) as content
                FROM public.contents
                WHERE deleted IS NOT true AND subtitles_id = $1
            `,
            values: [subtitleId]
        };

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return []
            
            const contents: Array<IContent> = []

            result.rows.forEach(row => {
                contents.push({
                    id: row.id,
                    selected: row.selected,
                    content: row.content,
                    contentLanguage: row.content_language,
                    link: row.link,
                    orderNumber: row.order_number,
                    wordsCount: row.words_count,
                    subtitleId: row.subtitles_id,
                    deleted: row.deleted,
                })
            });
            return contents;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async saveArticleAfterTranslateKeywords(article: INewArticle): Promise<INewArticle> {
        try {
            const {id, internalId, subtitles} = article;
            let getById = await this.getArticleById(internalId);

            let savedArticle: INewArticle = null
            if(getById ===  false) {
                savedArticle = await this.createArticle(article);
                getById = await this.getArticleById(internalId);
            }
                
            //createSubtitle
            let savedSubtitles: Array<SubTitleContent> = []
            await Promise.all(subtitles.map(async (subtitle: SubTitleContent, index) => {
                subtitle.articleId = savedArticle.id
                savedSubtitles.push(await this.createSubtitle(subtitle));
            }));

            savedArticle.subtitles = savedSubtitles
            article = getById === false ? savedArticle : getById
            
            return article
        } catch (error) {
            throw new Error(error.message);
        }
    }


    async saveArticleAfterContentSearched(article: INewArticle): Promise<INewArticle> {
        try {
            const {id, internalId, subtitles} = article;
            let getById = await this.getArticleById(internalId);

            let savedArticle: INewArticle = null
            
            let savedContents: Array<IContent> = []
            await Promise.all(subtitles.map(async (subtitle: SubTitleContent, index) => {
                await Promise.all(subtitle.enContent.map(async (enContent: IContent) => {
                    const content: IContent = {
                        subtitleId: subtitle.id,
                        contentLanguage: Languages.ENGLISH,
                        selected: false,
                        content: `${enContent.content.charAt(0).toUpperCase()}${enContent.content.slice(1)}`
                    }
                    savedContents.push(await this.createContentForSubtitle(content));
                }));

                await Promise.all(subtitle.content.map(async (_content: string | IContent) => {
                    const __content = typeof _content === "string" ? _content : _content.content;
                    const content: IContent = {
                        subtitleId: subtitle.id,
                        contentLanguage: Languages.SPANISH,
                        selected: false,
                        content:  `${__content.charAt(0).toUpperCase()}${__content.slice(1)}`
                    }
                    savedContents.push(await this.createContentForSubtitle(content));
                }));
                
            }));

            savedArticle.subtitles.map(subtitle => ({
                ...subtitle, 
                content: savedContents.filter(content => content.subtitleId === subtitle.id && content.contentLanguage === Languages.SPANISH),
                contentEn: savedContents.filter(content => content.subtitleId === subtitle.id && content.contentLanguage === Languages.ENGLISH)
            }));
            
            // = savedSubtitles
            article = getById === false ? savedArticle : getById
            
            return article
        } catch (error) {
            throw new Error(error.message);
        } 
    }

    async saveSubtitleAfterContentSearched(subtitle: SubTitleContent): Promise<SubTitleContent> {
        try {
            const {content, enContent} = subtitle;
            
            let savedContents: Array<IContent> = []
            await Promise.all(enContent.map(async (enContent: IContent) => {
                if(enContent.content.length < Locals.config().MAX_PARAGRAPH_LENGTH){
                    savedContents.push(await this.createContentForSubtitle(enContent));    
                }
            }));

            await Promise.all(content.map(async (_content: IContent) => {
                if(_content.content.length < Locals.config().MAX_PARAGRAPH_LENGTH){
                    savedContents.push(await this.createContentForSubtitle(_content));
                }
            }));
                
            return {
                ...subtitle, 
                content: savedContents.filter(content => content.subtitleId === subtitle.id && content.contentLanguage === Languages.SPANISH),
                enContent: savedContents.filter(content => content.subtitleId === subtitle.id && content.contentLanguage === Languages.ENGLISH)
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteKeywordSelectedContent(contents: Array<IContent>, userId: number): Promise<boolean>{
        try {
            await Promise.all(contents.map(async (content: IContent) => {
                const updateDeleteContents = {
                    name: 'update-delete-content-for-subtitle',
                    text: 'UPDATE public.contents SET deleted=true, deleted_by=$2 WHERE id=$1;',
                    values: [content.id, userId],
                }
                try {
                    await Database.sqlToDB(updateDeleteContents);
                } catch (error) {
                    throw new Error(error.message);
                }
            }));

            return true;
            
        } catch (error) {
            Log.error(error.message)
            return false;
        }
    }

    async getKeywordSelectedContent(subtitleId: number): Promise<Array<IContent>>{
        try {
            const queryParams = {
                name: 'get-keyword-selected-content',
                text:  `
                    SELECT id, content_language, selected, TRIM(content) as content, deleted, subtitles_id, type, words_count
                    FROM public.contents
                    WHERE deleted IS NOT true AND selected = true AND subtitles_id = $1 
                `,
                values: [subtitleId]
            };

            return this.getSelectedContent(queryParams);
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getIntroSelectedContent(articleId: number): Promise<Array<IContent>>{
        try {
            const queryParams = {
                name: 'get-keyword-selected-content',
                text:  `
                    SELECT id, content_language, selected, TRIM(content) as content, deleted, articles_id, type, words_count, subtitles_id, order_number
                    FROM public.contents
                    WHERE deleted IS NOT true AND selected = true AND articles_id = $1 
                `,
                values: [articleId]
            };

            return this.getSelectedContent(queryParams);
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getSelectedContent(query: Query): Promise<Array<IContent>>{
        try {
            let result = null;
            try {
                result = await Database.sqlToDB(query);
                
                if (result.rows.length === 0)
                    return []
                
                const contents: Array<IContent> = []

                result.rows.forEach(row => {
                    contents.push({
                        id: row.id,
                        selected: row.selected,
                        content: row.content,
                        contentLanguage: row.content_language,
                        deleted: row.deleted,
                        type: row.type,
                        articleId: row.articles_id,
                        subtitleId: row.subtitles_id,
                        orderNumber: row.order_number,
                    })
                });
                return contents;
            } catch (error) {
                throw new Error(error.message);
            }
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async saveKeywordNewSelectedContent(contents: Array<IContent>): Promise<Array<IContent>> {
        try {
            const _contents: Array<IContent> = []
            await Promise.all(contents.map(async (content: IContent) => {
                if(content.content.length < 1900){
                    if(content.type === "paragraph"){
                        _contents.push(await this.createContentForSubtitle(content));
                    }else if(content.type === "conclusion" || content.type === "introduction"){
                        _contents.push(await this.createContentForArticle(content));
                    }
                }
            }));

            return _contents;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createMediaForArticle(media: DbMedia): Promise<DbMedia> {
        const createArticleImage = {
            name: 'create-article-image',
            text: 'INSERT INTO public.media(source_url, wp_id, article_id, title) VALUES ($1, $2, $3, $4) RETURNING id, TRIM(source_url) AS source_url, wp_id, article_id, title;',
            values: [media.source_url, media.wpId, media.articleId, media.title],
        }

        return await this.createMedia(createArticleImage);
    }

    async createMediaForSubtitle(media: DbMedia): Promise<DbMedia> {
        const createSubtitleImage = {
            name: 'create-subtitle-image',
            text: 'INSERT INTO public.media(source_url, wp_id, subtitle_id, title) VALUES ($1, $2, $3, $4) RETURNING id, TRIM(source_url) AS source_url, wp_id, subtitle_id, title;',
            values: [media.source_url, media.wpId, media.subtitleId, media.title],
        }

        return await this.createMedia(createSubtitleImage);
    }

    async createMedia(createMedia: Query): Promise<DbMedia> {
        try {
            let result = null, client = null;

            client = await Database.getTransaction();

            try {
                result = await Database.sqlExecSingleRow(client, createMedia);
                await Database.commit(client);
            } catch (error) {
                await Database.rollback(client);
                throw new Error(error);
            }

            let _media: DbMedia = {
                id: result.rows[0].id,
                source_url: result.rows[0].source_url,
                wpId: result.rows[0].wp_id,
                subtitleId: result.rows[0].subtitle_id,
                title: result.rows[0].title,
            }
            
            return _media;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getMediaBySubtitleId(subtitleId: number): Promise<Array<DbMedia>> {
        const getQuery = {
            name: 'get-media-by-subtitle',
            text:  `
                SELECT id, source_url, wp_id, subtitle_id, title 
                FROM public.media 
                WHERE deleted IS NOT true AND subtitle_id = $1;
            `,
            values: [subtitleId]
        };

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return []
            
            const media: Array<DbMedia> = []

            result.rows.forEach(row => {
                media.push({
                    id: row.id,
                    source_url: row.source_url,
                    wpId: row.wp_id,
                    subtitleId: row.subtitle_id,
                    title: row.title,
                })
            });
            return media;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getMediaByArticleId(articleId: number): Promise<Array<DbMedia>> {
        const getQuery = {
            name: 'get-media-by-article',
            text:  `
                SELECT id, source_url, wp_id, article_id, title 
                FROM public.media 
                WHERE deleted IS NOT true AND article_id = $1;
            `,
            values: [articleId]
        };

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return []
            
            const media: Array<DbMedia> = []

            result.rows.forEach(row => {
                media.push({
                    id: row.id,
                    source_url: row.source_url,
                    wpId: row.wp_id,
                    articleId: row.article_id,
                    title: row.title,
                })
            });
            return media;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateMedia(media: DbMedia): Promise<DbMedia> {
        try {
            const updateMedia = {
                name: 'update-image',
                text: 'UPDATE public.media SET title=$1 WHERE id = $2 RETURNING id, TRIM(source_url) AS source_url, wp_id, subtitle_id, title;',
                values: [media.title, media.id],
            }

            let result = null, client = null;

            client = await Database.getTransaction();

            try {
                result = await Database.sqlExecSingleRow(client, updateMedia);
                await Database.commit(client);
            } catch (error) {
                await Database.rollback(client);
                throw new Error(error);
            }

            let _media: DbMedia = {
                id: result.rows[0].id,
                source_url: result.rows[0].source_url,
                wpId: result.rows[0].wp_id,
                subtitleId: result.rows[0].subtitle_id,
                title: result.rows[0].title,
            }
            
            return _media;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteMedia(id: number, userId: number): Promise<DbMedia> {
        try {
            const updateMedia = {
                name: 'delete-image',
                text: 'UPDATE public.media SET deleted=true, deleted_by=$1 WHERE id = $2 RETURNING id, TRIM(source_url) AS source_url, wp_id, subtitle_id, title;',
                values: [userId, id],
            }

            let result = null, client = null;

            client = await Database.getTransaction();

            try {
                result = await Database.sqlExecSingleRow(client, updateMedia);
                await Database.commit(client);
            } catch (error) {
                await Database.rollback(client);
                throw new Error(error);
            }

            let _media: DbMedia = {
                id: result.rows[0].id,
                source_url: result.rows[0].source_url,
                wpId: result.rows[0].wp_id,
                subtitleId: result.rows[0].subtitle_id,
                title: result.rows[0].title,
            }
            
            return _media;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}