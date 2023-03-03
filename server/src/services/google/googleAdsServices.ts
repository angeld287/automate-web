import IGoogelAdsServices from "../../interfaces/IGoogelAdsServices";
import GoogleAds from "../../providers/GoogleAdsApi";
import Locals from "../../providers/Locals";
import { fetch } from "../../utils";

export default class googelAdsServices implements IGoogelAdsServices {

    async listCustomers(token: string): Promise<any> {
        try {
            const { client } = new GoogleAds();
            return client.listAccessibleCustomers(token);    
        } catch (error) {
            throw new Error(`Error in googelAdsServices at listCustomers ${error}`)   
        }
    }
}