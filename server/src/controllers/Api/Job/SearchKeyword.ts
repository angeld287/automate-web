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
import NodeJob from '../../../providers/NodeJob';
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

            //google adsense used to get keywords statistic info.
            //let google: IGoogelServices = new googelServices();
            //let googleAds: IGoogelAdsServices = new googelAdsServices();
            //let googlePlans: IGoogleAdsKeywordPlansServices = new googleAdsKeywordPlansServices();

            //const token = await google.refreshTokenAxios();
            
            //const customers = await googleAds.listCustomers(req.headers['google-access-token'].toString());
            //const keywordPlans = await googlePlans.generateForecastMetrics(req.headers['google-access-token'].toString());

            let search: ISearchService = new searchService();
            let similarity: ITextSimilarityServices = new textSimilarityServices();
            let keywordS: IKeywordService = new keywordService();
            let keywords: Array<IKeyword> = [
                {
                    name: longTailKeyword,
                    resultsSimilarity: []
                }
            ]

            let searchJob: IKeywordSearchJob = await keywordS.createKeywordSearchJob({
                createdBy: req.session.passport.user.id,
                status: `RUNNING`,
                longTailKeyword
            } as IKeywordSearchJob)


            const searchJobNode: NodeJob = new NodeJob();
            searchJobNode.startJob(`JOB-${searchJob.id}`, async () => {
                console.log('FUNCTION CALLED!')

                for (let i = 0; i < keywords.length; i++) {
                    let keyword: IKeyword = keywords[i];
                    let result = await search.getResultsAndSuggestions(keyword.name);
                    result.relatedSearch = result.relatedSearch.filter(related =>  related.name.includes(mainKeyword));
                    
                    let similaritySum = 0;
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
                    const othersKeywords = result.relatedSearch.filter(keyword => keywords.filter(globalKeyword => keyword.name.toLowerCase() === globalKeyword.name.toLowerCase()).length === 0).map(keyword => ({...keyword, resultsSimilarity: []}))
        
                    keywords = [...keywords, ...othersKeywords];
                    
                    const keywordAlreadyExist: IKeyword | false = await keywordS.getKeywordByName(keyword.name);
        
                    console.log(keyword.name)
                    if(keywordAlreadyExist === false)
                        keyword = await keywordS.createKeyword(keyword);   
                }
            })
            return new SuccessResponse('Success', {
                success: true,
                error: null,
                jobDetails: searchJob
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('SearchKeyword Job Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async stopJob(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            const jobId = req.body.jobId;
            
            const searchJobNode: NodeJob = new NodeJob();
            searchJobNode.stopJob(`JOB-${jobId}`);

            return new SuccessResponse('Success', {
                success: true,
                error: null,
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('SearchKeyword Job Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async getJobDetails(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            const jobId = req.body.jobId;
            
            const searchJobNode: NodeJob = new NodeJob();
            const detils = searchJobNode.getDetails(`JOB-${jobId}`);

            return new SuccessResponse('Success', {
                success: true,
                error: null,
                result: detils
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('SearchKeyword Job Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }
}

export default SearchKeyword;