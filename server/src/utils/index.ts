import { _axios } from "./axios-utils"
import { readFileSync, createWriteStream } from "./file-system"
import { downloadImage } from "./http"
import { compressImage } from "./compress-images"
import { _sharp } from "./sharp"

const delay = (delayInms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}

export { _axios as axios, delay, readFileSync, createWriteStream, downloadImage, compressImage, _sharp as sharp };