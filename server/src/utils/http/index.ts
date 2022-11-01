import { createWriteStream } from "../file-system";
const https = require('https');


export const downloadImage = async (file: any, url: string): Promise<any> => {
    try {
                
        https.get(url, function (response) {
            response.pipe(file);

            file.on("finish", () => {
                file.close();
                console.log("Download Completed");
            });
        });
        
        return { success: true }
        
    } catch (error) {
        return { success: false, response: '', body: 'Error in downloadImage request', errorDetails: error }
    }
}