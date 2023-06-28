import {IResultsAndSuggestions} from "./response/ISearchKeyword";

export interface ISearchService {

    perform(index: string, keyword: string): Promise<Array<any>>;

    getResultsAndSuggestions(keyword: string): Promise<IResultsAndSuggestions>;

    searchImages(index: string, keyword: string): Promise<Array<any>>;

    searchRecents(index: string, keyword: string): Promise<Array<any>>;

    searchResults(num: string, index: string, keyword: string): Promise<Array<any>>;

}