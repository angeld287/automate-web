import IContent from "./models/Content";

export interface IArticleService {

    createContent(content: IContent): Promise<IContent>;

}