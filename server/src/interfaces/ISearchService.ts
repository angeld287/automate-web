
export interface ISearchService {

    perform(index: string, keyword: string): Promise<Array<any>>;

}