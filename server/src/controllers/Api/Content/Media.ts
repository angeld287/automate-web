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
            const {imageAddress, title, type, relatedId} = req.body;

            const imageIsFine = await _mediaService.imageHaveCorrectSize(imageAddress);
            
            if (!imageIsFine){
                return new BadRequestResponse('Error', {
                    success: false,
                    response: 'The image must be greater than width: 590 and height: 350.',
                    error: null
                }).send(res);
            }

            const media: IMedia = (await _mediaService.create(title, imageAddress, req.headers.authorization)).media
            
            let dbMedia: DbMedia = null;
            if(type === 'subtitle') {
                const subtitleImages = await articleServices.getMediaBySubtitleId(relatedId);

                await Promise.all(subtitleImages.map(async (image) => await articleServices.deleteMedia(parseInt(image.id), parseInt(req.session.passport.user.id))))
                
                dbMedia = await articleServices.createMediaForSubtitle({
                    source_url: media.source_url,
                    title,
                    wpId: media.id,
                    subtitleId: relatedId,
                });
            }else if(type === 'article'){
                const articleImages = await articleServices.getMediaByArticleId(relatedId);

                await Promise.all(articleImages.map(async (image) => await articleServices.deleteMedia(parseInt(image.id), parseInt(req.session.passport.user.id))))
                
                dbMedia = await articleServices.createMediaForArticle({
                    source_url: media.source_url,
                    title,
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
}

export default Media;