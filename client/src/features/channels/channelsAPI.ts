import Locals from "../../config/Locals";

export async function getAllChannels() {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}crypto/getAllChannels`, {
    method: "GET",
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })

  return await fetchData.json();
}

export async function getAllMessagesByChannelId(channelId: string) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}crypto/getAllChannelMessages?channelId=${channelId}`, {
    method: "GET",
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })

  return await fetchData.json();
}