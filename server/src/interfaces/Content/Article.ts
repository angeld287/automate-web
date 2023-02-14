import IContent from '../models/Content'
import { DbMedia } from '../models/Media';

export interface INewArticle {
    id?: number;
    internalId?: number;
    title: string;
    translatedTitle: string;
    subtitles: Array<SubTitleContent>;
    category: string;
    translatedContent?: string;
    contents?: Array<IContent>;
    image?: DbMedia
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
    orderNumber: number;
    translatedName: string;
    articleId?: number;
    content?: Array<IContent>;
    enContent?: Array<IContent>;
    translatedContent?: string;
    image?: DbMedia
    error?: boolean | ProcessError
}

export interface ProcessError {
    message: string;
    details?: any
}