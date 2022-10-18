import { AuthFailureResponse, SuccessResponse } from "../../../core/ApiResponse";
import { INewArticle, SubTitleContent } from "../../../interfaces/Content/Article";
import { ISearchService } from "../../../interfaces/ISearchService";
import { ITranslateService } from "../../../interfaces/ITranslateService";
import { INext, IRequest, IResponse } from "../../../interfaces/vendors";
import Log from "../../../middlewares/Log";
import ExpressValidator from "../../../providers/ExpressValidation";
import { searchService } from "../../../services/searchEngine/searchService";
import { translateService } from "../../../services/translation/translateService";

class Content {

    public static async createContent(req: IRequest, res: IResponse, next: INext): Promise<any> {
        try {
            //articles: Array<INewArticle>
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new SuccessResponse('Success', {
                    errors: errors.array()
                }).send(res);
            }

            const articles = req.body.articles;

            await Promise.all(articles.map(async (article: INewArticle, index: number) => {
                //translate title and subtitiles to english
                const englishArticleTitles: INewArticle = await Content.translateTitles(article);

                //search the content for title and each subtitile
                const articleSearchResult = await Content.searchContent(englishArticleTitles);


                //translate the selected content to spanish
                const articleWithCompletedTranslation = await Content.translateContent(articleSearchResult);
                //search and download the image

                //conver images to webp

                //post the article

                articles[index] = articleWithCompletedTranslation;
            }));

            return new SuccessResponse('Success', {
                articles
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new AuthFailureResponse('Validation Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    static async translateTitles(article: INewArticle): Promise<INewArticle> {
        try {
            let translate: ITranslateService = new translateService();
            const titleTranslation = await translate.perform(article.title, 'en');
            if (titleTranslation.success) {
                article.translatedTitle = titleTranslation.body[0]['translations'][0].text;
                article.error = false;
            } else {
                article.error = { message: "Error occurred in titles translations." };
            }

            await Promise.all(article.subtitiles.map(async (subtitle: SubTitleContent, index) => {
                const translation = await translate.perform(subtitle.name, 'en');
                if (translation.success) {
                    article.subtitiles[index].translatedName = translation.body[0]['translations'][0].text;
                    article.subtitiles[index].error = false;
                }
                else {
                    article.subtitiles[index].error = { message: "Error occurred in subtitles translations." };
                }
            }));

            return article;

        } catch (error) {

        }

    }

    static async translateContent(article: INewArticle): Promise<INewArticle> {
        try {
            let translate: ITranslateService = new translateService();

            await Promise.all(article.subtitiles.map(async (subtitle: SubTitleContent, index) => {
                const translation = await translate.perform(subtitle.content, 'es');
                if (translation.success) {
                    article.subtitiles[index].translatedContent = (await translate.perform(subtitle.content, 'es')).body[0]['translations'][0].text;
                    article.subtitiles[index].error = false;
                } else {
                    article.subtitiles[index].error = { message: `Error occurred in subtitle content translations: ${translation.body}`, details: translation.errorDetails };
                }
            }));

            return article;

        } catch (error) {

        }

    }

    static async searchContent(article: INewArticle): Promise<INewArticle> {
        try {
            let search: ISearchService = new searchService();

            await Promise.all(article.subtitiles.map(async (subtitle, index) => {
                article.subtitiles[index].content = (await search.perform("1", subtitle.translatedName)).map(paragraphObejct => paragraphObejct ? paragraphObejct.paragraph : "").join(" ");
            }));

            return article;
        } catch (error) {
            console.log(error)
        }
    }
}

export default Content;