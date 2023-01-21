export default interface ILogin {
    getToken(): Promise<any>;
}

export interface IAuthenticate {
    username: string;
    password: string;
}