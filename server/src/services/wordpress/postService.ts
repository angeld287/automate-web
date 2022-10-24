import Post from "../../interfaces/models/Post";
import { IPostService } from "../../interfaces/wordpress/IPostService";
import Locals from "../../providers/Locals";
import { axios } from "../../utils";

export default class postService implements IPostService {

    async getList(): Promise<Array<Post>> {
        const response = await axios({ url: `${Locals.config().wordpressUrl}/posts` });
        return await response.json();
    }

    async create(post: Post): Promise<Post> {
        const result = await axios({
            url: `${Locals.config().wordpressUrl}/posts`,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        });
        return result;
    }
}