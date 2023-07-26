import IBacklink from "./models/IBacklink";

export default interface IBacklinksServices {
    createBacklink(backlink: IBacklink): Promise<IBacklink>;

    updateBacklink(site: IBacklink): Promise<IBacklink | false>;

    getBacklinksByOwner(userId: number): Promise<Array<IBacklink>>;

    getBacklinkById(id: number): Promise<IBacklink | false>;

    getBacklinksByState(userId: number, state: string): Promise<Array<IBacklink>>;

    getBacklinkByLink(link: string): Promise<IBacklink | false>;
    
}