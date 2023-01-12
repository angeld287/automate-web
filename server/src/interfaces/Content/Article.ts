export interface INewArticle {
    id?: number;
    title: string;
    translatedTitle: string;
    subtitles: Array<SubTitleContent>;
    category: string;
    content?: string;
    translatedContent?: string;
    error?: boolean | ProcessError
}

export interface SubTitleContent {
    id?: number;
    name: string;
    translatedName: string;
    content?: Array<string>;
    enContent?: Array<string>;
    translatedContent?: string;
    error?: boolean | ProcessError
}

export interface ProcessError {
    message: string;
    details?: any
}