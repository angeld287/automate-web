import IGoogleAdsKeywordPlansServices from "../../interfaces/IGoogleAdsKeywordPlansServices";
import Locals from "../../providers/Locals";
import { fetch } from "../../utils";

export default class googleAdsKeywordPlansServices implements IGoogleAdsKeywordPlansServices {

    async generateForecastMetrics(token: string): Promise<any> {
        const result = await fetch(`${Locals.config().GOOGLE_ADS_API_URL}v13/{keywordPlan=customers/9831967345/keywordPlans/aceite}:generateForecastMetrics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'developer-token': Locals.config().GOOGLE_ADS_TOKEN_PROGRAMADOR
            }
        });
        console.log(result)
        return result.body;
    }
}