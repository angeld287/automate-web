import Locals from "../../config/Locals";
import ISite from "../../interfaces/models/ISite";

// A mock function to mimic making an async request for data
export async function getSites() {
  const response = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}site/getAll`, {
    method: "GET",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const result = await response.json();
  return result;
}

export async function addSite(site: ISite, token: string) {
  const response = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}site/create`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(site)
  })
  const result = await response.json();
  return result;
}

export async function updateSite(site: ISite) {
  const response = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}site/update`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(site)
  })
  const result = await response.json();
  return result;
}


export async function setSelectedSite(id: number, token: string) {
  const response = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}site/setSelectedSite`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({id})
  })
  const result = await response.json();
  return result;
}