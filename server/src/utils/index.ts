import { _axios } from "./axios-utils"
import { readFileSync, createWriteStream } from "./file-system"

const delay = (delayInms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}

export { _axios as axios, delay, readFileSync, createWriteStream };