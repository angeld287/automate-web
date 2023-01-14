import Locals from "../../config/Locals";
import { IResponse, ResponseStatus, StatusCode } from "../../interfaces/models/IResponse";

export const Login = async (username: string, password: string): Promise<IResponse> => {
    try {
        const userFetch = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        return await userFetch.json();

    } catch (error) {
        console.log('error', error);

        return new Promise<IResponse>(() => ({
            status: ResponseStatus.INTERNAL_ERROR,
            message: 'Internal Application Error',
            statusCode: StatusCode.FAILURE,
            data: error
        })
        );
    }
}

export const Logout = async (): Promise<IResponse> => {
    const logoutFetch = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    return await logoutFetch.json();
}

export const GetSession = async (): Promise<IResponse> => {
    const sessionFetch = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}auth/getsession`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    return await sessionFetch.json();
}