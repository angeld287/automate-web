import IGoogelServices from "../../interfaces/IGoogelServices";
import ITokenResponse from "../../interfaces/response/ITokenResponse";
import Locals from "../../providers/Locals";
import { axios, fetch } from "../../utils";

export default class googelServices implements IGoogelServices {

    async refreshToken(): Promise<ITokenResponse> {
        const result = await fetch(Locals.config().GOOGLE_ACCESS_TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                grant_type: "refresh_token",
                client_id: Locals.config().GOOGLE_AUTH_CLIENT_ID,
                client_secret: Locals.config().GOOGLE_AUTH_CLIENT_SECRET,
                refresh_token: Locals.config().GOOGLE_ACCESS_REFRESH_TOKEN
            })
        });
        return result.body;
    }

    async refreshTokenAxios(): Promise<ITokenResponse> {
        const result = await axios({
            url: Locals.config().GOOGLE_ACCESS_TOKEN_URL,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                grant_type: "refresh_token",
                client_id: Locals.config().GOOGLE_AUTH_CLIENT_ID,
                client_secret: Locals.config().GOOGLE_AUTH_CLIENT_SECRET,
                refresh_token: Locals.config().GOOGLE_ACCESS_REFRESH_TOKEN
            })
        });
        return result.body;
    }
}