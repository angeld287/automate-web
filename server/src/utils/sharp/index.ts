const sharp = require('sharp');


export const _sharp = (filePath: any, destinationPath: string): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
        sharp(filePath)
            .resize(590, 350)
            .toFile(destinationPath)
            .then(data => {
                resolve({success: true, result: data});
            })
            .catch(err => { 
                reject({success: false, result: err}); 
            });
    })
}
