import { BadRequestResponse, SuccessResponse } from "../../../core/ApiResponse";
import { ISearchService } from "../../../interfaces/ISearchService";
import { ITwittsService } from "../../../interfaces/ITwittsService";
import IfbGraphService from "../../../interfaces/IfbGraphServices";
import { IRequest, IResponse } from "../../../interfaces/vendors";
import ExpressValidator from "../../../providers/ExpressValidation";
import { fbGraphServices } from "../../../services/facebook/fbGraphServices";
import { searchService } from "../../../services/searchEngine/searchService";
import { twitsService } from "../../../services/twitter/twitsServices";

class SearchSalesOpportunities {
    public static async startTwitterSeachJob(req: IRequest, res: IResponse): Promise<any> {
        const errors = new ExpressValidator().validator(req);

        if (!errors.isEmpty()) {
            return new BadRequestResponse('Error', {
                errors: errors.array()
            }).send(res);
        }

        let search: ITwittsService = new twitsService();

        //search.getRecentTwits();
        search.getTwits();

        return new SuccessResponse('Success', {
            success: true,
            error: null,
            response: ''
        }).send(res);
    }

    public static async startSeachJobGoogleTwitter(req: IRequest, res: IResponse): Promise<any> {
        const errors = new ExpressValidator().validator(req);

        if (!errors.isEmpty()) {
            return new BadRequestResponse('Error', {
                errors: errors.array()
            }).send(res);
        }

        let search: ISearchService = new searchService();

        const result = search.searchRecents("1", "messi");

        return new SuccessResponse('Success', {
            success: true,
            error: null,
            response: result
        }).send(res);
    }

    public static async startFBSeachJob(req: IRequest, res: IResponse): Promise<any> {
        const errors = new ExpressValidator().validator(req);

        if (!errors.isEmpty()) {
            return new BadRequestResponse('Error', {
                errors: errors.array()
            }).send(res);
        }

        let search: IfbGraphService = new fbGraphServices();

        search.getPosts();

        return new SuccessResponse('Success', {
            success: true,
            error: null,
            response: ''
        }).send(res);
    }
}

export default SearchSalesOpportunities