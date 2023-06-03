import { TwitterClient } from 'twitter-api-client';
import Locals from "./Locals";
//import Log from '../middlewares/Log';

class TwitterApi {
    public createClient(): TwitterClient { 
            return new TwitterClient({
                apiKey: Locals.config().TWITTER_API_KEY,
                apiSecret: Locals.config().TWITTER_API_SECRET,
                accessToken: Locals.config().TWITTER_ACCESS_TOKEN,
                accessTokenSecret: Locals.config().TWITTER_ACCESS_TOKEN_SECRET,
            });
    }
}

export default TwitterApi;