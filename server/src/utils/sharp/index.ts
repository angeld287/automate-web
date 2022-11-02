import { IImageSharp } from "../../interfaces/Utils";
import Locals from "../../providers/Locals";

const sharp = require('sharp');

export const _sharp = (filePath: any, destinationPath: string): Promise<IImageSharp> => {
    return new Promise<IImageSharp>((resolve, reject) => {
        sharp(filePath)
            .resize(Locals.config().POST_IMAGE_WIDTH, Locals.config().POST_IMAGE_HEIGHT)
            .toFile(destinationPath)
            .then(data => {
                resolve({success: true, ...data});
            })
            .catch(err => {
                reject({success: false, error: err});
            });
    })
}
