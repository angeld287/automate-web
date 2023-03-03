import { GoogleAdsApi } from "google-ads-api";
import Locals from "./Locals";
//import Log from '../middlewares/Log';

class GoogleAds {
    public client: GoogleAdsApi;

    constructor() {
        this.client = this.createClient();
    }

    private createClient(): GoogleAdsApi {
        return new GoogleAdsApi({
            client_id: Locals.config().GOOGLE_AUTH_CLIENT_ID,
            client_secret: Locals.config().GOOGLE_AUTH_CLIENT_SECRET,
            developer_token: Locals.config().GOOGLE_ADS_TOKEN_PROGRAMADOR,
        })
    }
}

export default GoogleAds;