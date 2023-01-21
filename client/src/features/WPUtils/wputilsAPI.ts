import Locals from "../../config/Locals";

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
