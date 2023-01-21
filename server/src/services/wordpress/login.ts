import ILogin, { IAuthenticate } from "../../interfaces/wordpress/ILogin"
import Locals from "../../providers/Locals"
import { fetch } from "../../utils"


export default class Login implements ILogin {

    async getToken(): Promise<any> {
        const authenticate: IAuthenticate = {
          username: Locals.config().WORDPRESS_USER,
          password: Locals.config().WORDPRESS_USER_PASSWORD,
        }
        const result = await fetch(Locals.config().TOCKEN_URL, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(authenticate)
        });
        return result
    }
}