export default interface ILogin {
    getToken(siteId: number): Promise<any>;

    getTokenWithCredentials(username: string, password: string, siteId: number): Promise<any>;
}

export interface IAuthenticate {
    username: string;
    password: string;
}