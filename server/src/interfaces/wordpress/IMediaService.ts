import Media from "../models/Media";

export interface IMediaService {
    getList(): Promise<Array<Media>>

    create(fileName: string, imageAddress: string, token: string): Promise<Media>;

    imageHaveCorrectSize(imageAddress: string): Promise<boolean>;
}