/**
 * Get the html body of a web page
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import { BadRequestResponse, InternalErrorResponse, SuccessResponse } from '../../../core/ApiResponse';
import { IRequest, IResponse } from '../../../interfaces/vendors';
import { IPostService } from '../../../interfaces/wordpress/IPostService';
import Log from '../../../middlewares/Log';
import ExpressValidator from '../../../providers/ExpressValidation';
import PostService from '../../../services/wordpress/postService';
import IPost from "../../../interfaces/models/Post"
import { ICategoryService } from '../../../interfaces/wordpress/ICategoryService';
import CategoryService from '../../../services/wordpress/categoryServices';
import { INewArticle } from '../../../interfaces/Content/Article';
import Category from '../../../interfaces/models/Category';
import createContent from '../../../utils/ContentStructure';
import { generateArticleSlug, removeAccentMark } from '../../../utils';
import { IArticleService } from '../../../interfaces/IArticleService';
import { articleService } from '../../../services/articleServices/articleServices';
import { ArticleState } from '../../../interfaces/Enums/States';

class Post {
    public static async create(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            let postService: IPostService = new PostService();
            let _articleService: IArticleService = new articleService();
            let categoryService: ICategoryService = new CategoryService();

            let article: INewArticle = req.body.article as INewArticle;
            const bodyCategory: string = removeAccentMark(article.category.trim().toLowerCase());

            //!(article.subtitles.filter(subtitle => !subtitle.image).length > 2)
            if(!article.image){
                return new BadRequestResponse('Error', {
                    error: true,
                    message: 'The article needs at least 3 images.',
                }).send(res); 
            }

            const articleExist = await _articleService.getArticleById(article.internalId);

            if(articleExist === false){
                return new BadRequestResponse('Error', {
                    error: true,
                    message: 'The article does not exist.',
                }).send(res); 
            }else{
                article = articleExist
            }

            const categories = await categoryService.getList();
            
            if(categories === false){
                return new BadRequestResponse('Error', {
                    error: true,
                    message: 'There are no categories in the db.',
                }).send(res);
            }

            const category: Category = categories.find(category => {
                return removeAccentMark(category.name.toLowerCase()) === bodyCategory
            })
            
            if (!category){
                return new BadRequestResponse('Error', {
                    error: true,
                    message: 'The category does not exist.',
                }).send(res);
            }

            const content: string = createContent(article);
            const post: IPost = {
                slug: generateArticleSlug(article),
                status: "draft",
                title: article.title,
                content: content,
                categories: [category.wpId],
            };

            const created = await postService.createNf(post, req.headers.authorization)
            
            if(created !== false){

                const dbArticle = await _articleService.getArticleById(article.internalId);

                if(dbArticle !== false){
                    dbArticle.wpId = created.id;
                    dbArticle.wpLink = created.link;
                    dbArticle.sysState = ArticleState.CREATED_IN_WP;
                    
                    const updateArticle = await _articleService.updateArticle(dbArticle)
    
                    if(updateArticle !== false){
                        return new SuccessResponse('Success', {
                            article: dbArticle,
                            success: true,
                            error: null
                        }).send(res);
                    }else{
                        return new InternalErrorResponse('Error', {
                            post: null,
                            success: false,
                            error: 'Post Create - Error updateArticle the article to add the wpId'
                        }).send(res);    
                    }
                }else{
                    return new InternalErrorResponse('Error', {
                        post: null,
                        success: false,
                        error: 'Post Create - Error updateArticle the article was not found!'
                    }).send(res);   
                }
            }else{
                return new InternalErrorResponse('Error', {
                    post: null,
                    success: false,
                    error: 'Post Create - Error creating the post'
                }).send(res);
            }
        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Post Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }
}

export default Post;