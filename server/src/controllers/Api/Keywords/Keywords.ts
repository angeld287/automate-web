/**
 * Get the html body of a web page
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import { BadRequestResponse, InternalErrorResponse, SuccessResponse } from '../../../core/ApiResponse';
import { IKeywordService } from '../../../interfaces/IKeywordService';
import IKeyword, { IKeywordSearchJob } from '../../../interfaces/models/Keyword';
import { IRequest, IResponse } from '../../../interfaces/vendors';
import Log from '../../../middlewares/Log';
import ExpressValidator, { ValidateErrors } from '../../../providers/ExpressValidation';
import { keywordService } from '../../../services/keywords/keywordServices';

class Keywords {

    public static async createKeywordForArticle(req: IRequest, res: IResponse): Promise<any> {
        try {

            if(ValidateErrors.validate(req, res) !== true) return

            const _keywordService: IKeywordService = new keywordService()
            
            const articleId = req.body.articleId;
            const name = req.body.name;
            const orderNumber = req.body.orderNumber;

            let keyowrd = await _keywordService.getKeywordByName(name)
            if(keyowrd === false){
                keyowrd = await _keywordService.createKeyword({
                    name,
                    articleId,
                    orderNumber
                })
            }else{
                if(keyowrd.articleId){
                    return new BadRequestResponse('Error', {
                        error: `This keyword is used by article: ${keyowrd.articleId}`
                    }).send(res);
                }

                keyowrd.orderNumber = orderNumber;
                keyowrd.articleId = articleId;
                keyowrd = await _keywordService.updateKeyword(keyowrd);
            }
            

            return new SuccessResponse('Success', {
                success: true,
                response: keyowrd,
                error: null
            }).send(res);
        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Keywords Controller Error - selectPotentialKeyword', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

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
            return new InternalErrorResponse('Keywords Controller Error', {
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
            return new InternalErrorResponse('Keywords Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async selectPotentialKeyword(req: IRequest, res: IResponse): Promise<any> {
        try {

            if(ValidateErrors.validate(req, res) !== true) return

            const _keywordService: IKeywordService = new keywordService()
            
            const id = req.body.id;
            const selected = req.body.selected;

            let keyowrd: IKeyword = await _keywordService.getKeywordsById(id)
            keyowrd.selected = selected;
            keyowrd = await _keywordService.updateKeyword(keyowrd)

            return new SuccessResponse('Success', {
                success: true,
                response: keyowrd,
                error: null
            }).send(res);
        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Keywords Controller Error - selectPotentialKeyword', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async addRemoveKeywordToArticle(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(ValidateErrors.validate(req, res) !== true) return

            const _keywordService: IKeywordService = new keywordService()
            
            const id = req.body.id;
            const articleId = req.body.articleId ? req.body.articleId : null;
            const orderNumber = req.body.orderNumber ? req.body.orderNumber : null;

            let keyowrd: IKeyword = await _keywordService.getKeywordsById(id)
            keyowrd.articleId = articleId;
            keyowrd.orderNumber = orderNumber;
            keyowrd = await _keywordService.updateKeyword(keyowrd)

            return new SuccessResponse('Success', {
                success: true,
                response: keyowrd,
                error: null
            }).send(res);
        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Keywords Controller Error - selectPotentialKeyword', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async setMainKeyword(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(ValidateErrors.validate(req, res) !== true) return

            const _keywordService: IKeywordService = new keywordService()
            
            const id = req.body.id;
            const isMain = req.body.isMain;

            let keyowrd: IKeyword = await _keywordService.getKeywordsById(id)
            keyowrd.isMain = isMain;
            keyowrd = await _keywordService.updateKeyword(keyowrd)

            return new SuccessResponse('Success', {
                success: true,
                response: keyowrd,
                error: null
            }).send(res);
        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Keywords Controller Error - setMainKeyword', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async updateKeywordCategory(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(ValidateErrors.validate(req, res) !== true) return

            const _keywordService: IKeywordService = new keywordService()
            
            const id = req.body.id;
            const category: string = req.body.category;

            let keyowrd: IKeyword = await _keywordService.getKeywordsById(id)
            keyowrd.category = category.toLowerCase();
            keyowrd = await _keywordService.updateKeyword(keyowrd)

            return new SuccessResponse('Success', {
                success: true,
                response: keyowrd,
                error: null
            }).send(res);
        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Keywords Controller Error - setMainKeyword', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async getArticleKeywords(req: IRequest, res: IResponse): Promise<any> {
        try {

            if(!req.query.articleId){
                return new BadRequestResponse('Error', {
                    error: "Param articleId are required."
                }).send(res);
            }
           
            const _keywordService: IKeywordService = new keywordService()
            const articleId: number = parseInt(req.query.articleId.toString());

            const keywords = await _keywordService.getKeywordsByArticleId(articleId);

            return new SuccessResponse('Success', {
                success: true,
                response: keywords,
                error: null
            }).send(res);
        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Keywords Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

}

export default Keywords;