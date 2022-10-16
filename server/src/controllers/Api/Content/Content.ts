import { AuthFailureResponse, SuccessResponse } from "../../../core/ApiResponse";
import { INewArticle } from "../../../interfaces/Content/Article";
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

            articles.forEach(async (article) => {
                //translate title and subtitiles to english
                const englishArticleTitles: INewArticle = await Content.translateTitles(article);

                //search the content for title and each subtitile
                const searchContentResults = await Content.searchContent(englishArticleTitles);

                //translate the selected content to spanish

                //search and download the image

                //conver images to webp

                //post the article

            });

            return new SuccessResponse('Success', {
                session: 'req.session.passport.user',
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
            article.title = (await translate.perform(article.title, 'en')).body[0]['translations'][0].text;

            await Promise.all(article.subtitiles.map(async (subtitle, index) => {
                article.subtitiles[index].name = (await translate.perform(subtitle.name, 'en')).body[0]['translations'][0].text;
            }));

            return article;

        } catch (error) {

        }

    }

    static async searchContent(article: INewArticle): Promise<INewArticle> {
        try {
            let search: ISearchService = new searchService();
            //const result = await search.perform("1", article.title);
            await Promise.all(article.subtitiles.map(async (subtitle, index) => {
                //article.subtitiles[index].content
                const result = (await search.perform("1", subtitle.name));
            }));
            //console.log('result');
            //console.log(result);
            return article;
        } catch (error) {

        }
    }
}

export default Content;