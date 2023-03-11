import Locals from "../../config/Locals";

export async function getAllSearchJobs() {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}keywords/getAllSearchJobs`, {
    method: "GET",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await fetchData.json();
}

export async function getSearchJob(id: number) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}keywords/getSearchJob?id=${id}`, {
    method: "GET",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await fetchData.json();
}

export async function selectPotentialKeyword(id: number, selected: boolean) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}keywords/selectPotentialKeyword`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id, selected})
  })

  return await fetchData.json();
}

export async function addRemoveKeywordToArticle(id: number, articleId: number | null) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}keywords/addRemoveKeywordToArticle`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id, articleId})
  })

  return await fetchData.json();
}