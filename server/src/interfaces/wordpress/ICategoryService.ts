import Category from "../models/Category";

export interface ICategoryService {
    getList(): Promise<Array<Category>>;

    create(category: Category, token: string): Promise<Category>;
    
    createNF(category: Category, token: string): Promise<Category>;

    update(category: Category, token: string): Promise<Category>;
}