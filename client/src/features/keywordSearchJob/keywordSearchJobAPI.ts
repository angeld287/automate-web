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