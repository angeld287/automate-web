import { INewArticle } from "../../interfaces/Content/Article";
import { IArticleService } from "../../interfaces/IArticleService";
import Category from "../../interfaces/models/Category";
import { ICategoryService } from "../../interfaces/wordpress/ICategoryService";
import Database from "../../providers/Database";
import Locals from "../../providers/Locals";
import { axios, fetch } from "../../utils";
import { articleService } from "../articleServices/articleServices";

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

    async getList(siteId: number): Promise<Array<Category> | false> {

        const getQuery = {
            name: 'get-categories',
            text: `SELECT id, name, wp_id, site_id FROM public.categories where site_id = $1;`,
            values: [siteId],
        }

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return false

            const categories: Array<Category> = []

            await Promise.all(result.rows.map(async (row, index) => {
                let _articleService: IArticleService = new articleService();
                const articles: false | Array<INewArticle> = await _articleService.getArticlesByCategory(row.name.trim(), siteId);
                
                categories.push({
                    id: row.id,
                    name: row.name.trim(),
                    wpId: row.wp_id,
                    count: articles !== false ? articles.length : 0,
                    siteId: row.site_id,
                })
            }));


            return categories;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getCategoryById(id: number, siteId: number): Promise<Category | false> {

        const getQuery = {
            name: 'get-category-by-id',
            text: `SELECT id, name, wp_id, site_id FROM public.categories where id = $1;`,
            values: [id],
        }

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return false

            let _articleService: IArticleService = new articleService();
            const articles: false | Array<INewArticle> = await _articleService.getArticlesByCategory(result.rows[0].name.trim(), siteId);
            
            const category: Category = {
                id: result.rows[0].id,
                name: result.rows[0].name.trim(),
                wpId: result.rows[0].wp_id,
                count: articles !== false ? articles.length : 0,
                siteId: result.rows[0].siteId,
            }

            return category;
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
                text: 'INSERT INTO public.categories(name, wp_id, site_id) VALUES ($1, $2, $3) RETURNING name, wp_id, site_id;',
                values: [category.name, category.wpId, category.siteId],
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
                wpId: result.rows[0].wp_id,
                siteId: result.rows[0].site_id
            }
            
            return _subtitle;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }
}