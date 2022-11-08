import Category from "../../interfaces/models/Category";
import { ICategoryService } from "../../interfaces/wordpress/ICategoryService";
import Locals from "../../providers/Locals";
import { axios } from "../../utils";

export default class categoryService implements ICategoryService {

    async getList(): Promise<Array<Category>> {
        const response = await axios({ url: `${Locals.config().wordpressUrl}categories` });
        return response.body
    }

    async create(category: Category, token: string): Promise<any> {
        category.meta = []
        category.parent = 0
        const result = await axios({
            url: `${Locals.config().wordpressUrl}categories`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
                'cache-control': 'no-cache',
            },
            body: JSON.stringify(category)
        });
        return result;
    }

    async update(category: Category, token: string): Promise<any> {
        const result = await axios({
            url: `${Locals.config().wordpressUrl}categories/${category.id}`,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token,
                'cache-control': 'no-cache',
            },
            body: JSON.stringify(category)
        });
        return result;
    }
}