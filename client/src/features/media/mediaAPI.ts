import Locals from "../../config/Locals";
import Media from "../../interfaces/models/Media";

// A mock function to mimic making an async request for data
export async function addMediaToWordpress(imageAddress: string, title: string, type: string, relatedId: number, orderNumber: string, token: string) {
  const result = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}uploadImage`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({imageAddress, title, type, relatedId, orderNumber, siteId: localStorage.getItem('default-site'), notCompress: true})
  })
  return result.json()
}

export async function updateMediaData(media: Media, token: string) {
  const result = await fetch(`${Locals.config().WP_API_BASE_URL}media/${media.id}`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(media)
  })
  return result.json()
}

export async function addMediaToWordpressOpenAI(text: string, relatedId: number, token: string, type?: string) {
  const result = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}openai/createImage`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({text, type, relatedId})
  })
  return result.json()
}

export async function searchImages(keyword: string, index?: string) {
  const result = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}searchImages`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({keyword, index})
  })
  return result.json()
}

export async function deleteImages(id: string) {
  const result = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}deleteImage`, {
    method: "DELETE",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({id})
  })
  return result.json()
}

export async function getImages(siteId: number) {
  const result = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}image/getList?siteId=${siteId}`, {
    method: "GET",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return result.json()
}