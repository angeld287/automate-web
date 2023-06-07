import fbGraphApi from "../../providers/fbGraphApi";

export class fbGraphServices {
    async getPosts(): Promise<any> {
        try {
            const facebook = new fbGraphApi();
            const fbClient = facebook.createClient();

            const recentSearch = await fbClient.generateAppAccessToken()


            console.log('resultado: ',recentSearch);
            
        } catch (error) {
            console.log(error)
        }
    }
}