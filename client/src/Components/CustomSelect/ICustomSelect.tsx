import { SelectProps } from "antd";
import { ReactNode } from "react";

export interface ICustomSelect extends SelectProps {
    dataTestId?: string;
    items: Array<ISelectOptions>;
    getItemsNextToken?: Function;
    name: string;
}

export interface ISelectOptions {
    id?: string;
    name: string | ReactNode;
}