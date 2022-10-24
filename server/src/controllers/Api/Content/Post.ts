/**
 * Get the html body of a web page
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import { InternalErrorResponse, SuccessResponse } from '../../../core/ApiResponse';
import { IRequest, IResponse } from '../../../interfaces/vendors';
import { IPostService } from '../../../interfaces/wordpress/IPostService';
import Log from '../../../middlewares/Log';
import ExpressValidator from '../../../providers/ExpressValidation';
import PostService from '../../../services/wordpress/postService';
import IPost from "../../../interfaces/models/Post"
import Locals from '../../../providers/Locals';
import { ICategoryService } from '../../../interfaces/wordpress/ICategoryService';
import CategoryService from '../../../services/wordpress/categoryServices';

class Post {
    public static async create(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new SuccessResponse('Success', {
                    errors: errors.array()
                }).send(res);
            }

            let postService: IPostService = new PostService();
            let categoryService: ICategoryService = new CategoryService();

            const title: string = req.body.title;
            const content: string = req.body.content;
            const bodyCategory: string = req.body.category;

            const categoryId: number = (await categoryService.getList()).find(category => category.name === bodyCategory).id


            const post: IPost = {
                slug: title.replace(" ", "_"),
                status: "DRAFT",
                password: Locals.config().WORDPRESS_USER_PASSWORD,
                title: title,
                content: content,
                author: Locals.config().WORDPRESS_USER,
                excerpt: "",
                featured_media: "",
                comment_status: "",
                ping_status: "",
                format: "",
                meta: "",
                sticky: "",
                template: "",
                categories: categoryId.toString(),
                tags: "",
            };

            const created = await postService.create(post)

            return new SuccessResponse('Success', {
                post: created,
                success: true,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Page Source Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }
}

export default Post;