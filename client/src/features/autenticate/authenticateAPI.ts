import Locals from "../../config/Locals";
import Authenticate from "../../interfaces/models/Authenticate";

// A mock function to mimic making an async request for data
export async function getBearer() {
  const authenticate: Authenticate = {
    username: Locals.config().WORDPRESS_USER,
    password: Locals.config().WORDPRESS_USER_PASSWORD,
  }
  const result = fetch(Locals.config().TOCKEN_URL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authenticate)
  })
  return result
}
