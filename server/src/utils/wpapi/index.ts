import Media from "../../interfaces/models/Media";
import Locals from "../../providers/Locals";
var WPAPI = require('wpapi');

export const addMedia = async (filePath: any, media: Media, associatedPostId: number ): Promise<any> => {

    try {
        const wp = login();

        const result = await wp.media().file(filePath).create(media).then( (response) => {
            // Your media is now uploaded: let's associate it with a post
            if (associatedPostId === 0) {
                return response;
            }
            var newImageId = response.id;
            return wp.media().id(newImageId).update({
                post: associatedPostId
            });
        });

       return { success: true, message: 'Success', data: result }
    } catch (error) {
       return { success: false, message: 'Error on media upload process', error }
    }
}

const login = () => {
    return new WPAPI({
        endpoint: Locals.config().WP_JSON_URL,
        username: Locals.config().WORDPRESS_USER,
        password: Locals.config().WORDPRESS_USER_PASSWORD
    });
}
