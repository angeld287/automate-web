export default interface ILogin {
    getToken(): Promise<any>;

    getTokenWithCredentials(username: string, password: string): Promise<any>;
}

export interface IAuthenticate {
    username: string;
    password: string;
}