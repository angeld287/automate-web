/**
 * Get the html body of a web page
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import { BadRequestResponse, InternalErrorResponse, SuccessResponse } from '../../../core/ApiResponse';
import IGoogelAdsServices from '../../../interfaces/IGoogelAdsServices';
import IGoogelServices from '../../../interfaces/IGoogelServices';
import IGoogleAdsKeywordPlansServices from '../../../interfaces/IGoogleAdsKeywordPlansServices';
import { IKeywordService } from '../../../interfaces/IKeywordService';
import { ISearchService } from '../../../interfaces/ISearchService';
import ITextSimilarityServices from '../../../interfaces/ITextSimilarityServices';
import IKeyword, { IKeywordSearchJob } from '../../../interfaces/models/Keyword';
import { IRequest, IResponse } from '../../../interfaces/vendors';
import Log from '../../../middlewares/Log';
import ExpressValidator from '../../../providers/ExpressValidation';
import NodeCron from '../../../providers/NodeCron';
import googleAdsKeywordPlansServices from '../../../services/google/googleAdsKeywordPlansServices';
import googelAdsServices from '../../../services/google/googleAdsServices';
import googelServices from '../../../services/google/googleServices';
import { keywordService } from '../../../services/keywords/keywordServices';
import { searchService } from '../../../services/searchEngine/searchService';
import textSimilarityServices from '../../../services/twinword/textSimilarityServices';

class SearchKeyword {
    public static async startJob(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            const longTailKeyword = req.body.longTailKeyword;
            const mainKeyword = req.body.mainKeyword;

            let keyword: IKeyword = {
                name: longTailKeyword,
                resultsSimilarity: []
            };

            let search: ISearchService = new searchService();
            let similarity: ITextSimilarityServices = new textSimilarityServices();
            let keywordS: IKeywordService = new keywordService();
            let google: IGoogelServices = new googelServices();
            let googleAds: IGoogelAdsServices = new googelAdsServices();
            let googlePlans: IGoogleAdsKeywordPlansServices = new googleAdsKeywordPlansServices();

            const result = await search.getResultsAndSuggestions(longTailKeyword);
            
            let searchJob: IKeywordSearchJob = await keywordS.createKeywordSearchJob({
                createdBy: req.session.passport.user.id
            } as IKeywordSearchJob)

            //const token = await google.refreshTokenAxios();
            
            //const customers = await googleAds.listCustomers(req.headers['google-access-token'].toString());
            //const keywordPlans = await googlePlans.generateForecastMetrics(req.headers['google-access-token'].toString());

            let similaritySum = 0
            await Promise.all(result.searchResult.map(async (itemResult) => {
                const similarityResponse = await similarity.checkSimilarity(longTailKeyword, itemResult.title)
                similaritySum = similaritySum + similarityResponse.similarity;
                keyword.resultsSimilarity.push({
                    name: itemResult.title,
                    similarity: similarityResponse.similarity,
                    value: similarityResponse.value
                })
            }))

            keyword.similarity = Math.round((similaritySum/10)*100);
            keyword.keywordSearchJobId = searchJob.id;

            const keywordAlreadyExist: IKeyword | false = await keywordS.getKeywordByName(keyword.name);

            if(keywordAlreadyExist === false)
                keyword = await keywordS.createKeyword(keyword);

            //let searchJob: NodeCron = new NodeCron([''], async () => {});
            //searchJob.startPotentialKeywordsSearchJob();

            return new SuccessResponse('Success', {
                success: true,
                error: null,
                result,
                keyword,
                //token,
                //customers,
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