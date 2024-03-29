import Locals from "../../config/Locals";
import {SubTitleContent} from "../../interfaces/models/Article";
import IContent from "../../interfaces/models/Content";

export async function searchKeywordContent(subtitle: SubTitleContent) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}searchKeyword`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({subtitle: subtitle})
  })

  return await fetchData.json();
}

export async function createContent(content: Array<IContent>) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}createSubtitleContent`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({content})
  })

  return await fetchData.json();
}

export async function searchSubtitle(subtitle: SubTitleContent) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}getSubtitleFromDb?id=${subtitle.id}`, {
    method: "GET",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await fetchData.json();
}

export async function deleteSubtitle(id: number) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}subtitle/delete`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id})
  })

  return await fetchData.json();
}