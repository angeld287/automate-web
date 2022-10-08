export interface INewArticles {
    list: Array<INewArticle>;
}

export interface INewArticle {
    title: string;
    subtitiles: Array<Content>;
    category: string;
    content?: string;
}

export interface Content {
    name: string;
    content: string;
}