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

            //translate title and subtitles to english
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

    static async translateKeyword(req: IRequest, res: IResponse, next: INext): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            let keyword = req.body.keyword;

            let translate: ITranslateService = new translateService();
            const translatedKeyword = await translate.perform(keyword, 'en');

            return new SuccessResponse('Success', {
                keyword, translatedKeyword
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Validation Error', {
                error: 'Internal Server Error',
            }).send(res);
        }

    }

    static async translateKeywords(req: IRequest, res: IResponse, next: INext): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            let article = req.body.article;

            let translate: ITranslateService = new translateService();
            const titleTranslation = await translate.perform(article.title, 'en');
            if (titleTranslation.success) {
                article.translatedTitle = titleTranslation.body[0]['translations'][0].text;
                article.error = false;
            } else {
                article.error = { message: "Error occurred in titles translations." };
            }

            await Promise.all(article.subtitles.map(async (subtitle: SubTitleContent, index) => {
                const translation = await translate.perform(subtitle.name, 'en');
                if (translation.success) {
                    article.subtitles[index].translatedName = translation.body[0]['translations'][0].text;
                    article.subtitles[index].error = false;
                }
                else {
                    article.subtitles[index].error = { message: "Error occurred in subtitles translations." };
                }
            }));

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

    static async searchKeywords(req: IRequest, res: IResponse, next: INext): Promise<any> {
        try {

            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            let article: INewArticle = req.body.article;

            let search: ISearchService = new searchService();
            let translate: ITranslateService = new translateService();

            await Promise.all(article.subtitles.map(async (subtitle, index) => {
                const subParagraphs = (await search.perform("1", subtitle.translatedName)).map(paragraphObejct => paragraphObejct ? paragraphObejct.paragraph : "").filter(paragraph => paragraph !== "");
                article.subtitles[index].enContent = [...subParagraphs];

                await Promise.all(subParagraphs.map(async (paragraph, paragraphIndex) => {
                    const translation = await translate.perform(paragraph, 'es');
                    if (translation.success) {
                        subParagraphs[paragraphIndex] = translation.body[0]['translations'][0].text;
                    }
                }))

                article.subtitles[index].content = subParagraphs;
            }));

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

    static async searchKeyword(req: IRequest, res: IResponse, next: INext): Promise<any> {
        try {

            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            let subtitle: SubTitleContent = req.body.subtitle;

            let search: ISearchService = new searchService();
            let translate: ITranslateService = new translateService();

            const subParagraphs = (await search.perform("1", subtitle.translatedName)).map(paragraphObejct => paragraphObejct ? paragraphObejct.paragraph : "").filter(paragraph => paragraph !== "");
            subtitle.enContent = [...subParagraphs];

            await Promise.all(subParagraphs.map(async (paragraph, paragraphIndex) => {
                const translation = await translate.perform(paragraph, 'es');
                if (translation.success) {
                    subParagraphs[paragraphIndex] = translation.body[0]['translations'][0].text;
                }
            }))

            subtitle.content = subParagraphs;

            return new SuccessResponse('Success', {
                subtitle
            }).send(res);
        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Validation Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    static async translateParagraphs(req: IRequest, res: IResponse, next: INext): Promise<any> {
        try {

            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            let article = req.body.article;

            let translate: ITranslateService = new translateService();

            await Promise.all(article.subtitles.map(async (subtitle: SubTitleContent, index) => {
                const translation = await translate.perform(subtitle.content[0], 'es');
                if (translation.success) {
                    article.subtitles[index].translatedContent = translation.body[0]['translations'][0].text;
                    article.subtitles[index].error = false;
                } else {
                    article.subtitles[index].error = { message: `Error occurred in subtitle content translations: ${translation.body}`, details: translation.errorDetails };
                }
            }));

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

            await Promise.all(article.subtitles.map(async (subtitle: SubTitleContent, index) => {
                const translation = await translate.perform(subtitle.name, 'en');
                if (translation.success) {
                    article.subtitles[index].translatedName = translation.body[0]['translations'][0].text;
                    article.subtitles[index].error = false;
                }
                else {
                    article.subtitles[index].error = { message: "Error occurred in subtitles translations." };
                }
            }));

            return article;

        } catch (error) {

        }

    }

    static async translateContent(article: INewArticle): Promise<INewArticle> {
        try {
            let translate: ITranslateService = new translateService();

            await Promise.all(article.subtitles.map(async (subtitle: SubTitleContent, index) => {
                const translation = await translate.perform(subtitle.content[0], 'es');
                if (translation.success) {
                    article.subtitles[index].translatedContent = translation.body[0]['translations'][0].text;
                    article.subtitles[index].error = false;
                } else {
                    article.subtitles[index].error = { message: `Error occurred in subtitle content translations: ${translation.body}`, details: translation.errorDetails };
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

            await Promise.all(article.subtitles.map(async (subtitle, index) => {
                const subParagraphs = (await search.perform("1", subtitle.translatedName)).map(paragraphObejct => paragraphObejct ? paragraphObejct.paragraph : "").filter(paragraph => paragraph !== "");

                await Promise.all(subParagraphs.map(async (paragraph, paragraphIndex) => {
                    const translation = await translate.perform(paragraph, 'es');
                    if (translation.success) {
                        subParagraphs[paragraphIndex] = translation.body[0]['translations'][0].text;
                    }
                }))

                article.subtitles[index].content = subParagraphs;
            }));

            return article;
        } catch (error) {
            console.log(error)
        }
    }
}

export default Content;