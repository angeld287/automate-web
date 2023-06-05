import { BadRequestResponse, SuccessResponse } from "../../../core/ApiResponse";
import { ITwittsService } from "../../../interfaces/ITwittsService";
import { IRequest, IResponse } from "../../../interfaces/vendors";
import ExpressValidator from "../../../providers/ExpressValidation";
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
}

export default SearchSalesOpportunities