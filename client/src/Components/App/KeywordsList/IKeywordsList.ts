import IKeyword from "../../../interfaces/models/Keyword";
import { ICustomButton } from "../../CustomButton/ICustomButton";
import { ICustomSelect } from "../../CustomSelect/ICustomSelect";

export default interface IKeywordsList {
    items: Array<IKeyword>
}

export interface IKeywordsTable {
    selected?: string | React.ReactNode;
    similarity?: number;
    keyword: string | React.ReactNode;
    actions?: Array<IAction>;
    id: string;
    dataName: string;
}

export interface IAction {
    type: 'select' | 'button',
    component: any
}