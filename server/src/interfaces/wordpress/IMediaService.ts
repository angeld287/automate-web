import Media from "../models/Media";

export interface IMediaService {
    getList(): Promise<Array<Media>>

    create(fileName: string, filePath: string, token: string): Promise<Media>;
}