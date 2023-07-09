import { IFileSourceService } from "../../interfaces/IFileSourceService";
var fs = require('fs');

export class FileSourceService implements IFileSourceService {
    async getFileSource(path: string): Promise<any> {
        try {
            const data = await JSON.parse(fs.readFileSync(path).toString())
            let allprops = []
            data.chats.list[0].messages.forEach(message => {
                //Object.keys(message).forEach(props => {
                //    console.log(allprops[props])
                //    if(allprops[props] === undefined) allprops.push(props)
                //})
            });

            console.log(data.chats.list[0].messages[10])
            return data
        } catch (error) {
            throw new Error(error.message);
        }
    }
}