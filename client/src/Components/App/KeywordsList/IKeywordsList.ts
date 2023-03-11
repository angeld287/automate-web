import IKeyword from "../../../interfaces/models/Keyword";

export default interface IKeywordsList {
    items: Array<IKeyword>
}

export interface IKeywordsTable {
    keyword: string | React.ReactNode;
    acciones?: Array<any>;
    id: string;
}