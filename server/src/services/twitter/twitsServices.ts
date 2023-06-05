import { ITwittsService } from "../../interfaces/ITwittsService";
import TwitterApi from "../../providers/TwitterApi";

export class twitsService implements ITwittsService {
    async getRecentTwits(): Promise<any> {
        try {
            const twitter = new TwitterApi();
            const twitterClient = twitter.createClient();

            const recentSearch = await twitterClient.tweetsV2.searchRecentTweets({
                //One query/rule/filter for matching Tweets. Refer to https://t.co/rulelength to identify the max query length
                query: "(from:TwitterDev) new -is:retweet",
            });


            console.log('resultado: ',recentSearch);
            
        } catch (error) {
            console.log(error)
        }
    }

    async getTwits(): Promise<any> {
        try {
            const twitter = new TwitterApi();
            const twitterClient = twitter.createClient();

            const recentSearch = await twitterClient.tweets.search({
                q: 'messi',
            });


            console.log('resultado: ',recentSearch);
            
        } catch (error) {
            console.log(error)
        }
    }
}