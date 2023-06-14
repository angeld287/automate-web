export default interface ISite {
    id?: number;
    name: string;
    domain: string;
    createdBy?: number;
    selected: boolean;
    wpUser: string;
    wpUserPass: string;
}