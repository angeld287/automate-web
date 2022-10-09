import { IPostService } from "../../interfaces/IPostService";
import { Post } from "../../interfaces/models/Post";
import Locals from "../../providers/Locals";
import { axios } from "../../utils";

export class postService implements IPostService {

    async getList(): Promise<Array<any>> {
        const response = await axios({ url: `${Locals.config().wordpressUrl}/posts` });
        //const result = await response.json();
        console.log(response);
        return []
    }

    async createPost(post: Post): Promise<any> {
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