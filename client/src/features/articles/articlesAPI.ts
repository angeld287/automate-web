import Locals from "../../config/Locals";

export async function getArticlesFromDb(page: number, size: number) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}getArticles?page=${page}&size=${size}&siteId=${localStorage.getItem('default-site')}`, {
    method: "GET",
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })

  return await fetchData.json();
}

export async function getAllArticlesByCategory(category: string) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}getArticlesByCategory?category=${category}&siteId=${localStorage.getItem('default-site')}`, {
    method: "GET",
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })

  return await fetchData.json();
}

export async function getPlanningArticlesFromDb(jobId: number) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}getPlanningArticles?id=${jobId}`, {
    method: "GET",
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })

  return await fetchData.json();
}

export async function getAIResearchedArticlesFromDb() {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}getAIResearchedArticles?siteId=${localStorage.getItem('default-site')}}`, {
    method: "GET",
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })

  return await fetchData.json();
}

export async function getWpCreatedArticlesFromDb() {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}getWpCreatedArticles?siteId=${localStorage.getItem('default-site')}`, {
    method: "GET",
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })

  return await fetchData.json();
}