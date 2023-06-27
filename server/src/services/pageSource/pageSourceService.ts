import { IPageSourceService } from "../../interfaces/IPageSourceService";
var request = require('request');

export class PageSourceService implements IPageSourceService {
    async getPageSource(url: string): Promise<any> {
        try {
            return new Promise<{ sourceHtml: string }>((resolve, rejects) =>
                request(url, function (error, response, body) {
                    if (error !== null) {
                        return rejects({ sourceHtml: '' })
                    }
                    return resolve({ sourceHtml: response })
                })
            );
        } catch (error) {
            throw new Error(error.message);
        }
    }
}