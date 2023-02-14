import Locals from "../../config/Locals";
import {IArticle} from "../../interfaces/models/Article";
import IContent from "../../interfaces/models/Content";

export async function getArticleById(internalId: number) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}getArticle?id=${internalId}`, {
    method: "GET",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await fetchData.json();
}

export async function searchKeywordsContent(article: IArticle) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}createContent`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({article: article})
  })

  return await fetchData.json();
}

export async function getTranslatedKeywords(article: IArticle) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}translateKeywords`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({article: article})
  })

  return await fetchData.json();
}

export async function createContentForArticle(content: IContent) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}createArticleContent`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({content})
  })

  return await fetchData.json();
}
