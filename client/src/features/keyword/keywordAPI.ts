import Locals from "../../config/Locals";
import {SubTitleContent} from "../../interfaces/models/Article";

export async function searchKeywordContent(subtitle: SubTitleContent) {
  const fetchData = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}searchKeyword`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({subtitle: subtitle})
  })

  return await fetchData.json();
}