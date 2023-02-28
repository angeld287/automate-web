/**
 * Get the html body of a web page
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import { BadRequestResponse, InternalErrorResponse, SuccessResponse } from '../../../core/ApiResponse';
import { ISearchService } from '../../../interfaces/ISearchService';
import ITextSimilarityServices from '../../../interfaces/ITextSimilarityServices';
import IKeyword from '../../../interfaces/models/Keyword';
import { IRequest, IResponse } from '../../../interfaces/vendors';
import Log from '../../../middlewares/Log';
import ExpressValidator from '../../../providers/ExpressValidation';
import NodeCron from '../../../providers/NodeCron';
import { searchService } from '../../../services/searchEngine/searchService';
import textSimilarityServices from '../../../services/twinword/textSimilarityServices';

class SearchKeyword {
    public static async perform(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            const longTailKeyword = req.body.longTailKeyword;
            const mainKeyword = req.body.mainKeyword;

            const keyword: IKeyword = {
                name: longTailKeyword,
                resultsSimilarity: []
            };

            let search: ISearchService = new searchService();
            let similarity: ITextSimilarityServices = new textSimilarityServices();

            const result = await search.getResultsAndSuggestions(longTailKeyword);

            await Promise.all(result.searchResult.map(async (itemResult) => {
                const similarityResponse = await similarity.checkSimilarity(longTailKeyword, itemResult.title)
                keyword.resultsSimilarity.push({
                    name: itemResult.title,
                    similarity: similarityResponse.similarity,
                    value: similarityResponse.value
                })
            }))

            //let searchJob: NodeCron = new NodeCron([''], async () => {});
            //searchJob.startPotentialKeywordsSearchJob();

            return new SuccessResponse('Success', {
                success: true,
                error: null,
                result,
                keyword
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