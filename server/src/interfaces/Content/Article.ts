export interface INewArticle {
    id?: number;
    internalId?: number;
    title: string;
    translatedTitle: string;
    subtitles: Array<SubTitleContent>;
    category: string;
    introduction?: string;
    translatedContent?: string;
    error?: boolean | ProcessError;
    createdBy: number;
    createdAt: string;
    deleted?: boolean;
    deletedBy?: number;
    deletedAt?: string;
}

export interface SubTitleContent {
    id?: number;
    name: string;
    translatedName: string;
    articleId?: number;
    content?: Array<string>;
    enContent?: Array<string>;
    translatedContent?: string;
    error?: boolean | ProcessError
}

export interface ProcessError {
    message: string;
    details?: any
}