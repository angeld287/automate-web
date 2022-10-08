import { ISearchService } from "../../interfaces/ISearchService";
import Locals from "../../providers/Locals";
import { fetch } from "../../utils";

export class searchService implements ISearchService {
    async perform(index: string, keyword: string): Promise<Array<any>> {
        try {
            const result = await fetch(`${Locals.config().searchEngineUrl}&num=10&start=${index}&q=${encodeURIComponent(keyword)}`);
            return result.items
        } catch (error) {
            console.log(error)
        }
    }
}