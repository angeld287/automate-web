import { BadRequestResponse, SuccessResponse } from "../../../core/ApiResponse";
import { ISearchService } from "../../../interfaces/ISearchService";
import { IRequest, IResponse } from "../../../interfaces/vendors";
import ExpressValidator from "../../../providers/ExpressValidation";
import { searchService } from "../../../services/searchEngine/searchService";

class SearchDoFollowLinks {
    public static async startDofollowSearchJob(req: IRequest, res: IResponse): Promise<any> {
        const errors = new ExpressValidator().validator(req);

        if (!errors.isEmpty()) {
            return new BadRequestResponse('Error', {
                errors: errors.array()
            }).send(res);
        }
        let search: ISearchService = new searchService();  
        
        const resultsList = await search.searchResults('1', '"messi"')

        resultsList.forEach(result => {
            
        });

        return new SuccessResponse('Success', {
            success: true,
            error: null,
            response: []
        }).send(res);
    }
}

export default SearchDoFollowLinks