import Locals from "../../config/Locals";


export async function startNewJob(longTailKeyword: string, mainKeywords: Array<string>) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}keywordsSearchJob/start`, {
    method: "GET",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({longTailKeyword, mainKeywords})
  })

  return await fetchData.json();
}

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

export async function deleteKeywordSearchJob(id: number) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}keywordsSearchJob/delete`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id})
  })

  return await fetchData.json();
}