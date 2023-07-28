import { BadRequestResponse, SuccessResponse } from "../../../core/ApiResponse";
import { IPageSourceService } from "../../../interfaces/IPageSourceService";
import { ISearchService } from "../../../interfaces/ISearchService";
import { IRequest, IResponse } from "../../../interfaces/vendors";
import ExpressValidator from "../../../providers/ExpressValidation";
import { PageSourceService } from "../../../services/source/pageSourceService";
import { searchService } from "../../../services/searchEngine/searchService";
import { relRegrexs } from "../../../utils";
import { BacklinksServices } from "../../../services/backlinksServices/backlinksServices";
import IBacklinksServices from "../../../interfaces/IBacklinksServices";
import { BackklinksState } from "../../../interfaces/Enums/States";
import IBacklink from "../../../interfaces/models/IBacklink";

class SearchDoFollowLinks {
    public static async startDofollowSearchJob(req: IRequest, res: IResponse): Promise<any> {
        const errors = new ExpressValidator().validator(req);

        if (!errors.isEmpty()) {
            return new BadRequestResponse('Error', {
                errors: errors.array()
            }).send(res);
        }
        let search: ISearchService = new searchService();
        let backlinksService: IBacklinksServices = new BacklinksServices();
        let _pageSourceService : IPageSourceService = new PageSourceService();
        
        const resultsList = await search.searchResults('1', '1', req.body.query);

        const sourceCode = await _pageSourceService.getPageSource(resultsList[0].link);
        
        let rels = ""

        relRegrexs.forEach(rel => {
            let regrexResult = sourceCode.sourceHtml.body.match(rel.regrex);
            if(regrexResult !== null){
                rels = rels === "" ? rel.type : `${rels},${rel.type}`
            }
        });

        const backlink: IBacklink | false = await backlinksService.getBacklinkByLink(resultsList[0].link)

        if(!backlink){
            await backlinksService.createBacklink({
                link: resultsList[0].link,
                title: resultsList[0].title,
                snippet: resultsList[0].snippet,
                createdBy: parseInt(req.session.passport.user.id),
                state: BackklinksState.NEW,
                rel: rels,
            })
        }
        
        return new SuccessResponse('Success', {
            success: true,
            error: null,
            response: 'The process has been started!',
            rels: rels
        }).send(res);
    }

    public static async getBacklinksByState(req: IRequest, res: IResponse): Promise<any> {

        if(!req.query.state){
            return new BadRequestResponse('Error', {
                error: "Param state is required."
            }).send(res);
        }
        let backlinksService: IBacklinksServices = new BacklinksServices();
        const userId = req.session.passport.user.id;
        
        const list = await backlinksService.getBacklinksByState(parseInt(userId), req.query.state.toString())

        return new SuccessResponse('Success', {
            success: true,
            error: null,
            response: list,
        }).send(res);
    }

    public static async changeBacklinksState(req: IRequest, res: IResponse): Promise<any> {

        const errors = new ExpressValidator().validator(req);

        if (!errors.isEmpty()) {
            return new BadRequestResponse('Error', {
                errors: errors.array()
            }).send(res);
        }

        let backlinksService: IBacklinksServices = new BacklinksServices();

        const backlink: IBacklink | false = await backlinksService.getBacklinkById(parseInt(req.body.id))

        if(backlink === false){
            return new BadRequestResponse('Error', {
                error: "The backlink does not exist."
            }).send(res);
        }

        backlink.state = req.body.state
        
        const result = await backlinksService.updateBacklink(backlink)

        return new SuccessResponse('Success', {
            success: true,
            error: null,
            response: result,
        }).send(res);
    }

    public static async setBacklinkCredentials(req: IRequest, res: IResponse): Promise<any> {

        const errors = new ExpressValidator().validator(req);

        if (!errors.isEmpty()) {
            return new BadRequestResponse('Error', {
                errors: errors.array()
            }).send(res);
        }

        let backlinksService: IBacklinksServices = new BacklinksServices();

        const backlink: IBacklink | false = await backlinksService.getBacklinkById(parseInt(req.body.id))

        if(backlink === false){
            return new BadRequestResponse('Error', {
                error: "The backlink does not exist."
            }).send(res);
        }

        backlink.state = req.body.state
        backlink.accountUser = req.body.accountUser
        backlink.accountUserPass = req.body.accountUserPass
        
        const result = await backlinksService.updateBacklink(backlink)

        return new SuccessResponse('Success', {
            success: true,
            error: null,
            response: result,
        }).send(res);
    }
}

export default SearchDoFollowLinks