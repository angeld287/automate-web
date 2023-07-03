import { BackklinksState } from "../Enums/States";

export default interface IBacklink {
    id: number;
    link: string;
    state: BackklinksState;
    rel: string;
    createdBy: number;
    accountUser?: string;
    accountUserPass?: string;
}