import Media, { DbMedia } from "../models/Media";

interface IBaseResponse {
    success: boolean;
    message?: string;
}
export interface IMediaServiceResponse extends IBaseResponse {
    media?: DbMedia
}
