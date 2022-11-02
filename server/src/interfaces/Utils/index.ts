interface IPromiseBase {
    success: boolean;
    error?: Error
    message?: string;
}

export interface IImageSize extends IPromiseBase {
    format: string;
    width: number;
    height: number;
}