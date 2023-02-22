import IContent from "../models/Content";
import { DbMedia } from "./Media";

export interface IArticle {
    id: number;
    internalId: number;
    wpId?: number;
    title: string;
    translatedTitle?: string;
    subtitles: Array<SubTitleContent>;
    category?: string;
    contents?: Array<IContent>;
    translatedContent?: string;
    image?: DbMedia;
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
    orderNumber: number;
    translatedName?: string;
    content?: Array<IContent>;
    enContent?: Array<IContent>;
    translatedContent?: string;
    image?: DbMedia;
    error?: boolean | ProcessError;
}

export interface ProcessError {
    message: string;
    details?: any
}