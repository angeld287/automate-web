import { Dispatch, SetStateAction } from "react";
import { IOption } from "../../interfaces/models/Utils";

export default interface IMultipleCreatableSelect {
    value:any; // IOption[];
    setValue: any;//Dispatch<SetStateAction<IOption[]>>;
}