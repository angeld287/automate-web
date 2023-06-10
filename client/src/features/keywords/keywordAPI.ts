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

export async function createKeyword(name: string, jobId: string) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}keywords/createManual`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name, keywordSearchJobId: jobId})
  })

  return await fetchData.json();
}

export async function updateKeywordCategory(id: string, category: string) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}keywords/updateCategory`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id, category})
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

export async function createKeywordForArticle(articleId: number, name: string, orderNumber: number) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}keywords/createForArticle`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({articleId, name, orderNumber})
  })

  return await fetchData.json();
}

export async function createArticleFromKeyword(text: string, keywordId: number, jobId: number, category: string, token: string) {
  const result = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}openai/createArticle`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({text, keywordId, jobId, category, siteId: localStorage.getItem('default-site')})
  })
  return result.json()
}