/**
 * Get the html body of a web page
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import { InternalErrorResponse, SuccessResponse } from '../../../core/ApiResponse';
import { IFileSourceService } from '../../../interfaces/IFileSourceService';
import { IRequest, IResponse } from '../../../interfaces/vendors';
import Log from '../../../middlewares/Log';
import ExpressValidator from '../../../providers/ExpressValidation';
import Locals from '../../../providers/Locals';
import { FileSourceService } from '../../../services/source/fileSourceService';

class TelegramChannel {
    public static async refreshMessages(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new SuccessResponse('Success', {
                    errors: errors.array()
                }).send(res);
            }

            const fileSource: IFileSourceService = new FileSourceService();
            const fileResult = await fileSource.getFileSource(Locals.config().TELEGRAM_CHANNEL_JSON);

            

            return new SuccessResponse('Success', {
                success: true,
                url: req.body.url,
                response: fileResult,
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

export default TelegramChannel;