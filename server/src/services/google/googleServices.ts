import IGoogelServices from "../../interfaces/IGoogelAdsServices";
import ITokenResponse from "../../interfaces/response/ITokenResponse";
import Locals from "../../providers/Locals";
import { fetch } from "../../utils";

export default class googelAdsServices implements IGoogelServices {

    async refreshToken(): Promise<ITokenResponse> {
        const result = await fetch(`${Locals.config().GOOGLE_ACCESS_TOKEN_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                grant_type: "refresh_token",
                client_id: Locals.config().GOOGLE_AUTH_CLIENT_ID,
                client_secret: Locals.config().GOOGLE_AUTH_CLIENT_SECRET,
                refresh_token: ""
            })
        });
        return result.body;
    }
}