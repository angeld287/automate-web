const sharp = require('sharp');


export const _sharp = async (filePath: any, destinationPath: string): Promise<any> => sharp(filePath)
    .resize(590, 350)
    .toFile(destinationPath)
    .then(data => {
        console.log("succ", data)
    })
    .catch(err => {console.log(err)});
