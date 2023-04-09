import { IArticle } from "../../../interfaces/models/Article";

export default interface IContentOrganizationStepper {
    open: boolean;
    setOpen: Function;
    article?: IArticle;
}