import IModal from "../../CustomModal/IModal";

export default interface ISearchGoogleImage extends IModal {
    title: string;
    relatedId: number;
    type: 'subtitle' | 'article'
}