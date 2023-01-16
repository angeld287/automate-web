/**
 * Manage all the databases methods for articles, contents and subtitles.
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import { BadRequestResponse, InternalErrorResponse, SuccessResponse } from '../../../core/ApiResponse';
import { INewArticle, SubTitleContent } from '../../../interfaces/Content/Article';
import { IArticleService } from '../../../interfaces/IArticleService';
import IContent from '../../../interfaces/models/Content';
import { IRequest, IResponse } from '../../../interfaces/vendors';

import Log from '../../../middlewares/Log';
import { ValidateErrors } from '../../../providers/ExpressValidation';
import { articleService } from '../../../services/articleServices/articleServices';


class Article {

    public static async createSubtitle(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(ValidateErrors.validate(req, res) !== true) return

            let _articleService: IArticleService = new articleService();
            
            const name = req.body.name;
            const translatedName = req.body.translatedName;
            const articleId = req.body.articleId;            

            let subtitle: SubTitleContent = {
                name,
                translatedName,
                articleId
            }

            const article: INewArticle | boolean = await _articleService.getArticleById(articleId)

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

    public static async createArticle(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(ValidateErrors.validate(req, res) !== true) return

            let _articleService: IArticleService = new articleService();
            
            const title = req.body.title;
            const category = req.body.category;
            const translatedTitle = req.body.translatedTitle;  
            const userId = req.session.passport.user.id;     

            let article: INewArticle = {
                title,
                category,
                subtitles: [],
                translatedTitle,
                createdBy: parseInt(userId),
                createdAt: (new Date()).toString()
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

    public static async getArticles(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(!req.query.page || !req.query.size){
                return new BadRequestResponse('Error', {
                    error: "Fields page and size are required."
                }).send(res);
            }
            
            let _articleService: IArticleService = new articleService();

            const size = req.query.size;
            const page = req.query.page;

            const articles: Array<INewArticle> | boolean = await _articleService.getArticles(parseInt(page.toString()), parseInt(size.toString()), parseInt(req.session.passport.user.id))

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
            
            const _content = req.body.content;
            const selected = req.body.selected;
            const contentLanguage = req.body.contentLanguage;
            const articleId = req.body.articleId;
            

            let content: IContent = {
                content: _content,
                selected,
                contentLanguage,
                articleId
            };

            const article: INewArticle | boolean = await _articleService.getArticleById(articleId)

            if(!article){
                return new BadRequestResponse('Error', {
                    error: "The article does not exist."
                }).send(res);
            }
            
            content = await _articleService.createContextForArticle(content);

            return new SuccessResponse('Success', {
                success: true,
                response: content,
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
            
            const _content = req.body.content;
            const selected = req.body.selected;
            const contentLanguage = req.body.contentLanguage;
            const subtitleId = req.body.subtitleId;
            

            let content: IContent = {
                content: _content,
                selected,
                contentLanguage,
                subtitleId
            };

            const subtitle: SubTitleContent | boolean = await _articleService.getSubtitleById(subtitleId)

            if(!subtitle){
                return new BadRequestResponse('Error', {
                    error: "The subtitle does not exist."
                }).send(res);
            }

            content = await _articleService.createContextForSubtitle(content);

            return new SuccessResponse('Success', {
                success: true,
                response: content,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Create Content - Article Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
     }
}

export default Article