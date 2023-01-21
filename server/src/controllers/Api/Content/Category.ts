/**
 * Get the html body of a web page
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import { BadRequestResponse, InternalErrorResponse, SuccessResponse } from '../../../core/ApiResponse';
import { IRequest, IResponse } from '../../../interfaces/vendors';
import { ICategoryService } from '../../../interfaces/wordpress/ICategoryService';
import Log from '../../../middlewares/Log';
import ExpressValidator from '../../../providers/ExpressValidation';
import categoryService from '../../../services/wordpress/categoryServices';
import ICategory from '../../../interfaces/models/Category'

class Category {
    public static async create(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            let _categoryService: ICategoryService = new categoryService();
            const name = req.body.name
            const description = req.body.description
            let category: ICategory = {
                name,
                description,
                slug: name.replace(" ", "_").toLowerCase(),
            };

            category = await _categoryService.create(category, req.headers.authorization)

            return new SuccessResponse('Success', {
                success: true,
                response: category,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Create Category Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
     }

    public static async update(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            let _categoryService: ICategoryService = new categoryService();
            const id = req.body.id
            const name = req.body.name
            const description = req.body.description
            let category: ICategory = {
                id,
                name,
                description,
                slug: name.replace(" ", "_").toLowerCase(),
            };

            category = await _categoryService.update(category, req.headers.authorization)

            return new SuccessResponse('Success', {
                success: true,
                response: category,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Update Category Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async getCategoryList(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            let _categoryService: ICategoryService = new categoryService();
            const categories = await _categoryService.getList();

            return new SuccessResponse('Success', {
                success: true,
                response: categories,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('get Category List Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }
}

export default Category