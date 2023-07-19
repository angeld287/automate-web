import Locals from "../../config/Locals";

export async function StartDofollowSearchJob(query: string) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}site/dofollowSearchJob`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({query})
  })

  return await fetchData.json();
}