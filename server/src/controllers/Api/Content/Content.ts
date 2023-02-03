import { AuthFailureResponse, BadRequestResponse, InternalErrorResponse, SuccessResponse } from "../../../core/ApiResponse";
import { INewArticle, SubTitleContent } from "../../../interfaces/Content/Article";
import { IArticleService } from "../../../interfaces/IArticleService";
import { ISearchService } from "../../../interfaces/ISearchService";
import { ITranslateService } from "../../../interfaces/ITranslateService";
import { INext, IRequest, IResponse } from "../../../interfaces/vendors";
import { ICategoryService } from "../../../interfaces/wordpress/ICategoryService";
import Log from "../../../middlewares/Log";
import ExpressValidator from "../../../providers/ExpressValidation";
import { articleService } from "../../../services/articleServices/articleServices";
import { searchService } from "../../../services/searchEngine/searchService";
import { translateService } from "../../../services/translation/translateService";
import categoryService from "../../../services/wordpress/categoryServices";
import IContent from "../../../interfaces/models/Content";
import { Languages } from "../../../interfaces/Enums/Languages";

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
            const translatedKeyword = await translate.perform(keyword, 'es', 'en');

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

            let article: INewArticle = req.body.article;

            if(!article.title){
                return new BadRequestResponse('Error', {
                    error: "Must provide a title in the article objetct."
                }).send(res);
            }

            if(!article.category || article.category === ""){
                return new BadRequestResponse('Error', {
                    error: "Must provide a category in the article objetct."
                }).send(res);
            }

            let wpCategory: ICategoryService = new categoryService();
            const categories = await wpCategory.getList();
            if(!categories.find(category => category.slug === article.category)){
                return new BadRequestResponse('Error', {
                    error: "This category does not exist on the wordpress site cateogies."
                }).send(res);
            }

            let translate: ITranslateService = new translateService();
            let _articleService: IArticleService = new articleService();

            const joinedStrings = `${article.title} | ${article.subtitles.map(subtitle => subtitle.name).join(' | ')}`

            const translation = await translate.perform(joinedStrings, 'es', 'en');

            if(!translation.success){
                return new InternalErrorResponse('translateKeywords - axios request Error', {
                    error: 'Internal Server Error',
                }).send(res);
            }
            
            const translatedTitles = translation.body[0]['translations'][0].text.split(' | ')

            article.translatedTitle = translatedTitles[0];
            article.subtitles.forEach((subtitle, index) => {
                subtitle.translatedName = translatedTitles[index + 1];
            });

            article.createdBy = parseInt(req.session.passport.user.id); 

            article = await _articleService.saveArticleAfterTranslateKeywords(article)
            

            return new SuccessResponse('Success', {
                article: article
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('translateKeywords Error', {
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
            let _articleService: IArticleService = new articleService();

            await Promise.all(article.subtitles.map(async (subtitle, index) => {
                const subParagraphs = (await search.perform("1", subtitle.translatedName)).map(paragraphObejct => paragraphObejct ? paragraphObejct.paragraph : "").filter(paragraph => paragraph !== "");
                article.subtitles[index].enContent = [...subParagraphs];

                await Promise.all(subParagraphs.map(async (paragraph, paragraphIndex) => {
                    const translation = await translate.perform(paragraph, 'en', 'es');
                    if (translation.success) {
                        subParagraphs[paragraphIndex] = translation.body[0]['translations'][0].text;
                    }
                }))

                article.subtitles[index].content = subParagraphs;
            }));

            article.createdBy = parseInt(req.session.passport.user.id); 

            article = await _articleService.saveArticleAfterContentSearched(article)

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
            let _articleService: IArticleService = new articleService();

            const subParagraphs = (await search.perform("1", subtitle.translatedName)).map((paragraphObejct, index): IContent => paragraphObejct ? {subtitleId: subtitle.id, content: paragraphObejct.paragraph, selected: false, contentLanguage: Languages.ENGLISH, orderNumber: index+1, link: paragraphObejct.link, wordsCount: paragraphObejct.wordCount} : {content: "", selected: false, contentLanguage: ""}).filter(paragraph => paragraph.content !== "");
            const translatedContent: Array<IContent> = []
           
            await Promise.all(subParagraphs.map(async (paragraph, paragraphIndex) => {
                const translation = await translate.perform(paragraph.content, 'en', 'es');
                if (translation.success) {
                    translatedContent.push({
                            orderNumber: paragraph.orderNumber,
                            link: paragraph.link,
                            selected: false,
                            subtitleId: paragraph.subtitleId, 
                            wordsCount: paragraph.wordsCount,
                            contentLanguage: Languages.SPANISH,
                            content: translation.body[0]['translations'][0].text
                        }
                    );
                }
            }))

            subtitle.content = translatedContent;
            subtitle.enContent = subParagraphs;
            subtitle = await _articleService.saveSubtitleAfterContentSearched(subtitle)

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
                const translation = await translate.perform(subtitle.content[0].toString(), 'en', 'es');
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
            const titleTranslation = await translate.perform(article.title, 'es', 'en');
            if (titleTranslation.success) {
                article.translatedTitle = titleTranslation.body[0]['translations'][0].text;
                article.error = false;
            } else {
                article.error = { message: "Error occurred in titles translations." };
            }

            await Promise.all(article.subtitles.map(async (subtitle: SubTitleContent, index) => {
                const translation = await translate.perform(subtitle.name, 'es', 'en');
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
                const translation = await translate.perform(subtitle.content[0].toString(), 'en', 'es');
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
                    const translation = await translate.perform(paragraph, 'en', 'es');
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