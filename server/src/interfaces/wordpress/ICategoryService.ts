import Category from "../models/Category";

export interface ICategoryService {
    getList(siteId: number): Promise<Array<Category> | false>;

    getListWp(): Promise<Array<Category>>;

    create(category: Category, token: string): Promise<Category>;
    
    createNF(category: Category, token: string): Promise<Category>;

    createCategory(category: Category): Promise<Category>;

    update(category: Category, token: string): Promise<Category>;

    getCategoryById(id: number, siteId: number): Promise<Category | false>
}