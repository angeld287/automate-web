import { _axios } from "./axios-utils"
import { _fetch } from "./fetch-utils"
import { readFileSync, createWriteStream } from "./file-system"
import { downloadImage } from "./http"
import { _sharp } from "./sharp"
import { _imagesize  } from "./imagesize"
import { addMedia  } from "./wpapi"

const delay = (delayInms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}

export { _fetch as fetch, _axios as axios, delay, readFileSync, createWriteStream, downloadImage, _sharp as sharp, _imagesize as imagesize, addMedia };