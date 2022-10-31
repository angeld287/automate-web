import { createWriteStream } from "../file-system";
const https = require('https');

export const downloadImage = async (fileName: string, url: string): Promise<any> => {
    try {
        const file = await createWriteStream(fileName);
        return { success: true }
    } catch (error) {
        return { success: false, response: '', body: 'Error in axios request', errorDetails: error }
    }
}

//const file = createWriteStream()
//const request = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg", function (response) {
//    response.pipe(file);
//
//    // after download completed close filestream
//    file.on("finish", () => {
//        file.close();
//        console.log("Download Completed");
//    });
//});
//https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
