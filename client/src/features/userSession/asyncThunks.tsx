import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICredentials } from "./IUserSession";
import { GetSession, Login, Logout } from "./userSessionAPI";


export const loginAsync = createAsyncThunk(
    'userSession/login',
    async (args: ICredentials) => {
        return await Login(args.username, args.password);
    }
);

export const logoutAsync = createAsyncThunk(
    'userSession/logout',
    async () => {
        return await Logout();
    }
);

export const getSessionAsync = createAsyncThunk(
    'userSession/getsession',
    async () => {
        return await GetSession();
    }
);