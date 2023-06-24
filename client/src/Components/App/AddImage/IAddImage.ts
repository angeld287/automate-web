import IModal from "../../CustomModal/IModal";

export default interface IAddImage extends IModal {
    title: string;
    relatedId: number;
    type?: 'subtitle' | 'article'
}