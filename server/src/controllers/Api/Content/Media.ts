/**
 * Get the html body of a web page
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import { BadRequestResponse, InternalErrorResponse, SuccessResponse } from '../../../core/ApiResponse';
import { IRequest, IResponse } from '../../../interfaces/vendors';
import { IMediaService } from '../../../interfaces/wordpress/IMediaService';
import Log from '../../../middlewares/Log';
import ExpressValidator from '../../../providers/ExpressValidation';
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
            const imageAddress = req.body.imageAddress
            const title = req.body.title

            const imageIsFine = await _mediaService.imageHaveCorrectSize(imageAddress);
            
            if (!imageIsFine){
                return new BadRequestResponse('Error', {
                    success: false,
                    response: 'The image must be greater than width: 590 and height: 350.',
                    error: null
                }).send(res);
            }

            const media: Media = (await _mediaService.create(title, imageAddress, req.headers.authorization)).media

            return new SuccessResponse('Success', {
                success: true,
                response: media,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Page Source Error', {
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

            const media: Media = (await _mediaService.update(id, { title: title }, req.headers.authorization)).media

            return new SuccessResponse('Success', {
                success: true,
                response: media,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Page Source Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }
}

export default Media;