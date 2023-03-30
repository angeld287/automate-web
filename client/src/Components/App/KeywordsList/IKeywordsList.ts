import IKeyword from "../../../interfaces/models/Keyword";

export default interface IKeywordsList {
    items: Array<IKeyword>
}

export interface IKeywordsTable {
    selected?: string | React.ReactNode;
    similarity?: number;
    keyword: string | React.ReactNode;
    acciones?: Array<any>;
    id: string;
    dataName: string;
}