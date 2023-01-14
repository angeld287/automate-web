import Locals from "../../config/Locals";
import { IResponse, ResponseStatus, StatusCode } from "../../interfaces/models/IResponse";
import { IRegisterUser } from "../../interfaces/models/IUser";

export const Register =  async (user: IRegisterUser): Promise<IResponse> => {
    try {
        const userFetch = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}auth/register`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
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