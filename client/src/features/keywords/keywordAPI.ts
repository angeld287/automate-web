import Locals from "../../config/Locals";

export async function addRemoveKeywordToArticle(id: string, articleId: string | null, orderNumber: string | null) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}keywords/addRemoveKeywordToArticle`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id, articleId, orderNumber})
  })

  return await fetchData.json();
}

export async function setMainKeyword(id: string, isMain: boolean) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}keywords/setMainKeyword`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id, isMain})
  })

  return await fetchData.json();
}

export async function getKeywordsByArticleId(articleId: number) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}keywords/getAllByArticleId?articleId=${articleId}`, {
    method: "GET",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await fetchData.json();
}