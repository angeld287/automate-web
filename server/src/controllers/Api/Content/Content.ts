import { INewArticle, INewArticles } from "../../../interfaces/Content/Article";
import { ISearchService } from "../../../interfaces/ISearchService";
import { ITranslateService } from "../../../interfaces/ITranslateService";
import { searchService } from "../../../services/searchEngine/searchService";
import { translateService } from "../../../services/translation/translateService";

class Content {

    public static async createContent(articles: INewArticles): Promise<any> {
        try {
            articles.list.forEach(async (article) => {
                //translate title and subtitiles to english
                const englishArticleTitles: INewArticle = await this.translateTitles(article);

                //search the content for title and each subtitile
                const searchContentResults = await this.searchContent(englishArticleTitles);

                //translate the selected content to spanish

                //search and download the image

                //conver images to webp

                //post the article

            });
        } catch (error) {

        }
    }

    static async translateTitles(article: INewArticle): Promise<INewArticle> {
        try {
            let translate: ITranslateService = new translateService();

            article.title = (await translate.perform(article.title, 'en')).body;

            article.subtitiles.forEach(async (subtitle, index) => {
                article.subtitiles[index].name = (await translate.perform(subtitle.name, 'en')).body;
            });

            return article;

        } catch (error) {

        }

    }

    static async searchContent(article: INewArticle): Promise<INewArticle> {
        try {
            let search: ISearchService = new searchService();
            const result = await search.perform("1", article.title);
            console.log(result);
            return article;
        } catch (error) {

        }
    }
}

export default Content;