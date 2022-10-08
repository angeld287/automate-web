import { ITranslateService } from "../../interfaces/ITranslateService";
import { TranslateResult } from "../../interfaces/response/TranslateResult";
import Locals from "../../providers/Locals";
import { axios } from "../../utils/axios-utils";

export class translateService implements ITranslateService {
    async perform(text: string, to: string): Promise<TranslateResult> {
        // Add your code here
        var options = {
            method: 'POST',
            url: Locals.config().translateApiUrl,
            headers: {
                'content-type': 'application/json',
                'x-rapidapi-key': Locals.config().rapiApiKey,
                'x-rapidapi-host': Locals.config().rapiApiHost
            },
            params: {
                'api-version': '3.0',
                to: to,
                textType: 'plain',
                profanityAction: 'NoAction'
            },
            data: [{ Text: text }]
        };

        const result = await axios(options);
        return result;
    }
}