import IGoogelAdsServices from "../../interfaces/IGoogelAdsServices";
import Locals from "../../providers/Locals";
import { fetch } from "../../utils";

export default class googelAdsServices implements IGoogelAdsServices {

    async listAccessibleCustomers(token: string): Promise<any> {
        const result = await fetch(`${Locals.config().GOOGLE_ADS_API_URL}v13/customers:listAccessibleCustomers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'developer-token': Locals.config().GOOGLE_ADS_TOKEN_PROGRAMADOR
            }
        });
        return result.body;
    }
}