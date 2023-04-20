import { Dispatch, SetStateAction } from "react";
import { IArticle } from "../../../interfaces/models/Article";
import IContent from "../../../interfaces/models/Content";
import IModal from "../../CustomModal/IModal";

export default interface IAddIntroAndConclusion extends IModal {
    articleId?: number;
    relatedId?: number;
    type: 'introduction' | 'conclusion';
    image?: string;
    contents?: Array<IContent>;
    openImageSearch: Function | Dispatch<SetStateAction<Boolean>>;
    setImageType: Function | Dispatch<SetStateAction<"article" | "subtitle">>;
    setSelectedItem: Function | Dispatch<SetStateAction<any>>;
    imageSearch: boolean;
    article: IArticle;
}