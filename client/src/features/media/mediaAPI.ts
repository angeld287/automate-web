import Media from "../../interfaces/models/Media";

// A mock function to mimic making an async request for data
export async function addMediaToWordpress(media: Media, token: string) {
  const result = fetch("https://elaceite.de/wp-json/wp/v2/media", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
      'cache-control': 'no-cache',
    },
    body: JSON.stringify(media)
  })
  return result
}
