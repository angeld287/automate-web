/**
 * Get the html body of a web page
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import { BadRequestResponse, InternalErrorResponse, SuccessResponse } from '../../../core/ApiResponse';
import { IKeywordService } from '../../../interfaces/IKeywordService';
import { IRequest, IResponse } from '../../../interfaces/vendors';
import Log from '../../../middlewares/Log';
import ExpressValidator from '../../../providers/ExpressValidation';
import { keywordService } from '../../../services/keywords/keywordServices';

class Keywords {
    public static async getSearchJob(req: IRequest, res: IResponse): Promise<any> {
        try {

            if(!req.query.id){
                return new BadRequestResponse('Error', {
                    error: "Param id are required."
                }).send(res);
            }

            const id = parseInt(req.query.id.toString());
            const _keywordService: IKeywordService = new keywordService()

            const job = await _keywordService.getKeywordSearchJob(id);

            return new SuccessResponse('Success', {
                success: true,
                response: job,
                error: null
            }).send(res);
        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Page Source Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async getAllSearchJobs(req: IRequest, res: IResponse): Promise<any> {
        try {
           
            const _keywordService: IKeywordService = new keywordService()
            const userId: number = parseInt(req.session.passport.user.id);

            const jobs = await _keywordService.getAllKeywordSearchJobs(userId);

            return new SuccessResponse('Success', {
                success: true,
                response: jobs,
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

export default Keywords;