export interface ITwittsService {
    
    getRecentTwits(): Promise<any>;
    
    getTwits(): Promise<any>;
}