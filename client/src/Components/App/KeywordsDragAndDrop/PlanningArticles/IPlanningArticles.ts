import { IArticle } from "../../../../interfaces/models/Article";
import { IDragKeyword } from "../IKeywordsDragAndDrop";

export default interface IPlanningArticles {
    keywords: Array<IDragKeyword>;
    articles: Array<IArticle>;
    jobId?: string;
}