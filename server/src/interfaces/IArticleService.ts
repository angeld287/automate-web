import { INewArticle, SubTitleContent } from "./Content/Article";
import IContent from "./models/Content";
import { DbMedia } from "./models/Media";

export interface IArticleService {

    createSubtitle(subtitle: SubTitleContent): Promise<SubTitleContent>

    createArticle(article: INewArticle): Promise<INewArticle>

    getArticles(page: number, size: number, userId: number): Promise<Array<INewArticle> | boolean>

    getArticleById(articleId: number): Promise<INewArticle | false>

    getSubtitleById(subtitleId: number): Promise<SubTitleContent | false>

    createContextForArticle(content: IContent): Promise<IContent>;

    createContextForSubtitle(content: IContent): Promise<IContent>;

    saveArticleAfterTranslateKeywords(article: INewArticle): Promise<INewArticle>;

    saveArticleAfterContentSearched(article: INewArticle): Promise<INewArticle>;

    saveSubtitleAfterContentSearched(subtitle: SubTitleContent): Promise<SubTitleContent>;

    deleteKeywordSelectedContent(contents: Array<IContent>, userId: number): Promise<boolean>;

    getKeywordSelectedContent(subtitleId: number): Promise<Array<IContent>>;

    saveKeywordNewSelectedContent(contents: Array<IContent>): Promise<Array<IContent>>;

    createMediaForArticle(media: DbMedia): Promise<DbMedia>;

    createMediaForSubtitle(media: DbMedia): Promise<DbMedia>;

    getMediaBySubtitleId(subtitleId: number): Promise<Array<DbMedia>>;

    getMediaByArticleId(articleId: number): Promise<Array<DbMedia>>;

    updateMedia(media: DbMedia): Promise<DbMedia>;

    deleteMedia(id: number, userId: number): Promise<DbMedia>;
}