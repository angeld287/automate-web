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
            const { name, siteId } = req.body;
            //const description = req.body.description
            let category: ICategory = {
                name,
                //description,
                slug: name.replace(" ", "_").toLowerCase(),
                siteId,
            };

            category = await _categoryService.createNF(category, req.headers.authorization)

            category = await _categoryService.createCategory({
                name,
                wpId: category.id,
                slug: category.slug,
                siteId
            })
            

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

            const { id, name, description, siteId } = req.body;
            let _categoryService: ICategoryService = new categoryService();
            let category = await _categoryService.getCategoryById(id, siteId)
            
            if(category !== false){
                category.name = name;
                category.description = description;
                category = await _categoryService.update(category, req.headers.authorization)
            }else{
                return new BadRequestResponse('Error', {
                    error: 'Category not found.'
                }).send(res);
            }

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

            const siteId = req.query.siteId;

            if(siteId === undefined){
                return new BadRequestResponse('Error', {
                    error: 'You must provide the siteId in query string params'
                }).send(res);
            }

            let _categoryService: ICategoryService = new categoryService();
            const categories = await _categoryService.getList(parseInt(siteId.toString()));

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