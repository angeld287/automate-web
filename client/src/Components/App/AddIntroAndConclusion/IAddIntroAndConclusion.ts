import IContent from "../../../interfaces/models/Content";
import IModal from "../../CustomModal/IModal";

export default interface IAddIntroAndConclusion extends IModal {
    articleId: number;
    type: 'introduction' | 'conclusion';
    image?: string;
    contents?: Array<IContent>;
}