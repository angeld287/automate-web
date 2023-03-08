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

const removeDuplicate = (items: Array<any>, filterProperty: string): Array<any> => {
    const ids = items.map(item => item[filterProperty])
    return items.filter((item, index) => !ids.includes(item[filterProperty], index + 1))
}

export const replaceSpace = (text: string): string => text.replace(/(?: )/g, '_')
export const replaceSpaceForPlus = (text: string): string => text.replace(/(?: )/g, '+')
export const replacePlusForSpace = (text: string): string => text.replace(/(?:\+)/g, ' ')

export { removeDuplicate, _fetch as fetch, _axios as axios, delay, readFileSync, createWriteStream, downloadImage, _sharp as sharp, _imagesize as imagesize, addMedia };