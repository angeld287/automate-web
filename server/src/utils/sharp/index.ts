const sharp = require('sharp');


export const _sharp = async (filePath: any, destinationPath: string): Promise<any> => sharp(filePath)
    .resize(200, 200)
    .toFile(destinationPath)