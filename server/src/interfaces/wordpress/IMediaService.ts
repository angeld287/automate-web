import Media from "../models/Media";
import { IMediaServiceResponse } from "../response/IServiceResponse";

export interface IMediaService {
    getList(): Promise<Array<Media>>

    create(fileName: string, imageAddress: string, token: string): Promise<IMediaServiceResponse>;

    imageHaveCorrectSize(imageAddress: string): Promise<boolean>;
}