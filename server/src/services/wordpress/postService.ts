import { INewArticle } from "../../interfaces/Content/Article";
import Post from "../../interfaces/models/Post";
import { IPostService } from "../../interfaces/wordpress/IPostService";
import Locals from "../../providers/Locals";
import { axios, fetch } from "../../utils";

export default class postService implements IPostService {

    async getList(): Promise<Array<Post>> {
        const response = await axios({ url: `${Locals.config().wordpressUrl}/posts` });
        return await response.json();
    }

    async create(post: Post, token: string): Promise<Post> {
        const result = await axios({
            url: `${Locals.config().wordpressUrl}/posts`,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(post)
        });
        return result;
    }

    async createNf(post: Post, token: string): Promise<Post | false> {
        const result = await fetch(`${Locals.config().wordpressUrl}posts`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(post)
        });
        return result.success ? result.body : false;
    }
}