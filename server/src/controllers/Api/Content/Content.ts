import { BadRequestResponse, InternalErrorResponse, SuccessResponse } from "../../../core/ApiResponse";
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
import { ITranslateItem } from "../../../interfaces/Utils";
import textAnalyticsServices from "../../../services/azure/textAnalyticsServices";
import ITextAnalyticsServices from "../../../interfaces/ITextAnalyticsServices";
import openaiServices from "../../../services/openai/openaiServices";
import IOpenaiServices from "../../../interfaces/IOpenaiServices";
import { IKeywordService } from "../../../interfaces/IKeywordService";
import { keywordService } from "../../../services/keywords/keywordServices";
import IKeyword from "../../../interfaces/models/Keyword";
import { ArticleState } from "../../../interfaces/Enums/States";
import NodeJob from "../../../providers/NodeJob";

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
            if(!categories.find(category => category.slug === article.category.trim())){
                return new BadRequestResponse('Error', {
                    error: "This category does not exist on the wordpress site cateogies."
                }).send(res);
            }

            let translate: ITranslateService = new translateService();
            let _articleService: IArticleService = new articleService();

            const translateItems: Array<ITranslateItem> = [
                { Text: article.title, id: 'title'}, 
                ...article.subtitles.map((subtitle): ITranslateItem => ({Text: subtitle.name, id: subtitle.name}))
            ];

            const translationResult = await translate.translateMultipleTexts(translateItems, 'es', 'en');

            if(!translationResult.success){
                return new InternalErrorResponse('translateKeywords - axios request Error', {
                    error: 'Internal Server Error',
                }).send(res);
            }
            
            const translation: Array<ITranslateItem> = translationResult.body.map((result): ITranslateItem => ({...result.translations[0]})) 
            
            article.translatedTitle = translation[0].text;
            article.subtitles.forEach((subtitle, index) => {
                subtitle.translatedName = translation[index + 1].text;
            });

            article.createdBy = parseInt(req.session.passport.user.id); 
            article = await _articleService.saveArticleAfterTranslateKeywords(article)
            
            return new SuccessResponse('Success', {
                article
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
            let subParagraphs = null;
            let translation: Array<ITranslateItem> = [];

            const searchResult = await search.perform("1", subtitle.translatedName);
            const translatedContent: Array<IContent> = [];

            if(searchResult.length !== 0){
                subParagraphs = searchResult.map((paragraphObejct, index): IContent => paragraphObejct ? {subtitleId: subtitle.id, content: paragraphObejct.paragraph, selected: false, contentLanguage: Languages.ENGLISH, orderNumber: index+1, link: paragraphObejct.link, wordsCount: paragraphObejct.wordCount} : {content: "", selected: false, contentLanguage: ""}).filter(paragraph => paragraph.content !== "");
                const translateItems: Array<ITranslateItem> = subParagraphs.map((paragraph): ITranslateItem => ({Text: paragraph.content}));
                const translationResult = await translate.translateMultipleTextsNf(translateItems, 'en', 'es');

                if(!translationResult.success){
                    Log.error(`searchKeyword - axios request Error - ${translationResult.errorDetails}`)
                    return new InternalErrorResponse('searchKeyword - axios request Error', {
                        error: 'Internal Server Error',
                    }).send(res);
                }

                translation = translationResult.body.map((result): ITranslateItem =>  ({...result.translations[0]})) 
            }else{
                subParagraphs = [{
                    subtitleId: subtitle.id, 
                    content: 'Not result Found!', 
                    selected: false, 
                    contentLanguage: Languages.ENGLISH, 
                    orderNumber: 1, 
                    link: '', 
                    wordsCount: 0
                }];

                translation = [
                    {text: 'Not result Found!'}
                ]
            }
            
            subParagraphs.forEach((paragraph, index) => {
                translatedContent.push({
                    orderNumber: paragraph.orderNumber,
                    link: paragraph.link,
                    selected: false,
                    subtitleId: paragraph.subtitleId, 
                    wordsCount: paragraph.wordsCount,
                    contentLanguage: Languages.SPANISH,
                    content: translation[index].text
                });
            });

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


    static async transcribeContent(req: IRequest, res: IResponse, next: INext): Promise<any> {
        try {

            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            let contents: Array<IContent> = req.body.contents;

            let textAnalytics: ITextAnalyticsServices = new textAnalyticsServices();

            const result = await textAnalytics.getExtractiveSummarization(contents)

            console.log(result)

            return new SuccessResponse('Success', {
                content: null,
                result
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Validation Error', {
                error: 'Internal Server Error',
            }).send(res);
        }

    }

    static async createArticleWithOpenAI(req: IRequest, res: IResponse, next: INext): Promise<any> {
        try {

            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array(),
                    created: false
                }).send(res);
            }

            const { text, keywordId, jobId, category } = req.body;

            let openService: IOpenaiServices = new openaiServices();
            let translate: ITranslateService = new translateService();
            let _articleService: IArticleService = new articleService();
            let _keywordService: IKeywordService = new keywordService();
            
            const englishKeyword = await translate.perform(text, 'es', 'en');
            let result = null
            let keyword: IKeyword = null
            
            const userId = req.session.passport.user.id;

            if (englishKeyword.success) {

                const enTitle = englishKeyword.body[0]['translations'][0].text

                let article: INewArticle = {
                    title: text,
                    category,
                    subtitles: [],
                    sysState: ArticleState.AI_CONTENT_RESEARCH,
                    translatedTitle: enTitle,
                    createdBy: parseInt(userId),
                    createdAt: (new Date()).toString(),
                    jobId
                }
                
                article = await _articleService.createArticle(article);

                keyword = await _keywordService.getKeywordsById(keywordId)
                keyword.articleId = article.id
                keyword = await _keywordService.updateKeyword(keyword);
                
                const createAIArticleJob: NodeJob = new NodeJob();

                createAIArticleJob.startJob(`createAIArticleJob-${article.id}`, async () => {
                    try {
                        const chatRequest = `create an article on '${enTitle}' with 500 words, with 5 subtitles and with a conclusion`;
                        result = await openService.createNewChat(chatRequest);

                        const splittedArticle = result.choices[0].message.content.split('\n\n')
                        await Promise.all(splittedArticle.map(async (text: string, index: number) => {
                            _articleService.createContentForArticle({
                                content: text,
                                contentLanguage: 'en',
                                selected: false,
                                articleId: article.id,
                                wordsCount: text.split(" ").length,
                            })
                        }));
                    } catch (error) {
                        console.log(error)
                    }
                })

            }else{
                Log.error(`Internal Server Error: error in title translation process - ${englishKeyword.errorDetails}`);
                return new InternalErrorResponse('Validation Error', {
                    error: `Internal Server Error: error in title translation process - ${englishKeyword.errorDetails}`,
                    created: false,
                }).send(res);
            }

            return new SuccessResponse('Success', {
                created: true,
                keyword
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Validation Error', {
                error: 'Internal Server Error',
                created: false,
            }).send(res);
        }

    }
}

export default Content;