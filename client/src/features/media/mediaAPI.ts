import Locals from "../../config/Locals";
import Media from "../../interfaces/models/Media";

// A mock function to mimic making an async request for data
export async function addMediaToWordpress(imageAddress: string, title: string, token: string) {
  const result = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}uploadImage`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({imageAddress, title})
  })
  return result.json()
}

export async function updateMediaData(media: Media, token: string) {
  const result = fetch(`${Locals.config().WP_API_BASE_URL}media/${media.id}`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(media)
  })
  return result
}
