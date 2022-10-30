import { AuthFailureResponse, BadRequestResponse, InternalErrorResponse, SuccessResponse } from "../../../core/ApiResponse";
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
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            let article = req.body.article;

            //translate title and subtitiles to english
            const englishArticleTitles: INewArticle = await Content.translateTitles(article);

            //search the content for title and each subtitile
            const articleSearchResult = await Content.searchContent(englishArticleTitles);

            //search and download the image

            //conver images to webp

            article = articleSearchResult;

            return new SuccessResponse('Success', {
                article
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Validation Error', {
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
                const translation = await translate.perform(subtitle.content[0], 'es');
                if (translation.success) {
                    article.subtitiles[index].translatedContent = translation.body[0]['translations'][0].text;
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
            let translate: ITranslateService = new translateService();

            await Promise.all(article.subtitiles.map(async (subtitle, index) => {
                const subParagraphs = (await search.perform("1", subtitle.translatedName)).map(paragraphObejct => paragraphObejct ? paragraphObejct.paragraph : "").filter(paragraph => paragraph !== "");

                await Promise.all(subParagraphs.map(async (paragraph, paragraphIndex) => {
                    const translation = await translate.perform(paragraph, 'es');
                    if (translation.success) {
                        subParagraphs[paragraphIndex] = translation.body[0]['translations'][0].text;
                    }
                }))

                article.subtitiles[index].content = subParagraphs;
            }));

            return article;
        } catch (error) {
            console.log(error)
        }
    }
}

export default Content;