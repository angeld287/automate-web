import Media from "../../interfaces/models/Media";
import Locals from "../../providers/Locals";
var WPAPI = require('wpapi');

export const addMedia = (filePath: any, media: Media, associatedPostId: number ): Promise<any> => {
    var wp = new WPAPI({ endpoint: Locals.config().WP_JSON_URL });
    return new Promise<any>((resolve, reject) => {
        wp.media()
            // Specify a path to the file you want to upload, or a Buffer
            .file(filePath)
            .create(media)
            .then(function (response) {
                // Your media is now uploaded: let's associate it with a post
                var newImageId = response.id;
                return wp.media().id(newImageId).update({
                    post: associatedPostId
                });
            })
            .then(function (response) {
                resolve({ success: true, message: 'Success', data: response });
            })
            .catch(function (error) {
                reject({ success: false, message: 'Error on media upload process', error });
            })
    })
}
