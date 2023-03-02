import ITokenResponse from "./response/ITokenResponse";

export default interface IGoogelServices {
    refreshToken(): Promise<ITokenResponse>;

    refreshTokenAxios(): Promise<ITokenResponse>;
}