import Media from "../../interfaces/models/Media";
import { IMediaService } from "../../interfaces/wordpress/IMediaService";
import Locals from "../../providers/Locals";
import { axios, compressImage, createWriteStream, readFileSync, sharp } from "../../utils";
import { downloadImage } from "../../utils";

export default class mediaService implements IMediaService {

    async getList(): Promise<Array<Media>> {
        const response = await axios({ url: `${Locals.config().wordpressUrl}media` });
        return response.body
    }

    async create(fileName: string, imageAddress: string, token: string): Promise<any> {
        const filePath = Locals.config().DOWNLOADED_IMAGES_PATH + fileName;
        const compressedPath = Locals.config().DOWNLOADED_IMAGES_COMPRESSED_PATH + fileName;
        //const file = (await createWriteStream(filePath)).response;

        //const downloadedImage = await downloadImage(file, imageAddress);
        const _compressImage = await sharp(filePath, compressedPath); 
        
        
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
        return {};
    }

    
}