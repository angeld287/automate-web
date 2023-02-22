import Post from "../models/Post";

export interface IPostService {
    getList(): Promise<Array<Post>>;

    create(post: Post, token: string): Promise<Post>;

    createNf(post: Post, token: string): Promise<Post | false>;
}