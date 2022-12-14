import Locals from "../../config/Locals";
import Media from "../../interfaces/models/Media";

// A mock function to mimic making an async request for data
export async function addMediaToWordpress(media: Media, token: string) {
  const result = fetch(`${Locals.config().WP_API_BASE_URL}media/${media.id}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(media)
  })
  return result
}
