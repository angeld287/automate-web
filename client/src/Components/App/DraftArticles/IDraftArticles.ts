import { IArticle } from "../../../interfaces/models/Article";

export default interface IDraftArticles {
    actions?: IArticlesActions[]
    hasMore: boolean;
    status: 'idle' | 'loading' | 'failed';
    articles: Array<IArticle>
    getArticles: any;
    getNextArticles: any;
}

export interface IArticlesActions {
    icon: React.ReactNode;
    onClick: Function;
    _key: string;
}