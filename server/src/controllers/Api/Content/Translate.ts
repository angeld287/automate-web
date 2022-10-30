/**
 * Get the html body of a web page
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import { BadRequestResponse, InternalErrorResponse, SuccessResponse } from '../../../core/ApiResponse';
import { ITranslateService } from '../../../interfaces/ITranslateService';
import { IRequest, IResponse } from '../../../interfaces/vendors';
import Log from '../../../middlewares/Log';
import ExpressValidator from '../../../providers/ExpressValidation';
import { translateService } from '../../../services/translation/translateService';

class Translate {
    public static async perform(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            let translate: ITranslateService = new translateService();
            const translation = (await translate.perform(req.body.text, req.body.language)).body[0]['translations'][0].text

            return new SuccessResponse('Success', {
                success: true,
                response: translation,
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

export default Translate;