export interface IPageSourceService {
    getPageSource(url: string): Promise<any>;
}