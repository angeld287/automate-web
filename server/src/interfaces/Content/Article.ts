export interface INewArticle {
    title: string;
    translatedTitle: string;
    subtitiles: Array<SubTitleContent>;
    category: string;
    content?: string;
    translatedContent?: string;
    error?: boolean | ProcessError
}

export interface SubTitleContent {
    name: string;
    translatedName: string;
    content?: string;
    translatedContent?: string;
    error?: boolean | ProcessError
}

export interface ProcessError {
    message: string;
}