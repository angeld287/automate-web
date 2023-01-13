import { INewArticle, SubTitleContent } from "./Content/Article";
import IContent from "./models/Content";

export interface IArticleService {

    createSubtitle(subtitle: SubTitleContent): Promise<SubTitleContent>

    createArticle(article: INewArticle): Promise<INewArticle>

    getArticles(page: number, size: number): Promise<Array<INewArticle> | boolean>

    getArticleById(articleId: number): Promise<INewArticle | boolean>

    getSubtitleById(subtitleId: number): Promise<SubTitleContent | boolean>

    createContextForArticle(content: IContent): Promise<IContent>;

    createContextForSubtitle(content: IContent): Promise<IContent>;

}