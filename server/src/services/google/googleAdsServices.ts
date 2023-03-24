import { body } from "express-validator";
import IGoogelAdsServices from "../../interfaces/IGoogelAdsServices";
import GoogleAds from "../../providers/GoogleAdsApi";
import Locals from "../../providers/Locals";
import { fetch } from "../../utils";

export default class googelAdsServices implements IGoogelAdsServices {

    async listCustomers(token: string): Promise<any> {
        try {
            const { client } = new GoogleAds();
            console.log(client)
            
            return client.listAccessibleCustomers(token);    
        } catch (error) {
            throw new Error(`Error in googelAdsServices at listCustomers ${error}`)   
        }
    }

    async listAccessibleCustomers(token: string): Promise<any> {
        try {
            const result = await fetch(`${Locals.config().GOOGLE_ADS_API_URL}v13/customers:listAccessibleCustomers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'developer-token': Locals.config().GOOGLE_ADS_TOKEN_PROGRAMADOR
                }
            });
            console.log(result)
            return result;
        } catch (error) {
            throw new Error(`Error in googelAdsServices at listCustomers ${error}`) 
        }
    }

    async getKeywordPlanCampaignKeywords(token: string): Promise<any> {
        try {
            const result = await fetch(`${Locals.config().GOOGLE_ADS_API_URL}v13/customers/9831967345/keywordPlanCampaignKeywords:mutate`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'developer-token': Locals.config().GOOGLE_ADS_TOKEN_PROGRAMADOR
                },
                body: JSON.stringify({
                    operations: [],
                    partialFailure: false,
                    validateOnly: false,
                })
            });
            console.log(result)
        } catch (error) {
            throw new Error(`Error in googelAdsServices at getKeywordPlanCampaignKeywords ${error}`)
        }
    }
}