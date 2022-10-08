import { IPostService } from "../../interfaces/IPostService";
import Locals from "../../providers/Locals";
import { fetch } from "../../utils";

//https://example.com/wp-json/wp/v2/posts
export class postService implements IPostService {

    async getList(): Promise<Array<any>> {
        const result = await fetch(`${Locals.config().wordpressUrl}/posts`);
        return result;
    }

    async createPost(): Promise<any> {
        const result = await fetch(`${Locals.config().wordpressUrl}/posts`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                slug: "post-prueba-api",
                status: "draft",
                title: "Titulo",
                content: "contentnido",
                author: '1',
                categories: 'maiz'
            })
        });
        return result;
    }
}