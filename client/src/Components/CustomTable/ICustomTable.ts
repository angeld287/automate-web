import { ButtonProps } from "antd";
import { ColumnType } from "antd/es/table";
import React from "react";
import { IKeywordsTable } from "../App/KeywordsList/IKeywordsList";

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

export interface ITableHeader extends ColumnType<IKeywordsTable> {
    name: string;
    sorter: boolean;
}