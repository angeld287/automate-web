import Media from "../../interfaces/models/Media";
import { IMediaService } from "../../interfaces/wordpress/IMediaService";
import Locals from "../../providers/Locals";
import { axios, createWriteStream, readFileSync } from "../../utils";
import { downloadImage } from "../../utils";

export default class mediaService implements IMediaService {

    async getList(): Promise<Array<Media>> {
        const response = await axios({ url: `${Locals.config().wordpressUrl}media` });
        return response.body
    }

    async create(fileName: string, imageAddress: string, token: string): Promise<any> {
        const file = (await createWriteStream("file.jpg")).response;

        const downloadedImage = await downloadImage(file, imageAddress);
        console.log(file);
        
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