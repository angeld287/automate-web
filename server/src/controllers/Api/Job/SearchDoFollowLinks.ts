import { BadRequestResponse, SuccessResponse } from "../../../core/ApiResponse";
import { RelType } from "../../../interfaces/Enums/RelType";
import { IPageSourceService } from "../../../interfaces/IPageSourceService";
import { ISearchService } from "../../../interfaces/ISearchService";
import { IRequest, IResponse } from "../../../interfaces/vendors";
import ExpressValidator from "../../../providers/ExpressValidation";
import { PageSourceService } from "../../../services/pageSource/pageSourceService";
import { searchService } from "../../../services/searchEngine/searchService";
import { relRegrexs } from "../../../utils";

class SearchDoFollowLinks {
    public static async startDofollowSearchJob(req: IRequest, res: IResponse): Promise<any> {
        const errors = new ExpressValidator().validator(req);

        if (!errors.isEmpty()) {
            return new BadRequestResponse('Error', {
                errors: errors.array()
            }).send(res);
        }
        let search: ISearchService = new searchService();
        let _pageSourceService : IPageSourceService = new PageSourceService();
        
        const resultsList = await search.searchResults('1', '1', '"messi"');

        const sourceCode: string = await _pageSourceService.getPageSource(resultsList[0].link);
        const rels = ""
        relRegrexs.forEach(rel => {
            let regrexResult = sourceCode.match(rel.regrex);
            console.log(regrexResult)
        });

        return new SuccessResponse('Success', {
            success: true,
            error: null,
            response: 'The process has been started!'
        }).send(res);
    }
}

export default SearchDoFollowLinks