import Media from "../../interfaces/models/Media";
import { IMediaServiceResponse } from "../../interfaces/response/IServiceResponse";
import { IImageSharp, IPromiseBase } from "../../interfaces/Utils";
import { IMediaService } from "../../interfaces/wordpress/IMediaService";
import Locals from "../../providers/Locals";
import { axios, createWriteStream, sharp, downloadImage, imagesize, readFileSync, addMedia, fetch } from "../../utils";
import * as fs from 'fs'
import * as path from 'path'
import Log from "../../middlewares/Log";


export default class mediaService implements IMediaService {

    async getList(): Promise<Array<Media>> {
        const response = await axios({ url: `${Locals.config().wordpressUrl}media` });
        return response.body
    }

    deleteImagesInsidePath(imagesPath: string){
        try {
            if(fs.existsSync(imagesPath)){
                fs.readdirSync(imagesPath).forEach((file) => {
                    const curPath = path.join(imagesPath, file);
                    fs.unlinkSync(curPath);
                });
            }
        } catch(err) {
            Log.error(`MediaService - DeleteImagesInsidePath Error: ` + err);
        }
    }

    async create(title: string, imageAddress: string, token: string): Promise<IMediaServiceResponse> {
        const fileName = `${title.replace(new RegExp(" ", 'g'), '-').toLowerCase()}.webp`;

        this.deleteImagesInsidePath(Locals.config().DOWNLOADED_IMAGES_PATH)
        this.deleteImagesInsidePath(Locals.config().DOWNLOADED_IMAGES_COMPRESSED_PATH)

        const filePath = Locals.config().DOWNLOADED_IMAGES_PATH + fileName;
        const compressedImagePath = Locals.config().DOWNLOADED_IMAGES_COMPRESSED_PATH + fileName;

        const imageNewFile = (await createWriteStream(filePath)).response;
        const downloadedImage: IPromiseBase = await downloadImage(imageNewFile, imageAddress);

        if (!downloadedImage.success) {
            return { success: false, message: "Error in download image process" };
        }

        const compressImage: IImageSharp = await sharp(filePath, compressedImagePath);

        if (!compressImage.success) {
            return { success: false, message: "Error in compress image process" };
        }

        const dataFile = await readFileSync(compressedImagePath)

        //const result = await axios({
        //    url: `${Locals.config().wordpressUrl}media`,
        //    method: 'POST',
        //    headers: {
        //        'Content-Type': 'image/webp',
        //        'Authorization': token,
        //        'cache-control': 'no-cache',
        //        'content-disposition': `attachment; filename=${fileName}`
        //    },
        //    data: dataFile.response
        //});

        const result = await fetch(`${Locals.config().wordpressUrl}media`, {
            method: 'POST',
            headers: {
                'Content-Type': 'image/webp',
                'Authorization': token,
                'cache-control': 'no-cache',
                'content-disposition': `attachment; filename=${fileName}`
            },
            body: dataFile.response
        });
        

        if (!result.success) {
            return { success: false, message: "Error uploading media. ", media: result };
        }
        
        return { success: true, message: "success", media: result.body };
    }

    async update(id: number, fieldsToUpdate: any, token: string): Promise<IMediaServiceResponse> {
        const updateResult = await axios({
            url: `${Locals.config().wordpressUrl}media/${id}`,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(fieldsToUpdate)
        });

        if (!updateResult.success) {
            return { success: false, message: "Error updating media.", media: updateResult.body };
        }

        return { success: true, message: "success", media: updateResult.body };
    }

    async imageHaveCorrectSize(imageAddress: string): Promise<boolean>{
        const imageSize = (await imagesize(imageAddress))
        return imageSize.success && imageSize.width > Locals.config().POST_IMAGE_WIDTH && imageSize.height > Locals.config().POST_IMAGE_HEIGHT;
    }
}