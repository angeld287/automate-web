import Media from "../../interfaces/models/Media";
import { IMediaServiceResponse } from "../../interfaces/response/IServiceResponse";
import { IImageSharp, IPromiseBase } from "../../interfaces/Utils";
import { IMediaService } from "../../interfaces/wordpress/IMediaService";
import Locals from "../../providers/Locals";
import { axios, createWriteStream, sharp, downloadImage, imagesize } from "../../utils";

export default class mediaService implements IMediaService {

    async getList(): Promise<Array<Media>> {
        const response = await axios({ url: `${Locals.config().wordpressUrl}media` });
        return response.body
    }

    async create(fileName: string, imageAddress: string, token: string): Promise<IMediaServiceResponse> {
        const filePath = Locals.config().DOWNLOADED_IMAGES_PATH + fileName;
        const compressedImagePath = Locals.config().DOWNLOADED_IMAGES_COMPRESSED_PATH + fileName;

        const imageNewFile = (await createWriteStream(filePath)).response;
        const downloadedImage: IPromiseBase = await downloadImage(imageNewFile, imageAddress);

        if (!downloadedImage.success) {
            return {success: false, message: "Error in download image process"};
        }
        
        const compressImage: IImageSharp = await sharp(filePath, compressedImagePath); 

        if (!compressImage.success) {
            return { success: false, message: "Error in compress image process" };
        }
        
        
        
        //const dataFile = await readFileSync(filePath)
        //const result = await axios({
        //    url: `${Locals.config().wordpressUrl}media`,
        //    method: 'POST',
        //    headers: {
        //        'Content-Type': 'image/webp',
        //        'Authorization': `Bearer ${token}`,
        //        'cache-control': 'no-cache',
        //        'content-disposition': `attachment; filename=${fileName}`
        //    },
        //    data: dataFile
        //});
        return { success: true, message: "" };
    }

    async imageHaveCorrectSize(imageAddress: string): Promise<boolean>{
        const imageSize = (await imagesize(imageAddress))
        return imageSize.success && imageSize.width > Locals.config().POST_IMAGE_WIDTH && imageSize.height > Locals.config().POST_IMAGE_HEIGHT;
    }
}