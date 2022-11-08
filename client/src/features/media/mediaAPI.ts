import Media from "../../interfaces/models/Media";

// A mock function to mimic making an async request for data
export async function addMediaToWordpress(media: Media, token: string) {
  const result = fetch("https://elaceite.de/wp-json/wp/v2/media/496", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(media)
  })
  return result
}
