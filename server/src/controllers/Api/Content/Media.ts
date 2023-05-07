/**
 * Get the html body of a web page
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import { BadRequestResponse, InternalErrorResponse, SuccessResponse } from '../../../core/ApiResponse';
import { IArticleService } from '../../../interfaces/IArticleService';
import { IRequest, IResponse } from '../../../interfaces/vendors';
import { IMediaService } from '../../../interfaces/wordpress/IMediaService';
import IMedia, { DbMedia } from '../../../interfaces/models/Media';
import Log from '../../../middlewares/Log';
import ExpressValidator from '../../../providers/ExpressValidation';
import { articleService } from '../../../services/articleServices/articleServices';
import mediaService from '../../../services/wordpress/MediaServices';
import Locals from '../../../providers/Locals';
import { IMediaServiceResponse } from '../../../interfaces/response/IServiceResponse';
import IOpenaiServices from '../../../interfaces/IOpenaiServices';
import openaiServices from '../../../services/openai/openaiServices';
import { ImagesResponse } from "openai"

class Media {
    public static async create(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            let _mediaService: IMediaService = new mediaService();
            const articleServices: IArticleService = new articleService();
            const {imageAddress, title, type, relatedId, orderNumber} = req.body;

            //const imageIsFine = await _mediaService.imageHaveCorrectSize(imageAddress);
            //
            //if (!imageIsFine){
            //    return new BadRequestResponse('Error', {
            //        success: false,
            //        response: 'The image must be greater than width: 590 and height: 350.',
            //        error: null
            //    }).send(res);
            //}

            const media: IMedia = (await _mediaService.create(title, imageAddress, req.headers.authorization)).media
            
            let dbMedia: DbMedia = null;
            if(type === 'subtitle') {
                
                dbMedia = await articleServices.createMediaForSubtitle({
                    source_url: media.source_url,
                    title,
                    wpId: media.id,
                    subtitleId: relatedId,
                    orderNumber
                });
            }else if(type === 'article'){
                const articleImages = await articleServices.getMediaByArticleId(relatedId);

                await Promise.all(articleImages.map(async (image) => {
                    await articleServices.deleteMedia(parseInt(image.id), parseInt(req.session.passport.user.id));
                    await _mediaService.delete(parseInt(image.wpId), req.headers.authorization)
                }))
                
                dbMedia = await articleServices.createMediaForArticle({
                    source_url: media.source_url,
                    title,
                    wpId: media.id,
                    articleId: relatedId,
                });
            }

            _mediaService.deleteImagesInsidePath(Locals.config().DOWNLOADED_IMAGES_PATH)
            _mediaService.deleteImagesInsidePath(Locals.config().DOWNLOADED_IMAGES_COMPRESSED_PATH)

            return new SuccessResponse('Success', {
                success: true,
                response: dbMedia,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            console.log(error);
            return new InternalErrorResponse('Create Media Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async updateMediaTitles(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            let _mediaService: IMediaService = new mediaService();
            const id = req.body.id
            const title = req.body.title

            const media: IMedia = (await _mediaService.update(id, { title: title }, req.headers.authorization)).media

            return new SuccessResponse('Success', {
                success: true,
                response: media,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Update Media Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async deleteMedia(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            let _mediaService: IMediaService = new mediaService();
            const articleServices: IArticleService = new articleService();
            const id = req.body.id;

            const media = await articleServices.deleteMedia(parseInt(id), parseInt(req.session.passport.user.id));
            const WPmedia: IMediaServiceResponse = (await _mediaService.delete(parseInt(media.wpId), req.headers.authorization))

            return new SuccessResponse('Success', {
                success: true,
                response: media,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Delete Media Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async openaiCreateImage(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            let _openaiService: IOpenaiServices = new openaiServices();
            let _mediaService: IMediaService = new mediaService();
            const articleServices: IArticleService = new articleService();
            
            const {text, type, relatedId} = req.body;

            const imageFromOpenAI: ImagesResponse = await _openaiService.createNewImage(text);

            const media: IMedia = (await _mediaService.create(text, imageFromOpenAI.data[0].url, req.headers.authorization)).media
            
            if(media.source_url === undefined){
                Log.error(`Internal Server Error, WP Authentication error` + media);
                return new BadRequestResponse('Error', {
                    error: 'WP Authentication error, please log in the session again.'
                }).send(res);
            }
            
            let dbMedia: DbMedia = null;
            
            if(type === 'subtitle') {
                const subtitleImages = await articleServices.getMediaBySubtitleId(relatedId);

                await Promise.all(subtitleImages.map(async (image) => {
                    await articleServices.deleteMedia(parseInt(image.id), parseInt(req.session.passport.user.id));
                    await _mediaService.delete(parseInt(image.wpId), req.headers.authorization)
                }))
                
                dbMedia = await articleServices.createMediaForSubtitle({
                    source_url: media.source_url,
                    title: text,
                    wpId: media.id,
                    subtitleId: relatedId,
                });
            }else if(type === 'article'){
                const articleImages = await articleServices.getMediaByArticleId(relatedId);

                await Promise.all(articleImages.map(async (image) => {
                    await articleServices.deleteMedia(parseInt(image.id), parseInt(req.session.passport.user.id));
                    await _mediaService.delete(parseInt(image.wpId), req.headers.authorization)
                }))
                
                dbMedia = await articleServices.createMediaForArticle({
                    source_url: media.source_url,
                    title: text,
                    wpId: media.id,
                    articleId: relatedId,
                });
            }

            return new SuccessResponse('Success', {
                success: true,
                response: dbMedia,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Update Media Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async getArticleMedia(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            const { articleId } = req.body

            const articleServices: IArticleService = new articleService();
            const mediaList = await articleServices.getAllArticleMedia(parseInt(articleId))

            return new SuccessResponse('Success', {
                success: true,
                response: mediaList,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('get Category List Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }
}

export default Media;