import Category from "../../interfaces/models/Category";
import { ICategoryService } from "../../interfaces/wordpress/ICategoryService";
import Database from "../../providers/Database";
import Locals from "../../providers/Locals";
import { axios, fetch } from "../../utils";

export default class categoryService implements ICategoryService {

    async getListWp(): Promise<Array<Category>> {
        let response = await fetch(`${Locals.config().wordpressUrl}categories`);
        let resultList = response.body
        let page = 2;
        while(response.body.length === 10){
            response = await fetch(`${Locals.config().wordpressUrl}categories?page=${page}`);
            page++;
            resultList = [...resultList, ...response.body]
        }
        return resultList;
    }

    async getList(): Promise<Array<Category> | false> {

        const getQuery = {
            name: 'get-categories',
            text: `SELECT id, name, wp_id FROM public.categories;`,
            values: [],
        }

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return false

            const categories: Array<Category> = []
        
            result.rows.forEach(row => {
                categories.push({
                    id: row.id,
                    name: row.name,
                    wpId: row.wp_id,
                })
            });

            return categories;
        } catch (error) {
            throw new Error(error.message);
        }
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
        console.log(result);

        return result;
    }

    async createNF(category: Category, token: string): Promise<any> {
        category.meta = []
        category.parent = 0
        const result = await fetch(`${Locals.config().wordpressUrl}categories`, {
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

    async createCategory(category: Category): Promise<Category> {
        try {
            const createSubtitle = {
                name: 'create-new-category',
                text: 'INSERT INTO public.categories(name, wp_id) VALUES (?, ?) RETURNING name, wp_id;',
                values: [category.name, category.wpId],
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

            let _subtitle: Category = {
                id: result.rows[0].id,
                name: result.rows[0].name,
                wpId: result.rows[0].wp_id
            }
            
            return _subtitle;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }
}