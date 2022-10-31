import { _axios } from "./axios-utils"
import { _fs } from "./file-system"

const delay = (delayInms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}

export { _axios as axios, delay, _fs as fs };