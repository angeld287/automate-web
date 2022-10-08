import { INewArticle, INewArticles } from "../../../interfaces/Content/Article";
import { ITranslateService } from "../../../interfaces/ITranslateService";
import { translateService } from "../../../services/translation/translateService";

class Content {

    public static async createContent(articles: INewArticles): Promise<any> {
        try {
            articles.list.forEach(async (article) => {
                //translate title and subtitiles to english
                const englishArticleTitles: INewArticle = await this.translateTitles(article);

                //search the content for title and each subtitile

                //translate the selected content to spanish

                //search and download the image

                //conver images to webp

                //post the article

            });
        } catch (error) {

        }
    }

    static async translateTitles(article: INewArticle) {
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
}

export default Content;