import Locals from "../../config/Locals";
import ICategory from "../../interfaces/models/Category";

// A mock function to mimic making an async request for data
export async function getCategories() {
  const response = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}categoryList`, {
    method: "GET",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const result = await response.json();
  return result;
}

export async function addCategory(category: ICategory, token: string) {
  const response = await fetch(`${Locals.config().WS_BACKEND_BASE_URL}addCategory`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(category)
  })
  const result = await response.json();
  return result;
}
