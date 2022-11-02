const compress_images = require("compress-images");

export const compressImage = async (filePath: string, destinationPath: string): Promise<any> => {
    console.log(filePath, destinationPath);
    
    compress_images(
        filePath,
        destinationPath,
        { compress_force: false, statistic: true, autoupdate: true },
        false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        {
            gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] },
        },
        function (err, completed) {
            if (completed === true) {
                // Doing something.
                console.log(completed);
                
                return { completed, destinationPath }
            }else{
                console.log(completed, err);
                return { completed, destinationPath, err }
            }
        }
    );
}