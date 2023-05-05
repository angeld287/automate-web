import ISite from "./models/ISite";

export default interface ISitesService {
    createSite(site: ISite): Promise<ISite>;

    updateArticle(site: ISite): Promise<ISite | false>;

    getSiteListByOwner(userId: number): Promise<Array<ISite>>;
}