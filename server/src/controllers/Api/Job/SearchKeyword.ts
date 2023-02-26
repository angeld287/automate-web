/**
 * Get the html body of a web page
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import { BadRequestResponse, InternalErrorResponse, SuccessResponse } from '../../../core/ApiResponse';
import { ISearchService } from '../../../interfaces/ISearchService';
import { IRequest, IResponse } from '../../../interfaces/vendors';
import Log from '../../../middlewares/Log';
import ExpressValidator from '../../../providers/ExpressValidation';
import NodeCron from '../../../providers/NodeCron';
import { searchService } from '../../../services/searchEngine/searchService';

class SearchKeyword {
    public static async perform(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            let search: ISearchService = new searchService();

            const result = await search.getResultsAndSuggestions("1", "Que puedo comer después de tomar aceite de ricino");

            let searchJob: NodeCron = new NodeCron([''], async () => {
                
            });

            searchJob.startPotentialKeywordsSearchJob();

            return new SuccessResponse('Success', {
                success: true,
                error: null,
                result
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Translate Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }
}

export default SearchKeyword;