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
            
            console.log(imageAddress);

            _mediaService.create("test.png", imageAddress, req.headers.authorization)

            return new SuccessResponse('Success', {
                success: true,
                response: [],
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