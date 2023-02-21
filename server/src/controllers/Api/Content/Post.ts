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
import Locals from '../../../providers/Locals';
import { ICategoryService } from '../../../interfaces/wordpress/ICategoryService';
import CategoryService from '../../../services/wordpress/categoryServices';
import { INewArticle } from '../../../interfaces/Content/Article';
import Category from '../../../interfaces/models/Category';
import createContent from '../../../utils/ContentStructure';
import { replaceSpace } from '../../../utils';

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
            let categoryService: ICategoryService = new CategoryService();

            const article: INewArticle = req.body.article as INewArticle;
            const title: string = article.title;
            const content: string = createContent(article);
            const bodyCategory: string = article.category.trim().toLowerCase();
            
            const category: Category = (await categoryService.getList()).find(category => category.name.toLowerCase() === bodyCategory)

            if (!category){
                return new BadRequestResponse('Error', {
                    error: true,
                    message: 'The category does not exist.',
                }).send(res);
            }

            const post: IPost = {
                slug: replaceSpace(article.title),
                status: "draft",
                title: article.title,
                content: content,
                categories: [category.id],
            };

            const created = await postService.createNf(post, req.headers.authorization)

            return new SuccessResponse('Success', {
                post: created,
                success: true,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Post Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }
}

export default Post;