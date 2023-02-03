import { ITranslateService } from "../../interfaces/ITranslateService";
import { TranslateResult } from "../../interfaces/response/TranslateResult";
import Locals from "../../providers/Locals";
import { axios, fetch } from "../../utils";
import {v4 as uuidv4} from 'uuid';

export class translateService implements ITranslateService {
    async perform(text: string, from: string, to: string): Promise<TranslateResult> {
        try {
            // Add your code here
            var options = {
                method: 'POST',
                url: Locals.config().translateApiUrl,
                headers: {
                    'Ocp-Apim-Subscription-Key': Locals.config().azureApiKey,
                    'Ocp-Apim-Subscription-Region': 'eastus',
                    'Content-type': 'application/json',
                    'X-ClientTraceId': uuidv4().toString(),
                },
                params: {
                    'api-version': '3.0',
                    from,
                    to,
                },
                data: [{ Text: text }]
            };

            const result = await axios(options);
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async performNf(text: string, from: string, to: string): Promise<TranslateResult> {
        console.log(Locals.config().azureApiKey)
        try {
            // Add your code here
            var options = {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': Locals.config().azureApiKey,
                    'Ocp-Apim-Subscription-Region': 'eastus',
                    'Content-type': 'application/json',
                    'X-ClientTraceId': uuidv4().toString(),
                },
                body: JSON.stringify([{ Text: text }])
            };

            //&text-type=plain&profanity-action=noaction
            const result = await fetch(`${Locals.config().translateApiUrl}?api-version=3.0&to=${to}&from=${from}`, options);
            return result;
        } catch (error) {
            console.log(error);
        }
    }
}