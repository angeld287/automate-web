import ISitesService from "../../interfaces/ISitesService";
import Media from "../../interfaces/models/Media";
import Locals from "../../providers/Locals";
import { sitesService } from "../../services/sitesServices/sitesServices";
var WPAPI = require('wpapi');

export const addMedia = async (filePath: any, media: Media, associatedPostId: number, token: string ): Promise<any> => {
    try {
        const wp = login(token);

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
        console.log('Error en add media: ', error);
       return { success: false, message: 'Error on media upload process', error }
    }
}

const login = (token: string) => {
    const wp = new WPAPI({});

    wp.setHeaders('Content-Type', 'application/json');
    wp.setHeaders('cache-control', 'no-cache');
    wp.setHeaders('Authorization', token);

    return wp
}
