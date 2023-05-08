import { _axios } from "./axios-utils"
import { _fetch } from "./fetch-utils"
import { readFileSync, createWriteStream } from "./file-system"
import { downloadImage } from "./http"
import { _sharp } from "./sharp"
import { _imagesize  } from "./imagesize"
import { addMedia  } from "./wpapi"
import { INewArticle } from "../interfaces/Content/Article"
import Locals from "../providers/Locals"

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

export const isValidUrl = (urlString: string) => {
  var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
  return !!urlPattern.test(urlString);
}

export const isValidImageUrl = (urlString: string) => {
  return(urlString.match(/\.(jpeg|jpg|gif|png|webp)$/) != null);
}

export const replaceSpace = (text: string): string => text.replace(/(?: )/g, '_')
export const replaceSpaceForPlus = (text: string): string => text.replace(/(?: )/g, '+')
export const replacePlusForSpace = (text: string): string => text.replace(/(?:\+)/g, ' ')
export const removeAccentMark = (text: string): string => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

export const generateArticleSlug = (article: INewArticle) => {
  let title = article.title.toLowerCase().trim();
  const splitedTitle = title.split(" ");

  if(splitedTitle[0] === "el" && splitedTitle[1] === "aceite" && splitedTitle[2] === "de" && splitedTitle[3] === article.category?.trim().toLowerCase()){
    title = title.replace(`el aceite de ${article.category.trim().toLowerCase()}`, '')
  }

  if(splitedTitle[0] === "aceite" && splitedTitle[1] === "de" && splitedTitle[2] === article.category?.trim().toLowerCase()){
    title = title.replace(`aceite de ${article.category.trim().toLowerCase()}`, '')
  }
  return `${replaceSpace(title[title.length-1] === "?" ? title.slice(0, -1) : title)}`
}

export const generateArticleLink = (article: INewArticle) => {
  return `https://${Locals.config().WP_DOMAIN}/${article.category?.trim()}/${generateArticleSlug(article)}`
}

export { removeDuplicate, _fetch as fetch, _axios as axios, delay, readFileSync, createWriteStream, downloadImage, _sharp as sharp, _imagesize as imagesize, addMedia };