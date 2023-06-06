import FBGraphAPI from 'fb-graph-api';
import Locals from "./Locals";

class fbGraphApi {
    public createClient(): FBGraphAPI { 
        return new FBGraphAPI({
            clientID: Locals.config().FACEBOOK_CLIENT_ID,
            clientSecret: Locals.config().FACEBOOK_CLIENT_SECRET,
            appAccessToken: Locals.config().FACEBOOK_CLIENT_ACCESS_TOKEN
        });
    }
}

export default fbGraphApi;