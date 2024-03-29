/**
 * Manage all the databases methods for articles, contents and subtitles.
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import { BadRequestResponse, InternalErrorResponse, SuccessResponse } from '../../../core/ApiResponse';
import { INewArticle, SubTitleContent } from '../../../interfaces/Content/Article';
import { IArticleService } from '../../../interfaces/IArticleService';
import { ITranslateService } from '../../../interfaces/ITranslateService';
import IContent from '../../../interfaces/models/Content';
import { ITranslateItem } from '../../../interfaces/Utils';
import { INext, IRequest, IResponse } from '../../../interfaces/vendors';

import Log from '../../../middlewares/Log';
import ExpressValidator, { ValidateErrors } from '../../../providers/ExpressValidation';
import { articleService } from '../../../services/articleServices/articleServices';
import { translateService } from '../../../services/translation/translateService';


class Article {

    public static async createSubtitle(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(ValidateErrors.validate(req, res) !== true) return

            let _articleService: IArticleService = new articleService();
            
            const name = req.body.name;
            const translatedName = req.body.translatedName;
            const articleId = req.body.articleId;
            const orderNumber = req.body.orderNumber;

            let subtitle: SubTitleContent = {
                name,
                translatedName,
                articleId,
                orderNumber
            }

            const article: INewArticle | false = await _articleService.getArticleById(articleId)

            if(!article){
                return new BadRequestResponse('Error', {
                    error: "The article does not exist."
                }).send(res);
            }
            
            subtitle = await _articleService.createSubtitle(subtitle);

            return new SuccessResponse('Success', {
                success: true,
                response: subtitle,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Create Subtitle - Article Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    static async createEnSubtitle(req: IRequest, res: IResponse, next: INext): Promise<any> {
        try {

            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            let translate: ITranslateService = new translateService();
            let contentService: IArticleService = new articleService();
            
            const { name, articleId } = req.body;
            const article: INewArticle | false = await contentService.getArticleById(articleId)

            if(!article){
                return new BadRequestResponse('Error', {
                    error: "The article does not exist."
                }).send(res);
            }

            const translatedName = await translate.perform(name, 'en', 'es');
            const exisitingSubtitles = await contentService.getSubtitlesByArticleId(article.id);
            const orderNumber = exisitingSubtitles.length;

            const subtitle = await contentService.createSubtitle({
                name: translatedName.body[0]['translations'][0].text,
                orderNumber,
                translatedName: name,
                articleId: article.id
            });

            return new SuccessResponse('Success', {
                response: subtitle,
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Validation Error', {
                error: 'Internal Server Error',
            }).send(res);
        }

    }

    public static async getSubtitleById(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(!req.query.id){
                return new BadRequestResponse('Error', {
                    error: "Param id are required."
                }).send(res);
            }
            
            let _articleService: IArticleService = new articleService();

            const id = req.query.id;

            const subtitle: SubTitleContent | false = await _articleService.getSubtitleById(parseInt(id.toString()))

            return new SuccessResponse('Success', {
                success: true,
                response: {
                    subtitle
                },
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Get Article - Article Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async createArticle(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(ValidateErrors.validate(req, res) !== true) return

            let _articleService: IArticleService = new articleService();
            
            const {title, category, translatedTitle, sysState, jobId, siteId } = req.body;
            
            const userId = req.session.passport.user.id;

            let article: INewArticle = {
                title,
                category,
                subtitles: [],
                sysState,
                translatedTitle,
                createdBy: parseInt(userId),
                createdAt: (new Date()).toString(),
                jobId,
                siteId
            }
            
            article = await _articleService.createArticle(article);

            return new SuccessResponse('Success', {
                success: true,
                response: article,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Create Article - Article Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async getArticle(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(!req.query.id){
                return new BadRequestResponse('Error', {
                    error: "Param id are required."
                }).send(res);
            }
            
            let _articleService: IArticleService = new articleService();

            const id = req.query.id;

            const article: INewArticle | false = await _articleService.getArticleById(parseInt(id.toString()))

            return new SuccessResponse('Success', {
                success: true,
                response: {
                    article
                },
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Get Article - Article Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async getArticlesByCategory(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(!req.query.category){
                return new BadRequestResponse('Error', {
                    error: "Param category are required."
                }).send(res);
            }

            if(!req.query.siteId){
                return new BadRequestResponse('Error', {
                    error: "Param siteId are required."
                }).send(res);
            }
            
            let _articleService: IArticleService = new articleService();

            const { category, siteId} = req.query;

            const articles: Array<INewArticle> | false = await _articleService.getArticlesByCategory(category.toString().toLocaleLowerCase(), parseInt(siteId.toString()));

            return new SuccessResponse('Success', {
                success: true,
                response: articles,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('getArticlesByCategory - Article Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async getPlanningArticles(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(!req.query.id){
                return new BadRequestResponse('Error', {
                    error: "Param id is required."
                }).send(res);
            }

            if(!req.query.siteId){
                return new BadRequestResponse('Error', {
                    error: "Param siteId is required."
                }).send(res);
            }
            
            let _articleService: IArticleService = new articleService();

            const { id, siteId} = req.query;
            const jobId = parseInt(id.toString());
            const userId = parseInt(req.session.passport.user.id);

            const articles: Array<INewArticle> | false = await _articleService.getPlanningArticles(jobId, userId, parseInt(siteId.toString()))

            return new SuccessResponse('Success', {
                success: true,
                response: articles,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('getPlanningArticles - Article Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async getAIResearchedArticles(req: IRequest, res: IResponse): Promise<any> {
        try {

            if(!req.query.siteId){
                return new BadRequestResponse('Error', {
                    error: "Param siteId is required."
                }).send(res);
            }

            const { siteId } = req.query;

            let _articleService: IArticleService = new articleService();

            const userId = parseInt(req.session.passport.user.id);

            const articles: Array<INewArticle> | false = await _articleService.getAIResearchedArticles(userId, parseInt(siteId.toString()))

            return new SuccessResponse('Success', {
                success: true,
                response: articles,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('getAIResearchedArticles - Article Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async getWpCreatedArticles(req: IRequest, res: IResponse): Promise<any> {
        try {

            if(!req.query.siteId){
                return new BadRequestResponse('Error', {
                    error: "Param siteId is required."
                }).send(res);
            }

            const { siteId } = req.query;

            let _articleService: IArticleService = new articleService();

            const userId = parseInt(req.session.passport.user.id);

            const articles: Array<INewArticle> | false = await _articleService.getCreatedArticles(userId, parseInt(siteId.toString()))

            return new SuccessResponse('Success', {
                success: true,
                response: articles,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('getWpCreatedArticles - Article Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async getArticles(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(!req.query.page || !req.query.size){
                return new BadRequestResponse('Error', {
                    error: "Params page and size are required."
                }).send(res);
            }

            if(!req.query.siteId){
                return new BadRequestResponse('Error', {
                    error: "Param siteId are required."
                }).send(res);
            }
            
            const { category, siteId, size, page} = req.query;
            
            let _articleService: IArticleService = new articleService();

            const articles: Array<INewArticle> | boolean = await _articleService.getArticles(parseInt(page.toString()), parseInt(size.toString()), parseInt(req.session.passport.user.id), parseInt(siteId.toString()))

            return new SuccessResponse('Success', {
                success: true,
                response: {
                    page,
                    size,
                    articles
                },
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Get Articles - Article Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async createContentForArticle(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(ValidateErrors.validate(req, res) !== true) return

            let _articleService: IArticleService = new articleService();

            let contents: Array<IContent> = req.body.content
            const articleId = contents[0].articleId;

            const article: INewArticle | false = await _articleService.getArticleById(articleId)

            if(!article){
                return new BadRequestResponse('Error', {
                    error: "The article does not exist."
                }).send(res);
            }
            
            const userId = req.session.passport.user.id;
            const existingContent: Array<IContent> = (await _articleService.getIntroSelectedContent(article.id)).filter(content => content.type.trim() === contents[0].type.trim());

            if(existingContent.length > 0){
                await _articleService.deleteKeywordSelectedContent(existingContent, parseInt(userId));
            }

            contents = contents.map(content => ({...content, articleId: article.id}))

            const createdContents = await _articleService.saveKeywordNewSelectedContent(contents);

            return new SuccessResponse('Success', {
                success: true,
                response: createdContents,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Create Content - Article Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async createEnContentForArticle(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(ValidateErrors.validate(req, res) !== true) return

            let _articleService: IArticleService = new articleService();
            let translate: ITranslateService = new translateService();

            let contents: Array<IContent> = req.body.content
            const articleId = contents[0].articleId;

            const article: INewArticle | false = await _articleService.getArticleById(articleId)

            if(!article){
                return new BadRequestResponse('Error', {
                    error: "The article does not exist."
                }).send(res);
            }
            
            const userId = req.session.passport.user.id;
            const existingContent: Array<IContent> = (await _articleService.getIntroSelectedContent(article.id)).filter(content => content.type.trim() === contents[0].type.trim());

            if(existingContent.length > 0){
                await _articleService.deleteKeywordSelectedContent(existingContent, parseInt(userId));
            }

            contents = contents.map(content => ({...content, articleId: article.id}))

            //translate content

            const translateItems: Array<ITranslateItem> = [
                ...contents.map((content): ITranslateItem => ({Text: content.content, id: content.orderNumber.toString()}))
            ];

            const translationResult = await translate.translateMultipleTexts(translateItems, 'en', 'es');

            if(!translationResult.success){
                return new InternalErrorResponse('translateKeywords - axios request Error', {
                    error: 'Internal Server Error',
                }).send(res);
            }
            
            const translations: Array<ITranslateItem> = translationResult.body.map((result): ITranslateItem => ({...result.translations[0]})) 
            
            contents.forEach((content, index) => {
                content.content = translations[index].text;
            });

            // create content

            const createdContents = await _articleService.saveKeywordNewSelectedContent(contents);

            return new SuccessResponse('Success', {
                success: true,
                response: createdContents,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Create Content - Article Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async createContentForSubtitle(req: IRequest, res: IResponse): Promise<any> {
        try {

            if(ValidateErrors.validate(req, res) !== true) return

            let _articleService: IArticleService = new articleService();
            
            const contents: Array<IContent> = req.body.content;
            const subtitleId = contents[0].subtitleId;
            
            const subtitle: SubTitleContent | boolean = await _articleService.getSubtitleById(subtitleId)

            if(!subtitle){
                return new BadRequestResponse('Error', {
                    error: "The subtitle does not exist."
                }).send(res);
            }

            const userId = req.session.passport.user.id;
            const existingContent: Array<IContent> = await _articleService.getKeywordSelectedContent(subtitleId);

            if(existingContent.length > 0){
                await _articleService.deleteKeywordSelectedContent(existingContent, parseInt(userId));
            }

            const createdContents = await _articleService.saveKeywordNewSelectedContent(contents);

            return new SuccessResponse('Success', {
                success: true,
                response: createdContents,
                error: null,
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Create Content for subtitle - Article Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async createEnContentForSubtitle(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(ValidateErrors.validate(req, res) !== true) return

            let _articleService: IArticleService = new articleService();
            let translate: ITranslateService = new translateService();
            
            const contents: Array<IContent> = req.body.content;
            const subtitleId = contents[0].subtitleId;
            
            const subtitle: SubTitleContent | boolean = await _articleService.getSubtitleById(subtitleId)

            if(!subtitle){
                return new BadRequestResponse('Error', {
                    error: "The subtitle does not exist."
                }).send(res);
            }

            const userId = req.session.passport.user.id;
            const existingContent: Array<IContent> = await _articleService.getKeywordSelectedContent(subtitleId);

            if(existingContent.length > 0){
                await _articleService.deleteKeywordSelectedContent(existingContent, parseInt(userId));
            }

            //translate content

            const translateItems: Array<ITranslateItem> = [
                ...contents.map((content): ITranslateItem => ({Text: content.content, id: content.orderNumber.toString()}))
            ];

            const translationResult = await translate.translateMultipleTexts(translateItems, 'en', 'es');

            if(!translationResult.success){
                return new InternalErrorResponse('translateKeywords - axios request Error', {
                    error: 'Internal Server Error',
                }).send(res);
            }
            
            const translations: Array<ITranslateItem> = translationResult.body.map((result): ITranslateItem => ({...result.translations[0]})) 
            
            contents.forEach((content, index) => {
                content.content = translations[index].text;
            });

            // create content
            const createdContents = await _articleService.saveKeywordNewSelectedContent(contents);

            return new SuccessResponse('Success', {
                success: true,
                response: createdContents,
                error: null,
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Create En Content for subtitle - Article Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async updateArticleTitle(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(ValidateErrors.validate(req, res) !== true) return

            let _articleService: IArticleService = new articleService();
            
            const id = req.body.id;
            const title = req.body.title;

            let article = await _articleService.getArticleByDbId(id)

            if(article === false){
                return new BadRequestResponse('Error', {
                    error: "Article not found."
                }).send(res);
            }
            
            article.title = title;
            article = await _articleService.updateArticle(article)

            return new SuccessResponse('Success', {
                success: true,
                response: article,
                error: null
            }).send(res);
        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Keywords Controller Error - updateArticleTitle', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async updateArticleState(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(ValidateErrors.validate(req, res) !== true) return

            let _articleService: IArticleService = new articleService();
            
            const id = req.body.id;
            const state = req.body.state;

            let article = await _articleService.getArticleByDbId(id)

            if(article === false){
                return new BadRequestResponse('Error', {
                    error: "Article not found."
                }).send(res);
            }
            
            article.sysState = state;
            article = await _articleService.updateArticle(article)

            return new SuccessResponse('Success', {
                success: true,
                response: article,
                error: null
            }).send(res);
        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Keywords Controller Error - updateArticleState', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async deleteSubtitle(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(ValidateErrors.validate(req, res) !== true) return

            let _articleService: IArticleService = new articleService();
            
            const id = req.body.id;

            let subtitle = await _articleService.getSubtitleById(id);

            if(subtitle === false){
                return new BadRequestResponse('Error', {
                    error: "Subtitle not found."
                }).send(res);
            }
            
            subtitle.deleted = true;
            subtitle = await _articleService.updateSubtitle(subtitle);

            return new SuccessResponse('Success', {
                success: true,
                response: subtitle,
                error: null
            }).send(res);
        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Keywords Controller Error - deleteSubtitle', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }
}

export default Article