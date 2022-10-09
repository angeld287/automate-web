import { ISearchService } from "../../interfaces/ISearchService";
import Locals from "../../providers/Locals";
import { axios } from "../../utils";

export class searchService implements ISearchService {
    async perform(index: string, keyword: string): Promise<Array<any>> {
        try {
            const response = await axios({ url: `${Locals.config().searchEngineUrl}&num=10&start=${index}&q=${encodeURIComponent(keyword)}` })
            return response;
        } catch (error) {
            console.log(error)
        }
    }
}