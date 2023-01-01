import Locals from "../../config/Locals";
import {IArticle} from "../../interfaces/models/Article";

export async function searchKeywordsContent(article: IArticle) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}createContent`, {
    method: "POST",
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
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({article: article})
  })

  return await fetchData.json();
}
