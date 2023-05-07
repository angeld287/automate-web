import { INewArticle, SubTitleContent } from "./Content/Article";
import IContent from "./models/Content";
import { DbMedia } from "./models/Media";

export interface IArticleService {

    createSubtitle(subtitle: SubTitleContent): Promise<SubTitleContent>

    createArticle(article: INewArticle): Promise<INewArticle>

    updateArticle(article: INewArticle): Promise<INewArticle | false>

    getArticles(page: number, size: number, userId: number): Promise<Array<INewArticle> | false>

    getArticleById(articleId: number): Promise<INewArticle | false>
    
    getArticleByDbId(articleId: number): Promise<INewArticle | false>

    getPlanningArticle(jobId: number, userId: number): Promise<INewArticle | false>

    getPlanningArticles(jobId: number, userId: number): Promise<Array<INewArticle> | false>

    getAIResearchedArticles(userId: number): Promise<Array<INewArticle> | false>

    getCreatedArticles(userId: number): Promise<Array<INewArticle> | false>

    getSubtitleById(subtitleId: number): Promise<SubTitleContent | false>

    getSubtitlesByArticleId(articleId: number): Promise<Array<SubTitleContent>>;

    createContentForArticle(content: IContent): Promise<IContent>;

    createContentForSubtitle(content: IContent): Promise<IContent>;

    saveArticleAfterTranslateKeywords(article: INewArticle): Promise<INewArticle>;

    saveArticleAfterContentSearched(article: INewArticle): Promise<INewArticle>;

    saveSubtitleAfterContentSearched(subtitle: SubTitleContent): Promise<SubTitleContent>;

    deleteKeywordSelectedContent(contents: Array<IContent>, userId: number): Promise<boolean>;

    getKeywordSelectedContent(subtitleId: number): Promise<Array<IContent>>;

    getIntroSelectedContent(articleId: number): Promise<Array<IContent>>

    saveKeywordNewSelectedContent(contents: Array<IContent>): Promise<Array<IContent>>;

    createMediaForArticle(media: DbMedia): Promise<DbMedia>;

    createMediaForSubtitle(media: DbMedia): Promise<DbMedia>;

    getMediaBySubtitleId(subtitleId: number): Promise<Array<DbMedia>>;

    getMediaByArticleId(articleId: number): Promise<Array<DbMedia>>;

    updateMedia(media: DbMedia): Promise<DbMedia>;

    deleteMedia(id: number, userId: number): Promise<DbMedia>;

    getAllArticleMedia(articleId: number): Promise<Array<DbMedia>>
}