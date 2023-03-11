import { ButtonProps } from "antd";
import React from "react";

export default interface ICustomTable {
    headers: Array<ITableHeader>;
    items: Array<any>
    getItemsNextToken?: Function;
    itemsLoading?: boolean;
}

export interface IButton extends ButtonProps {
    id: string;
    text: string;
}

export interface ITableHeader {
    name: string;
    sorter: boolean;
}