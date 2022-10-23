import { Post } from "../models/Post";

export interface IPostService {
    getList(): Promise<Array<Post>>;

    create(post: Post): Promise<Post>;
}