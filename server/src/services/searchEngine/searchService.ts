import { ISearchService } from "../../interfaces/ISearchService";
import Locals from "../../providers/Locals";
import { axios } from "../../utils";
var request = require('request');

export class searchService implements ISearchService {
    async perform(index: string, keyword: string): Promise<Array<any>> {
        try {
            const response = await axios({ url: `${Locals.config().searchEngineUrl}&num=10&start=${index}&q=${encodeURIComponent(keyword)}` })
            if (!response.success) {
                return response;
            }

            await Promise.all(response.body.items.map(async (searchResult, index) => {

                if (index === 0) {
                    const snippet = searchResult.snippet;
                    const htmlSnippet = searchResult.htmlSnippet;
                    const pageSource = await searchService.requestPageSource(searchResult.link);



                }
            }));


            return response;
        } catch (error) {
            console.log(error)
        }
    }

    static async requestPageSource(url: string) {
        try {
            request(url, function (error, response, body) {
                if (error) {
                    return error
                }
                return response.body;
            });
        } catch (error) {
            throw new Error('Error getting the page source')
        }

    }
}