import Locals from "../config/Locals";
import { IArticle } from "../interfaces/models/Article";

export const getHashCode = () => {
    const textList = [
      'blue',
      'red',
      'pink',
      'black',
      'purple',
      'orange',
      'grey',
      'white',
      'yellow',
    ];
    const randomFirstNumber = Math.floor(
      Math.random() * (textList.length - 1 - 0 + 1) + 0
    );
    const randomSecondNumber = Math.floor(
      Math.random() * (textList.length - 1 - 0 + 1) + 0
    );
  
    const string = textList[randomFirstNumber] + textList[randomSecondNumber];
    var hash = 0,
      i,
      chr;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i++) {
      chr = string.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

export const isValidUrl = (urlString: string) => {
  var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
  return !!urlPattern.test(urlString);
}

export const replaceSpace = (text: string): string => text.trim().replace(/(?: )/g, '_')

export const getGoogleSearchUrl = (name: string): string => `https://www.google.com/search?q=${encodeURIComponent(name.trim().replace(/(?: )/g, '-')).replace(/(?:-)/g, '+')}`

export const removeDuplicate = (items: Array<any>, filterProperty: string): Array<any> => {
  const ids = items.map(item => item[filterProperty])
  return items.filter((item, index) => !ids.includes(item[filterProperty], index + 1))
}

export const isValidImageUrl = (urlString: string) => {
  return(urlString.match(/\.(jpeg|jpg|gif|png|webp)$/) != null);
}

export const copyContent = (content: string) => {
  navigator.clipboard.writeText(content);
}

export const generateArticleLink = (article: IArticle) => {
  let title = article.title.toLowerCase().trim();
  const splitedTitle = title.split(" ");

  if(splitedTitle[0] === "el" && splitedTitle[1] === "aceite" && splitedTitle[2] === "de" && splitedTitle[3] === article.category?.trim().toLowerCase()){
    title = title.replace(`el aceite de ${article.category.trim().toLowerCase()}`, '')
  }

  if(splitedTitle[0] === "aceite" && splitedTitle[1] === "de" && splitedTitle[2] === article.category?.trim().toLowerCase()){
    title = title.replace(`aceite de ${article.category.trim().toLowerCase()}`, '')
  }
  return `https://${Locals.config().WP_DOMAIN}/${article.category?.trim()}/${replaceSpace(title[title.length-1] === "?" ? title.slice(0, -1) : title)}`
}