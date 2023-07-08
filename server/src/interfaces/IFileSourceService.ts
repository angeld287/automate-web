export interface IFileSourceService {
    getFileSource(path: string): Promise<any>;
}