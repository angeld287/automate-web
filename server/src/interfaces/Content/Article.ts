import { ArticleState } from '../Enums/States';
import IContent from '../models/Content'
import { DbMedia } from '../models/Media';

export interface INewArticle {
    id?: number;
    internalId?: number;
    wpId?: number;
    sysState?: ArticleState
    title: string;
    translatedTitle: string;
    subtitles: Array<SubTitleContent>;
    category: string;
    translatedContent?: string;
    contents?: Array<IContent>;
    image?: DbMedia
    error?: boolean | ProcessError;
    wpLink?: string;
    createdBy: number;
    createdAt: string;
    deleted?: boolean;
    deletedBy?: number;
    deletedAt?: string;
    jobId?: number;
    siteId: number;
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
    images?: Array<DbMedia>;
    error?: boolean | ProcessError;
    deleted?: boolean;
    deletedBy?: number;
    deletedAt?: string;
}

export interface ProcessError {
    message: string;
    details?: any
}