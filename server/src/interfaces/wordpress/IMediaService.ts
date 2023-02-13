import Media from "../models/Media";
import { IMediaServiceResponse } from "../response/IServiceResponse";

export interface IMediaService {
    getList(): Promise<Array<Media>>

    create(title: string, imageAddress: string, token: string): Promise<IMediaServiceResponse>;
    
    update(id: number, fieldsToUpdate: any, token: string): Promise<IMediaServiceResponse>;
    
    delete(id: number, token: string): Promise<IMediaServiceResponse>;

    imageHaveCorrectSize(imageAddress: string): Promise<boolean>;

    deleteImagesInsidePath(imagesPath: string);
}