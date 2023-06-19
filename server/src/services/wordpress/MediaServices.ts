import Media from "../../interfaces/models/Media";
import { IMediaServiceResponse } from "../../interfaces/response/IServiceResponse";
import { IImageSharp, IPromiseBase } from "../../interfaces/Utils";
import { IMediaService } from "../../interfaces/wordpress/IMediaService";
import Locals from "../../providers/Locals";
import { axios, createWriteStream, sharp, downloadImage, imagesize, readFileSync, fetch } from "../../utils";
import * as fs from 'fs'
import * as path from 'path'
import Log from "../../middlewares/Log";
import ISitesService from "../../interfaces/ISitesService";
import { sitesService } from "../sitesServices/sitesServices";
import { _sharpCompress } from "../../utils/sharp";


export default class mediaService implements IMediaService {

    async getList(siteId: number): Promise<Array<Media>> {


        const _siteService: ISitesService = new sitesService();
        const site = await _siteService.getSiteById(siteId);

        if(site === false){
            return []
        }

        const response = await axios({ url: `${Locals.config().wordpressUrl(site.domain)}media` });
        
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

    async create(title: string, imageAddress: string, token: string, siteId: number, notCompress?: boolean): Promise<IMediaServiceResponse> {
        const fileName = `${title.replace(new RegExp(" ", 'g'), '-').toLowerCase()}.webp`;

        const _siteService: ISitesService = new sitesService();
        const site = await _siteService.getSiteById(siteId);

        this.deleteImagesInsidePath(Locals.config().DOWNLOADED_IMAGES_PATH)
        this.deleteImagesInsidePath(Locals.config().DOWNLOADED_IMAGES_COMPRESSED_PATH)

        const filePath = Locals.config().DOWNLOADED_IMAGES_PATH + fileName;
        const compressedImagePath = Locals.config().DOWNLOADED_IMAGES_COMPRESSED_PATH + fileName;

        const imageNewFile = (await createWriteStream(filePath)).response;
        const downloadedImage: IPromiseBase = await downloadImage(imageNewFile, imageAddress);

        if (site === false) {
            return { success: false, message: "Error trying to find site data." };
        }

        if (!downloadedImage.success) {
            return { success: false, message: "Error in download image process" };
        }


        let compressImage: IImageSharp = null;

        if(!notCompress || notCompress !== true){
            compressImage = await _sharpCompress(filePath, compressedImagePath);
        }else{
            compressImage = await sharp(filePath, compressedImagePath);
        }

        if (!compressImage.success) {
            return { success: false, message: "Error in compress image process" };
        }

        const dataFile = await readFileSync(compressedImagePath)

        const result = await fetch(`${Locals.config().wordpressUrl(site.domain)}media`, {
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

    async delete(id: number, token: string): Promise<IMediaServiceResponse> {
        const deleteResult = await fetch(`${Locals.config().wordpressUrl}media/${id}?force=true`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        if (!deleteResult.success) {
            return { success: false, message: "Error deleting media." };
        }
        return { success: true, message: "success" };
    }

    async imageHaveCorrectSize(imageAddress: string): Promise<boolean>{
        const imageSize = (await imagesize(imageAddress))
        return imageSize.success && imageSize.width > Locals.config().POST_IMAGE_WIDTH && imageSize.height > Locals.config().POST_IMAGE_HEIGHT;
    }
}