import Category from "../models/Category";

export interface ICategoryService {
    getList(): Promise<Array<Category>>

    create(category: Category): Promise<Category>;
}