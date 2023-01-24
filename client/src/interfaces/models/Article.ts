import IContent from "../models/Content";

export interface IArticle {
    id: number;
    internalId: number;
    title: string;
    translatedTitle?: string;
    subtitles: Array<SubTitleContent>;
    category?: string;
    content?: string;
    translatedContent?: string;
    error?: boolean | ProcessError
    createdAt: string;
    createdBy: number;
    deleted?: boolean;
    deletedAt?: string;
    deletedBy?: number;
}

export interface SubTitleContent {
    id: number,
    name: string;
    translatedName?: string;
    content?: Array<IContent>;
    enContent?: Array<IContent>;
    translatedContent?: string;
    error?: boolean | ProcessError;
}

export interface ProcessError {
    message: string;
    details?: any
}