import { BadRequestResponse, SuccessResponse } from "../../../core/ApiResponse";
import { RelType } from "../../../interfaces/Enums/RelType";
import { IPageSourceService } from "../../../interfaces/IPageSourceService";
import { ISearchService } from "../../../interfaces/ISearchService";
import { IRequest, IResponse } from "../../../interfaces/vendors";
import ExpressValidator from "../../../providers/ExpressValidation";
import { PageSourceService } from "../../../services/pageSource/pageSourceService";
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
        let _pageSourceService : IPageSourceService = new PageSourceService();
        
        const resultsList = await search.searchResults('5', '1', '"messi"')
        const doFollowList = [];

        await Promise.all(resultsList.map(async (result) => {
            const sourceCode = await _pageSourceService.getPageSource(result.link)
            let regex = new RegExp(`\\b(${RelType.SPONSORED})\\b`);
            doFollowList.push(sourceCode)
        }))

        return new SuccessResponse('Success', {
            success: true,
            error: null,
            response: doFollowList
        }).send(res);
    }
}

export default SearchDoFollowLinks