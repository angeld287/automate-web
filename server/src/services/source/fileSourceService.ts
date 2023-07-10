import { IFileSourceService } from "../../interfaces/IFileSourceService";
var fs = require('fs');

export class FileSourceService implements IFileSourceService {
    async getFileSource(path: string): Promise<any> {
        try {
            return await JSON.parse(fs.readFileSync(path).toString())
        } catch (error) {
            throw new Error(error.message);
        }
    }
}