import { IPromiseBase } from "../../interfaces/Utils";

const https = require('https');

export const downloadImage = (file: any, url: string): Promise<IPromiseBase> => {

    return new Promise<IPromiseBase>((resolve, reject) => {
        https.get(url, function (response) {

            response.pipe(file);

            file.on("finish", () => {
                file.close();
                resolve({ success: true });
            });

            file.on("error", (err) => {
                file.close();
                reject({ success: false, message: 'Error on file pipe process', error: err });
            });        
            
        }).on('error', (err) => {
            reject({ success: false, message: 'Error on https.get process', error: err });
        });
    })
}