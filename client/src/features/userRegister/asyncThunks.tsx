import { createAsyncThunk } from "@reduxjs/toolkit";
import { IRegisterUser } from "../../interfaces/models/IUser";
import { Register } from "./userRegisterAPI";

export const registerAsync = createAsyncThunk(
    'userRegister/register',
    async (args: IRegisterUser) => {
        return await Register(args);
    }
);