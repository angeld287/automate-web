import IBacklink from "./models/IBacklink";

export default interface IBacklinksServices {
    createSite(backlink: IBacklink): Promise<IBacklink>;

    updateSite(site: IBacklink): Promise<IBacklink | false>;

    getBacklinksByOwner(userId: number): Promise<Array<IBacklink>>;

    getBacklinkById(id: number): Promise<IBacklink | false>;
    
}