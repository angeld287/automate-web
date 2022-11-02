import { IImageSize } from "../../interfaces/Utils";

var imagesize = require('imagesize');
const https = require('https');

export const _imagesize = (url: string): Promise<IImageSize> => {

    return new Promise<IImageSize>((resolve, reject) => {
        https.get(url, function (response) {
            imagesize(response, function (err: Error, result: IImageSize) {
                if (err) {
                    reject({ success: false, message: 'Error on imagesize process', error: err });
                }
                resolve({ success: true, ...result });
            });
        });
    })
}