export interface IPromiseBase {
    success: boolean;
    error?: Error
    message?: string;
}

export interface IImageSize extends IPromiseBase {
    format?: string;
    width?: number;
    height?: number;
}

export interface IImageSharp extends IImageSize {
    channels?: number;
    premultiplied?: boolean;
    size?: number;
}

export interface ITranslateItem {
    Text?: string;
    text?: string;
    id?: string;
}