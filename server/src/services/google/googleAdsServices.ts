import IGoogelAdsServices from "../../interfaces/IGoogelAdsServices";
import Locals from "../../providers/Locals";
import { fetch } from "../../utils";

export default class googelAdsServices implements IGoogelAdsServices {

    async refreshToken(): Promise<any> {
        const result = await fetch(`${Locals.config().GOOGLE_ADS_API_URL}v13/customers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer`
            }
        });
        return result.body;
    }
}